import {Server, Socket} from "socket.io";
import {ServerBase} from "./core";
import {
	BeforeShutdown,
	BeforeStartup,
	Connection,
	Disconnection,
	Listen,
	ServerConfig,
	Shutdown,
	Startup,
	Message
} from "./core/decorators";
import {LobbyHub} from "./lobby/types";

@ServerConfig({
	port: 5000,
	maxLobbiesAmount: 2,
})
export class GameServer extends ServerBase {
	private readonly hub: LobbyHub;

	constructor() {
		super();
		this.hub = new LobbyHub(this.config.maxLobbiesAmount);
	}

	// public get lobbies() { return this.hub.entries };
	//
	// public addLobby() {
	// 	const lobbyKey = this.hub.addLobby({
	// 		title: "Test Lobby",
	// 		maxSocketsAmount: 5,
	// 		teams: 2,
	// 		public: false,
	// 		password: "Qwerty123",
	// 	});
	//
	// 	const lobby = this.hub.getLobby(lobbyKey);
	//
	// 	if (lobby !== undefined) {
	// 		for (let i = 0; i < lobby.lobbyConfig.teams; i++) {
	// 			lobby.addTeam({
	// 				title: `Team #${i}`,
	// 				maxSocketsAmount: lobby.lobbyConfig.maxSocketsAmount,
	// 			});
	// 		}
	// 	}
	// }
	//
	// public closeLobby(key: number) {
	// 	this.hub.closeLobby(key);
	// }

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

	@Message()
	private async message(socket: Socket, ...args: Array<any>) {
		console.log(`\nReceived message from socket ${socket.id}:`);
		console.log(...args, '\n');
	}

	@Listen()
	private async test(socket: Socket, ...args: Array<any>) {
		console.log(`Message from socket ${socket.id}: ${args.map(arg => JSON.stringify(arg)).join(" ")}`);
	}
}