import {ReactiveRegister} from "./reactive-register";

export type ComputedValue<T> = T extends object ? Readonly<T> : T;
export type ComputedUpdate<T> = (value: T, old: T) => T;
export type ComputedWatcher<T> = (value: T, old: T) => void;

export interface Computed<T> {
	readonly value: ComputedValue<T>;
	watch(watcher: ComputedWatcher<T>): Computed<T>;
	unwatch(watcher?: ComputedWatcher<T>): void;
}

export interface ComputedWrapper<T> extends Computed<T> {
	id: number;
	update(): void;
}

export function computed<T>(watcher: ComputedUpdate<T>): Computed<T> {
	let oldComputedValue: T | undefined;
	let computedValue: T | undefined;

	computedValue = watcher.call(null, computedValue as T, oldComputedValue as T);

	const computedWatchers: Array<ComputedWatcher<T>> = [];
	const computedObj = {};

	Object.defineProperty(computedObj, 'value', {
		get(): T {
			//computedValue = watcher.call(computedValue, computedValue as T, oldComputedValue as T);
			return typeof computedValue === 'object' ? Object.freeze(computedValue) as Readonly<T> : computedValue as T;
		},
	});

	Object.defineProperty(computedObj, 'update', {
		value: function (this: Computed<T>) {
			computedValue = watcher.call(computedValue, computedValue as T, oldComputedValue as T);

			for (const watcher of computedWatchers) {
				watcher && watcher.call(computedValue, computedValue as T, oldComputedValue as T);
			}
		}
	});

	Object.defineProperty(computedObj, 'watch', {
		value: function (this: Computed<T>, watcher: ComputedWatcher<T>) {
			watcher && computedWatchers.push(watcher);
			return this;
		}
	});

	Object.defineProperty(computedObj, 'unwatch', {
		value: function (this: Computed<T>, watcher?: ComputedWatcher<T>) {
			if (watcher) {
				const watcherIndex = computedWatchers.indexOf(watcher);

				if (watcherIndex !== -1) {
					computedWatchers.splice(watcherIndex, 1);
				}

				return;
			}

			computedWatchers.splice(0, computedWatchers.length);
		}
	});

	const id = ReactiveRegister.RegisterComputed(computedObj as Computed<T>);

	Object.defineProperty(computedObj, 'id', {
		get(): number { return id; }
	});

	return computedObj as Computed<T>;
}