import {Server, Socket} from "socket.io";
import Config from "./config";
import {ServerDecoratorConfig} from "./decorators/socket.decorator";
import {MethodType} from "./enums";
import {MethodDescription} from "./types";

export class ServerBase {
	private readonly server: Server;

	constructor() {
		const methods = this.getInstanceMethods();
		const metadata = Reflect.getOwnMetadata(Config.SOCKET_METADATA_KEY, this.constructor);
		const socketConfig: ServerDecoratorConfig = metadata[0] || Config.DEFAULT_SOCKET_CONFIG;

		console.log(methods);
		console.log(socketConfig);

		this.server = new Server();

		this.init(socketConfig, methods);
		this.server.listen(socketConfig.port!);

		const startupMethod = methods.find(m => m.type === MethodType.Startup);

		startupMethod && startupMethod.func.call(this, this.server);
	}

	private getInstanceMethods<T extends ServerBase>(): Array<MethodDescription> {
		const methods: Array<MethodDescription> = [];

		const proto = Object.getPrototypeOf(this);
		const names = Object.getOwnPropertyNames(proto);

		for (const key in names) {
			const descriptor = Object.getOwnPropertyDescriptor(proto, names[key]);
			const method = descriptor?.value;
			const methodMetadata = Reflect.getOwnMetadata(Config.LISTEN_METADATA_KEY, this.constructor.prototype, method.name);

			if (
				method && typeof method === 'function' &&
				method.prototype !== proto &&
				/__awaiter/.test(method?.toString()) &&
				methodMetadata &&
				methodMetadata[0] &&
				(
					methodMetadata[0] === MethodType.Listen ||
					methodMetadata[0] === MethodType.Connection ||
					methodMetadata[0] === MethodType.Disconnection ||
					methodMetadata[0] === MethodType.Startup
				)
			) {
				methods.push({
					name: method.name,
					type: methodMetadata[0],
					func: method,
				});
			}
		}

		return methods;
	}

	private init(config: ServerDecoratorConfig, methods: Array<MethodDescription>) {
		this.server.on("connection", async (socket: Socket) => {
			const connectionMethod = methods.find(method => method.type === MethodType.Connection);
			connectionMethod && connectionMethod.func.call(this, socket);

			socket.on('disconnect', () => {
				const disconnectionMethod = methods.find(method => method.type === MethodType.Disconnection);
				disconnectionMethod && disconnectionMethod.func.call(this, socket);
			});

			for (const method of methods.filter(m => m.type === MethodType.Listen)) {
				socket.on(method.name, (...args: Array<any>) => {
					method.func.call(this, socket, ...args);
				});
			}
		});
	}
}