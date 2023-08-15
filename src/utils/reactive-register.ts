import {Computed, ComputedWrapper} from "./computed";
import {Proxy} from "./proxy";

export class ReactiveRegister {
	private static readonly _ProxyMap = new Map<number, Proxy<any>>();
	private static readonly _ComputedMap = new Map<number, ComputedWrapper<any>>();

	private static GetAvailableMapKey<T>(map: Map<number, T>): number {
		let keys = Array.from(map.keys());
		keys.sort((a, b) => a - b);

		let lowestAvailableKey = 0;

		for (const key of keys) {
			if (key > lowestAvailableKey) {
				break;
			}
			lowestAvailableKey = key + 1;
		}

		return lowestAvailableKey;
	}

	private static async Update() {
		for (const computed of ReactiveRegister._ComputedMap.values()) {
			computed.update();
		}
	}

	public static RegisterProxy<T>(proxy: Proxy<T>): number {
		const key = this.GetAvailableMapKey(this._ProxyMap);
		this._ProxyMap.set(key, proxy);

		proxy.watch(this.Update);

		return key;
	}

	public static RegisterComputed<T>(computed: Computed<T>): number {
		const key = this.GetAvailableMapKey(this._ComputedMap);
		this._ComputedMap.set(key, computed as ComputedWrapper<T>);

		return key
	}
}