import {Team} from "../team";
import {getHash} from "../utils";
import {LobbyConfig} from "./types";

export class Lobby {
    private teams: Array<Team> = [];
    private config: LobbyConfig;

    constructor(config: LobbyConfig) {
        this.config = { ...config };

        this.processConfig();
    }

    public get lobbyConfig(): LobbyConfig { return { ...this.config } }

    private processConfig() {
        if (!this.config.public) {
            if (this.config.password) {
                this.config.password = getHash(this.config.password);
            } else {
                this.config.password = getHash("00000000");
            }
        }
    }

    public static Create(config: LobbyConfig): Lobby {
        return new Lobby(config);
    }
}