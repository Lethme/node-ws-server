import {MethodType} from "../enums";

export interface MethodDescription {
	name: string;
	type: MethodType,
	func: Function;
}