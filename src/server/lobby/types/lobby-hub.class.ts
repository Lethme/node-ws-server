import {Lobby} from "../index";

interface LobbyInfo {
	key: number;
	lobby: Lobby;
}

type Lobbies = Array<LobbyInfo>;

export class LobbyHub {
	private readonly lobbies: Map<number, Lobby>;

	constructor() {
		this.lobbies = new Map<number, Lobby>();
	}

	public get entries(): Lobbies {
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

	public addLobby() {
		const lobbyKey = this.newLobbyKey;

		this.lobbies.set(lobbyKey, new Lobby({
			title: "Test Lobby",
			teams: 2,
			maxSocketsAmount: 5,
			public: false,
			password: "Qwerty123",
		}));

		console.log(this.lobbies.get(lobbyKey)?.lobbyConfig);
	}

	public closeLobby(key: number) {
		this.lobbies.delete(key);
	}

	public static Create(): LobbyHub {
		return new LobbyHub();
	}
}