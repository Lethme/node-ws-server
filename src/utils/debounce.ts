import { FunctionType } from "./types";

export type DebounceCallbackType<T extends FunctionType> = (...args: Parameters<T>) => void;

export function debounce<T extends FunctionType>(this: ThisParameterType<T>, func: T, delay: number = 0): DebounceCallbackType<T> {
	let timeoutId: NodeJS.Timeout;

	return function (this: ThisParameterType<T>, ...args: Parameters<T>) {
		clearTimeout(timeoutId);
		timeoutId = setTimeout(func.bind(this, ...args), delay);
	}
}