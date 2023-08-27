import { FunctionType } from "../types";
import { throttle } from "../throttle";

export function Throttle<T extends FunctionType>(delay: number = 0): MethodDecorator {
	return function (
		this: ThisParameterType<T>,
		target: Object,
		propertyKey: string | symbol,
		descriptor: PropertyDescriptor
	) {
		const originalMethod = descriptor.value as T;
		descriptor.value = throttle.call(this, originalMethod, delay);

		return descriptor;
	};
}