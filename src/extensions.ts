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
	 * @param selector - Key selector to distinct the given array.
	 * @returns New array that doesn't contain any the same elements relying on distinct key selector callback.
	 */
	distinct<K>(selector?: (value: T, index: number, array: Array<T>) => K): Array<T>;

	/**
	 * Group array elements by selected key.
	 *
	 * @param selector - Key selector to group the given array.
	 */
	group<K>(selector?: (value: T, index: number, array: Array<T>) => K): Map<K, Array<T>>;

	/**
	 * Returns the element by its index.
	 * If index is out of bounds method will return element by mod operation.
	 *
	 * @example
	 * // Usage example
	 * const array = [1, 2, 3];
	 *
	 * array.at(0); // 1
	 * array.at(2); // 3
	 *
	 * array.at(3); // 1
	 * array.at(5); // 3
	 *
	 * array.at(-1) // 3
	 * array.at(-3) // 1
	 *
	 * @param {number} index - Index of an array element.
	 *
	 * @returns Element of the given array.
	 */
	at(index: number): T;

	/**
	 * Returns the first element of the array if no callback was provided.
	 * Else returns the first element accepted by callback condition.
	 *
	 * @param predicate - Callback which provides the condition to search in array.
	 *
	 * @returns Element of the given array.
	 */
	first(predicate?: (value: T, index: number, array: Array<T>) => boolean): T;

	/**
	 * Returns the last element of the array if no callback was provided.
	 * Else returns the last element accepted by callback condition.
	 *
	 * @param predicate - Callback which provides the condition to search in array.
	 *
	 * @returns Element of the given array.
	 */
	last(predicate?: (value: T, index: number, array: Array<T>) => boolean): T;
}

Object.defineProperty(Array.prototype, 'distinct', {
	value: function <T>(this: Array<T>, callback?: (value: T, index: number, array: Array<T>) => any): T[] {
		if (!callback) {
			return [...new Set<T>(this)];
		}

		const distinctValues = new Map();

		for (let i = 0; i < this.length; i++) {
			const el = this[i];
			const key = callback(el, i, this);

			if (!distinctValues.has(key)) {
				distinctValues.set(key, el);
			}
		}

		return Array.from(distinctValues.values());
	},
	enumerable: true,
});

Object.defineProperty(Array.prototype, 'group', {
	value: function <T, K>(this: Array<T>, selector?: (value: T, index: number, array: Array<T>) => K): Map<K, Array<T>> {
		const groupedValues = new Map();

		for (let i = 0; i < this.length; i++) {
			const el = this[i];
			const key = selector ? selector(el, i, this) : el;

			if (!groupedValues.has(key)) {
				groupedValues.set(key, []);
			}

			groupedValues.get(key).push(el);
		}

		return groupedValues;
	},
	enumerable: true,
});

Object.defineProperty(Array.prototype, 'at', {
	value: function <T>(this: Array<T>, index: number): T {
		const rem = index % this.length;
		return rem >= 0 ? this[rem] : this[this.length + rem];
	},
	enumerable: true,
});

Object.defineProperty(Array.prototype, 'first', {
	value: function <T>(this: Array<T>, predicate?: (value: T, index: number, array: Array<T>) => boolean): T {
		if (predicate) {
			for (let i = 0; i < this.length; i++) {
				const el = this[i];

				if (predicate(el, i, this)) {
					return el;
				}
			}
		}

		return this[0];
	}
});

Object.defineProperty(Array.prototype, 'last', {
	value: function <T>(this: Array<T>, predicate?: (value: T, index: number, array: Array<T>) => boolean): T {
		if (!this.length) return this[0];

		if (predicate) {
			for (let i = this.length - 1; i >= 0; i--) {
				const el = this[i];

				if (predicate(el, i, this)) {
					return el;
				}
			}
		}

		return this[this.length - 1];
	}
});