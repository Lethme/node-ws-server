import {ReactiveRegister} from "./reactive-register";

export type ProxyValue<T> = T extends object ? Readonly<T> : T;
export type ProxyWatcher<T> = (value: T, old: T) => void | Promise<void>;

export interface Proxy<T> {
	value: ProxyValue<T>;
	watch(watcher: ProxyWatcher<T>): Proxy<T>;
	unwatch(watcher?: ProxyWatcher<T>): void;
}

export interface ProxyWrapper<T> extends Proxy<T> {
	id: number;
}

export function proxy<T>(initialValue?: T, callback?: ProxyWatcher<T>): Proxy<T> {
	let oldProxyValue: T | undefined;
	let proxyValue: T | undefined = initialValue;
	const proxyWatchers: Array<ProxyWatcher<T>> = [];
	const proxyObj = {};

	callback && callback.call(proxyValue, proxyValue as T, oldProxyValue as T);

	Object.defineProperty(proxyObj, 'value', {
		get(): T {
			return typeof proxyValue === 'object' ? Object.freeze(proxyValue) as Readonly<T> : proxyValue as T;
		},
		set(v: T) {
			if (v !== proxyValue) {
				oldProxyValue = proxyValue;
				proxyValue = v;

				for (const watcher of [callback, ...proxyWatchers]) {
					watcher && watcher.call(proxyValue, proxyValue as T, oldProxyValue as T);
				}
			}
		}
	});

	Object.defineProperty(proxyObj, 'watch', {
		value: function (this: Proxy<T>, watcher: ProxyWatcher<T>) {
			watcher && proxyWatchers.push(watcher);
			return this;
		}
	});

	Object.defineProperty(proxyObj, 'unwatch', {
		value: function (this: Proxy<T>, watcher?: ProxyWatcher<T>) {
			if (watcher) {
				const watcherIndex = proxyWatchers.indexOf(watcher);

				if (watcherIndex !== -1) {
					proxyWatchers.splice(watcherIndex, 1);
				}

				return;
			}

			proxyWatchers.splice(0, proxyWatchers.length);
		}
	});

	const id = ReactiveRegister.RegisterProxy(proxyObj as Proxy<T>);

	Object.defineProperty(proxyObj, 'id', {
		get(): number { return id; }
	});

	return proxyObj as Proxy<T>;
}