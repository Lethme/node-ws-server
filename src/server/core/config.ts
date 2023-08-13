import {ServerDecoratorConfig} from "./decorators/socket.decorator";

namespace Config {
	export const LISTEN_METADATA_KEY = Symbol('listen_command_key');
	export const SOCKET_METADATA_KEY = Symbol('socket_metadata_key');
	export const DEFAULT_SOCKET_CONFIG: ServerDecoratorConfig = Object.freeze({
		port: 8080
	})
}

export default Config;