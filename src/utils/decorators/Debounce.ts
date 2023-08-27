import { FunctionType } from "../types";
import { debounce } from "../debounce";

export function Debounce<T extends FunctionType>(delay: number = 0): MethodDecorator {
	return function (
		this: ThisParameterType<T>,
		target: Object,
		propertyKey: string | symbol,
		descriptor: PropertyDescriptor
	) {
		const originalMethod = descriptor.value as T;
		descriptor.value = debounce.call(this, originalMethod, delay);

		return descriptor;
	};
}