import 'reflect-metadata';
import {MethodType} from "../enums";
import {ServerDecoratorBase} from "./server-decorator-base.decorator";

export function Listen(event?: string) {
	return ServerDecoratorBase(MethodType.Listen, event);
}