import {Team} from "../team";
import {getHash} from "../utils";
import {LobbyConfig} from "./types";
import {TeamConfig, TeamSocketInfo} from "../team/types";
import {IDisposable, TypeOf} from "../../utils/types";
import {Socket} from "socket.io";

export class Lobby<TConfig extends LobbyConfig = LobbyConfig, TSocket extends TeamSocketInfo = TeamSocketInfo, TTeamConfig extends TeamConfig = TeamConfig> implements IDisposable {
    private readonly _teams: Array<Team<TSocket, TTeamConfig>> = [];
    private readonly _config: TConfig;

    constructor(config: TConfig) {
        this._config = { ...config };
        this.processConfig();
    }

    public get lobbyConfig(): TConfig { return { ...this._config } }
    public get lobbyTeams(): Readonly<typeof this._teams> {
        return [ ...this._teams ];
    }

    private processConfig() {
        if (!this._config.public) {
            if (this._config.password) {
                this._config.password = getHash(this._config.password);
            } else {
                this._config.password = getHash("00000000");
            }
        }
    }

    public addTeam(config: TTeamConfig): number {
        if (this._teams.length < this._config.maxSocketsAmount) {
            this._teams.push(new Team<TSocket, TTeamConfig>(config));
            return this._teams.length - 1;
        }

        return -1;
    }

    public hasSocket(id: TypeOf<Socket, 'id'>): boolean {
        return this._teams.some(team => team.hasSocket(id));
    }

    public emit(event: string, ...args: Array<any>) {
        for (const team of this._teams) {
            team.emit(event, ...args);
        }
    }

    dispose(): void {
        while (this._teams.length) {
            this._teams.last().dispose();
            this._teams.pop();
        }
    }
}