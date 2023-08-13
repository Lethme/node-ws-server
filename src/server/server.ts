import {Server, Socket} from "socket.io";
import {ServerBase} from "./core";
import {Connection, Disconnection, ServerConfig, Listen, Startup} from "./core/decorators";

@ServerConfig({
	port: 5000,
})
export class GameServer extends ServerBase {
	@Startup()
	async startup(server: Server) {

	}

	@Connection()
	async connection(socket: Socket) {
		console.log(`Connected socket: ${socket.id}`);
	}

	@Disconnection()
	async disconnection(socket: Socket) {
		console.log(`Disconnected socket: ${socket.id}`);
	}

	@Listen()
	async test(socket: Socket, ...args: Array<any>) {
		console.log(`Message from socket ${socket.id}: ${args.map(arg => JSON.stringify(arg)).join(" ")}`);
	}
}