import 'reflect-metadata';
import Config from "../config";

export interface ServerDecoratorConfig {
	port?: number;
	maxLobbiesAmount?: number;
}

export function ServerConfig(config: ServerDecoratorConfig = Config.DEFAULT_SOCKET_CONFIG) {
	return function (target: any) {
		if (typeof target === 'function' && target.prototype) {
			const metadata = Reflect.getOwnMetadata(Config.SOCKET_METADATA_KEY, target) || [];

			if (!metadata.length) {
				metadata.push({
					port: config.port || 8080,
					maxLobbiesAmount: config.maxLobbiesAmount || 1,
				} as ServerDecoratorConfig);

				Reflect.defineMetadata(Config.SOCKET_METADATA_KEY, metadata, target);
			}
		}
	}
}