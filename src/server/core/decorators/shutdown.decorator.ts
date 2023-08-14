import 'reflect-metadata';
import {MethodType} from "../enums";
import {ServerDecoratorBase} from "./server-decorator-base.decorator";

export function Shutdown() {
	return ServerDecoratorBase(MethodType.Shutdown);
}