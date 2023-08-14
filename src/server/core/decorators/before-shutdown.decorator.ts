import 'reflect-metadata';
import {MethodType} from "../enums";
import {ServerDecoratorBase} from "./server-decorator-base.decorator";

export function BeforeShutdown() {
	return ServerDecoratorBase(MethodType.BeforeShutdown);
}