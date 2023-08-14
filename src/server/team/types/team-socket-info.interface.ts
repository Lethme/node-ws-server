import {Socket} from "socket.io";

export interface TeamSocketInfo {
	playerName: string;
	socket: Socket;
}