import 'reflect-metadata';
import Config from "../config";
import {MethodType} from "../enums";

export function Listen() {
	return function (target: any, key: string, descriptor: PropertyDescriptor) {
		if (typeof descriptor?.value === 'function') {
			const metadata = Reflect.getOwnMetadata(Config.LISTEN_METADATA_KEY, target, key) || [];

			if (!metadata.length) {
				metadata.push(MethodType.Listen);
				Reflect.defineMetadata(Config.LISTEN_METADATA_KEY, metadata, target, key);
			}
		}
	}
}