import 'reflect-metadata';
import {MethodType} from "../enums";
import {ServerDecoratorBase} from "./server-decorator-base.decorator";

export function Connection() {
	return ServerDecoratorBase(MethodType.Connection);
}