import {MethodType} from "../enums";

export interface MethodDescription {
	name: string;
	type: MethodType,
	meta: Array<any>,
	func: Function;
}