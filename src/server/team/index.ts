import {Socket} from "socket.io";
import {TypeOf} from "../../utils/types";
import {TeamConfig, TeamSocketInfo} from "./types";

export class Team {
    private sockets: Map<string, TeamSocketInfo>;
    private config: TeamConfig;

    constructor(config: TeamConfig) {
        this.config = { ...config };
        this.sockets = new Map<string, TeamSocketInfo>();
    }

    public get size(): TypeOf<TeamConfig, 'maxSocketsAmount'> {
        return this.config.maxSocketsAmount;
    }

    public set size(v: TypeOf<TeamConfig, 'maxSocketsAmount'>) {
        if (v >= 1) {
            this.config.maxSocketsAmount = v;
        }
    }

    public get title(): TypeOf<TeamConfig, 'title'> {
        return this.config.title;
    }

    public set title(v: TypeOf<TeamConfig, 'title'>) {
        if (v) {
            this.config.title = v;
        }
    }

    public static Create(config: TeamConfig): Team {
        return new Team(config);
    }
}