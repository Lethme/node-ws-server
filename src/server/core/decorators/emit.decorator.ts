import 'reflect-metadata';
import {MethodType} from "../enums";
import {ServerDecoratorBase} from "./server-decorator-base.decorator";

export function Emit(event?: string) {
	return ServerDecoratorBase(MethodType.Emit, event);
}