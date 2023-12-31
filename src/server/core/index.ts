import {Server, Socket} from "socket.io";
import Config from "./config";
import {ServerDecoratorConfig} from "./decorators/socket.decorator";
import {MethodType} from "./enums";
import {MethodDescription} from "./types";

type EventNames<T> = {
	[K in keyof T]: T[K] extends (...args: any[]) => any ? K : never;
}[keyof T];

export class ServerBase {
	private readonly _server: Server;
	private readonly _config?: ServerDecoratorConfig;
	private _currentConfig?: ServerDecoratorConfig;
	private _methods: Map<MethodType, Array<MethodDescription>> = new Map();

	protected get config(): ServerDecoratorConfig { return this._currentConfig!; }
	//protected get server(): Server { return this._server; }

	constructor() {
		const methods = this.getInstanceMethods();
		const metadata = Reflect.getOwnMetadata(Config.SOCKET_METADATA_KEY, this.constructor);

		this._config = metadata[0] || Config.DEFAULT_SOCKET_CONFIG;
		this._methods = methods;

		this._server = new Server();

		this.init();
	}

	private getInstanceMethods<T extends ServerBase>(): Map<MethodType, Array<MethodDescription>> {
		const methods: Array<MethodDescription> = [];

		const proto = Object.getPrototypeOf(this);
		const names = Object.getOwnPropertyNames(proto);

		for (const key in names) {
			const descriptor = Object.getOwnPropertyDescriptor(proto, names[key]);
			const method = descriptor?.value;
			const methodMetadata = Reflect.getOwnMetadata(Config.LISTEN_METADATA_KEY, this.constructor.prototype, method?.name);

			if (
				method && typeof method === 'function' &&
				method.prototype !== proto &&
				/__awaiter/.test(method?.toString()) &&
				methodMetadata &&
				methodMetadata[0] &&
				Object.values(MethodType).some((methodType: MethodType) => methodType === methodMetadata[0])
			) {
				methods.push({
					name: method.name,
					type: methodMetadata[0],
					meta: methodMetadata || [],
					func: method,
				});
			}
		}

		return methods.group(m => m.type);
	}

	private init() {
		this._currentConfig = { ...this._config };
		this._server.removeAllListeners();

		this._server.on("connection", async (socket: Socket) => {
			const connectionMethods = this._methods.get(MethodType.Connection);
			const disconnectionMethods = this._methods.get(MethodType.Disconnection);
			const messageMethods = this._methods.get(MethodType.Message);
			const listenMethods = this._methods.get(MethodType.Listen);

			if (connectionMethods && connectionMethods.length) {
				connectionMethods[0].func.call(this, socket);
			}

			if (disconnectionMethods && disconnectionMethods.length) {
				socket.on('disconnect', () => {
					disconnectionMethods[0].func.call(this, socket);
				})
			}

			if (messageMethods && messageMethods.length) {
				socket.on('message', async (...args: Array<any>) => {
					const response = await messageMethods[0].func.call(this, socket, ...args);
					response && socket.emit('message', response);
				});
			}

			if (listenMethods) {
				for (const method of listenMethods) {
					const methodEvent = method.meta[1];
					const useMethodEvent = methodEvent && typeof methodEvent === 'string';
					const event = useMethodEvent ? methodEvent : method.name;

					socket.on(event, async (...args: Array<any>) => {
						const response = await method.func.call(this, socket, ...args);
						response && socket.emit(event, response);
					});
				}
			}
		});
	}
	
	public async run() {
		const beforeStartupMethods = this._methods.get(MethodType.BeforeStartup);
		const startupMethods = this._methods.get(MethodType.Startup);

		if (beforeStartupMethods && beforeStartupMethods.length) {
			beforeStartupMethods[0].func.call(this, this._server);
		}

		this._server.listen(this._currentConfig?.port!);

		if (startupMethods && startupMethods.length) {
			startupMethods[0].func.call(this, this._server);
		}
	}

	public async shutdown() {
		const beforeShutdownMethods = this._methods.get(MethodType.BeforeShutdown);
		const shutdownMethods = this._methods.get(MethodType.Shutdown);

		if (beforeShutdownMethods && beforeShutdownMethods.length) {
			beforeShutdownMethods[0].func.call(this, this._server);
		}

		this._server.close();

		if (shutdownMethods && shutdownMethods.length) {
			shutdownMethods[0].func.call(this, this._server);
		}
	}

	public async restart() {
		await this.shutdown();
		await this.run();
	}

	public async reload() {
		await this.shutdown();
		this.init();
		await this.run();
	}

	protected async emit(ev: string, socket?: Socket) {
		const emits = this._methods.get(MethodType.Emit);
		const method = emits?.first((m) => {
			return m.name === ev || (m.meta[1] && typeof m.meta[1] === 'string' && m.meta[1] === ev);
		});

		if (method) {
			const methodEvent = method.meta[1];
			const useMethodEvent = methodEvent && typeof methodEvent === 'string';
			const event = useMethodEvent ? methodEvent : method.name;

			const response = await method.func.call(this);

			if (!socket) {
				this._server.emit(event, response);
			} else {
				socket.emit(ev, response);
			}
		}
	}

	protected async call(ev: string): Promise<any> {
		const emits = this._methods.get(MethodType.Emit);
		const method = emits?.first((m) => {
			return m.name === ev || (m.meta[1] && typeof m.meta[1] === 'string' && m.meta[1] === ev);
		});

		if (method) {
			const response = await method.func.call(this);
			return response || null;
		}

		return null;
	}
}