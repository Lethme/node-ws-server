import { FunctionType } from "./types";

type ThrottleCallbackType<T extends FunctionType> = (...args: Parameters<T>) => void;

export function throttle<T extends FunctionType>(this: ThisParameterType<T>, func: T, interval: number): ThrottleCallbackType<T> {
	let isThrottled = false;
	let lastArgs: Parameters<T> | null = null;

	return function (this: ThisParameterType<T>, ...args: Parameters<T>) {
		if (!isThrottled) {
			func.apply(this, args);
			isThrottled = true;
			setTimeout(() => {
				isThrottled = false;
				if (lastArgs !== null) {
					func.apply(this, lastArgs);
					lastArgs = null;
				}
			}, interval);
		} else {
			lastArgs = args;
		}
	};
}