import {Team} from "../team";
import {getHash} from "../utils";
import {LobbyConfig} from "./types";

export class Lobby<TConfig extends LobbyConfig = LobbyConfig, TTeam extends Team = Team> {
    private teams: Array<TTeam> = [];
    private config: TConfig;

    constructor(config: TConfig) {
        this.config = { ...config };

        this.processConfig();
    }

    public get lobbyConfig(): TConfig { return { ...this.config } }

    private processConfig() {
        if (!this.config.public) {
            if (this.config.password) {
                this.config.password = getHash(this.config.password);
            } else {
                this.config.password = getHash("00000000");
            }
        }
    }
}