import {Lobby} from "../index";
import {LobbyConfig} from "./lobby-config.interface";
import {Team} from "../../team";

interface LobbyInfo<TConfig extends LobbyConfig = LobbyConfig, TTeam extends Team = Team> {
	key: number;
	lobby: Lobby<TConfig, TTeam>;
}

type Lobbies<TConfig extends LobbyConfig = LobbyConfig, TTeam extends Team = Team>
	= Array<LobbyInfo<TConfig, TTeam>>;

export class LobbyHub<TLobbyConfig extends LobbyConfig = LobbyConfig, TTeam extends Team = Team> {
	private readonly lobbies: Map<number, Lobby<TLobbyConfig, TTeam>>;

	constructor() {
		this.lobbies = new Map<number, Lobby<TLobbyConfig, TTeam>>();
	}

	public get entries(): Lobbies<TLobbyConfig, TTeam> {
		return [...this.lobbies.entries()].map(([key, lobby]) => ({ key, lobby }));
	}

	private get newLobbyKey(): number {
		let keys = Array.from(this.lobbies.keys());
		keys.sort((a, b) => a - b);

		let lowestAvailableKey = 1;

		for (const key of keys) {
			if (key > lowestAvailableKey) {
				break;
			}
			lowestAvailableKey = key + 1;
		}

		return lowestAvailableKey;
	}

	public addLobby(config: TLobbyConfig) {
		const lobbyKey = this.newLobbyKey;
		this.lobbies.set(lobbyKey, new Lobby<TLobbyConfig, TTeam>(config));
	}

	public closeLobby(key: number) {
		this.lobbies.delete(key);
	}
}