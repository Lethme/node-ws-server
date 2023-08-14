Object.defineProperty(String.prototype, 'capitalize', {
    value: function (this: string) {
        return this.charAt(0).toUpperCase() + this.slice(1);
    },
    enumerable: true,
});

Object.defineProperty(String.prototype, 'bind', {
    value: function (this: string, ...args: Array<string | number>) {
        return this.replace(/%(\d+)/g, (match: string, num: string) => {
            return String(args[parseInt(num, 10) - 1] ?? '');
        });
    },
    enumerable: true,
});

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
    enumerable: true,
});