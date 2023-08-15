import {Lobby} from "../lobby";
import {LobbyConfig} from "../lobby/types";
import {Team} from "../team";
import {TeamConfig, TeamSocketInfo} from "../team/types";
import {IDisposable, TypeOf} from "../../utils/types";
import Config from "../core/config";
import {Socket} from "socket.io";

interface LobbyInfo<TConfig extends LobbyConfig = LobbyConfig, TSocket extends TeamSocketInfo = TeamSocketInfo, TTeamConfig extends TeamConfig = TeamConfig> {
	key: number;
	lobby: Lobby<TConfig, TSocket, TTeamConfig>;
}

type Lobbies<TConfig extends LobbyConfig = LobbyConfig, TSocket extends TeamSocketInfo = TeamSocketInfo, TTeamConfig extends TeamConfig = TeamConfig>
	= Array<LobbyInfo<TConfig, TSocket, TTeamConfig>>;

export class LobbyHub<TLobbyConfig extends LobbyConfig = LobbyConfig, TSocket extends TeamSocketInfo = TeamSocketInfo, TTeamConfig extends TeamConfig = TeamConfig> implements IDisposable {
	private readonly _lobbies: Map<number, Lobby<TLobbyConfig, TSocket, TTeamConfig>>;
	private _maxLobbiesAmount: number;

	constructor(maxLobbiesAmount: number = Config.DEFAULT_SOCKET_CONFIG.maxLobbiesAmount) {
		this._lobbies = new Map<number, Lobby<TLobbyConfig, TSocket, TTeamConfig>>();
		this._maxLobbiesAmount = maxLobbiesAmount > 0 ? maxLobbiesAmount : Config.DEFAULT_SOCKET_CONFIG.maxLobbiesAmount;
	}

	public get maxSize(): number { return this._maxLobbiesAmount; }
	public set maxSize(v: number) {
		if (v > 0) {
			this._maxLobbiesAmount = v;
		}
	}

	public get lobbies(): Lobbies<TLobbyConfig, TSocket, TTeamConfig> {
		return [...this._lobbies.entries()].map(([key, lobby]) => ({ key, lobby }));
	}

	private get newLobbyKey(): number {
		let keys = Array.from(this._lobbies.keys());
		keys.sort((a, b) => a - b);

		let lowestAvailableKey = 0;

		for (const key of keys) {
			if (key > lowestAvailableKey) {
				break;
			}
			lowestAvailableKey = key + 1;
		}

		return lowestAvailableKey;
	}

	public addLobby(config: TLobbyConfig): number {
		if (this._lobbies.size < this._maxLobbiesAmount) {
			const lobbyKey = this.newLobbyKey;
			const lobby = new Lobby<TLobbyConfig, TSocket, TTeamConfig>(config);
			this._lobbies.set(lobbyKey, lobby);

			return lobbyKey;
		}

		return -1;
	}

	public closeLobby(key: number) {
		this._lobbies.delete(key);
	}

	public getLobby(key: number): Lobby<TLobbyConfig, TSocket, TTeamConfig> | undefined {
		return this._lobbies.get(key);
	}

	public getLobbyTeams(key: number): Readonly<Array<Team<TSocket, TTeamConfig>>> | undefined {
		const lobby = this.getLobby(key);

		if (lobby) {
			return lobby.lobbyTeams;
		}

		return undefined;
	}

	public getLobbyBySocketId(id: TypeOf<Socket, 'id'>): Lobby<TLobbyConfig, TSocket, TTeamConfig> | undefined {
		return [ ...this._lobbies.values() ].find(lobby => lobby.hasSocket(id));
	}

	public emit(event: string, ...args: Array<any>) {
		for (const lobby of this._lobbies.values()) {
			lobby.emit(event, ...args);
		}
	}

	dispose(): void {
		for (const lobby of this._lobbies.values()) {
			lobby.dispose();
		}

		this._lobbies.clear();
	}
}