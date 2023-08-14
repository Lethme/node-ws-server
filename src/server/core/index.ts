import {Server, Socket} from "socket.io";
import Config from "./config";
import {ServerDecoratorConfig} from "./decorators/socket.decorator";
import {MethodType} from "./enums";
import {MethodDescription} from "./types";

export class ServerBase {
	private readonly server: Server;
	private serverConfig?: ServerDecoratorConfig;
	private serverCurrentConfig?: ServerDecoratorConfig;
	private serverMethods: Array<MethodDescription> = [];

	private get beforeStartupMethod() { return this.serverMethods.find(m => m.type === MethodType.BeforeStartup)?.func };
	private get startupMethod() { return this.serverMethods.find(m => m.type === MethodType.Startup)?.func };
	private get beforeShutdownMethod() { return this.serverMethods.find(m => m.type === MethodType.BeforeShutdown)?.func };
	private get shutdownMethod() { return this.serverMethods.find(m => m.type === MethodType.Shutdown)?.func };
	private get connectionMethod() { return this.serverMethods.find(m => m.type === MethodType.Connection)?.func };
	private get disconnectionMethod() { return this.serverMethods.find(m => m.type === MethodType.Disconnection)?.func };
	private get listenMethods() { return this.serverMethods.filter(m => m.type === MethodType.Listen) };

	protected get config(): ServerDecoratorConfig { return this.serverCurrentConfig! };

	constructor() {
		const serverMethods = this.getInstanceMethods();
		const metadata = Reflect.getOwnMetadata(Config.SOCKET_METADATA_KEY, this.constructor);
		const serverConfig: ServerDecoratorConfig = metadata[0] || Config.DEFAULT_SOCKET_CONFIG;

		this.serverConfig = serverConfig;
		this.serverMethods = serverMethods;

		this.server = new Server();

		this.init();
	}

	private getInstanceMethods<T extends ServerBase>(): Array<MethodDescription> {
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
					func: method,
				});
			}
		}

		return methods;
	}

	private init() {
		this.serverCurrentConfig = { ...this.serverConfig };

		this.server.removeAllListeners();

		this.server.on("connection", async (socket: Socket) => {
			this.connectionMethod && this.connectionMethod.call(this, socket);

			socket.on('disconnect', () => {
				this.disconnectionMethod && this.disconnectionMethod.call(this, socket);
			});

			for (const method of this.listenMethods) {
				socket.on(method.name, (...args: Array<any>) => {
					method.func.call(this, socket, ...args);
				});
			}
		});
	}
	
	public async run() {
		this.beforeStartupMethod && this.beforeStartupMethod.call(this, this.server);
		this.server?.listen(this.serverCurrentConfig?.port!);
		this.startupMethod && this.startupMethod.call(this, this.server);
		this.serverConfig && (this.serverConfig.port = 6000);
	}

	public async shutdown() {
		this.beforeShutdownMethod && this.beforeShutdownMethod.call(this, this.server);
		this.server?.close();
		this.shutdownMethod && this.shutdownMethod.call(this, this.server);
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
}