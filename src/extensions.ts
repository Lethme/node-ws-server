/**
 * String Extensions
 */
declare interface String {
	/**
	 * Capitalizes the given string
	 */
	capitalize(): string;

	/**
	 * Replaces {N} placeholder with given arguments.
	 * N starts from 1 and each occurrence of {1} is replaced with 0 index argument, {2} will be replaced by 1 index argument etc.
	 *
	 * @param args - Sequence of string or number arguments which will replace {n} argument in template string
	 * @returns Replaced template string
	 */
	bindArgs(...args: Array<string | number>): string;

	/**
	 * Replaces {prop_name} placeholder for the same prop_title of the given object.
	 *
	 * @param obj - Object containing fields to replace placeholders in the given template string
	 * @returns Replaced template string
	 */
	bind(obj: Record<string, any>): string;
}

Object.defineProperty(String.prototype, 'capitalize', {
	value: function (this: string) {
		return this.charAt(0).toUpperCase() + this.slice(1);
	},
	enumerable: true,
});

Object.defineProperty(String.prototype, 'bindArgs', {
	value: function (this: string, ...args: Array<string | number>) {
		return this.replace(/{(\d+)}/g, (match: string, num: string) => {
			return String(args[parseInt(num, 10) - 1] ?? match);
		});
	},
	enumerable: true,
});

Object.defineProperty(String.prototype, 'bind', {
	value: function (this: string, obj: Record<string, any>) {
		return this.replace(/{(\w+)}/g, (match: string, key: string) => {
			return String(obj[key] ?? match);
		});
	},
	enumerable: true,
});

/**
 * Array Extensions
 */
declare interface Array<T> {
	/**
	 * Distinct the given array by the key selected by the callback.
	 *
	 * @param callback - Key selector to distinct given array.
	 * @returns New array that doesn't contain any the same elements relying on distinct key selector callback.
	 */
	distinct(callback?: (value: T) => any): Array<T>;
}

Object.defineProperty(Array.prototype, 'distinct', {
	value: function <T>(callback?: (value: T) => any): T[] {
		if (!callback) {
			return [...new Set<T>(this)];
		}
		const distinctValues = new Map();
		for (const element of this) {
			const key = callback(element);
			if (!distinctValues.has(key)) {
				distinctValues.set(key, element);
			}
		}
		return Array.from(distinctValues.values());
	},
});