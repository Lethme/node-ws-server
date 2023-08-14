import {Server, Socket} from "socket.io";
import {ServerBase} from "./core";
import {
	Connection,
	Disconnection,
	ServerConfig,
	Listen,
	Startup,
	BeforeStartup,
	BeforeShutdown,
	Shutdown
} from "./core/decorators";
import {Lobby} from "./lobby";
import {LobbyHub} from "./lobby/types";

@ServerConfig({
	port: 5000,
})
export class GameServer extends ServerBase {
	private readonly hub: LobbyHub = LobbyHub.Create();

	public get lobbies() { return this.hub.entries };

	public addLobby() {
		this.hub.addLobby();
	}

	public closeLobby(key: number) {
		this.hub.closeLobby(key);
	}

	@BeforeStartup()
	private async beforeStartup(server: Server) {
		console.log(`Starting server on port ${this.config.port}`);
	}

	@Startup()
	private async startup(server: Server) {
		console.log(`Server started on port ${this.config.port}`);
	}

	@BeforeShutdown()
	private async beforeShutdown(server: Server) {
		console.log(`Server on port ${this.config.port} is shutting down`);
	}

	@Shutdown()
	private async shut(server: Server) {
		console.log(`Server on port ${this.config.port} has shut down`);
	}

	@Connection()
	private async connection(socket: Socket) {
		console.log(`Connected socket: ${socket.id}`);
	}

	@Disconnection()
	private async disconnection(socket: Socket) {
		console.log(`Disconnected socket: ${socket.id}`);
	}

	@Listen()
	private async test(socket: Socket, ...args: Array<any>) {
		console.log(`Message from socket ${socket.id}: ${args.map(arg => JSON.stringify(arg)).join(" ")}`);
	}
}