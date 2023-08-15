import {TypeOf} from "../../utils/types";
import {TeamConfig, TeamSocketInfo} from "./types";

export class Team<TSocket extends TeamSocketInfo = TeamSocketInfo, TConfig extends TeamConfig = TeamConfig> {
    private sockets: Map<string, TSocket>;
    private config: TConfig;

    constructor(config: TConfig) {
        this.config = { ...config };
        this.sockets = new Map<string, TSocket>();
    }

    public get size(): TypeOf<TConfig, 'maxSocketsAmount'> {
        return this.config.maxSocketsAmount;
    }

    public set size(v: TypeOf<TConfig, 'maxSocketsAmount'>) {
        if (v >= 1) {
            this.config.maxSocketsAmount = v;
        }
    }

    public get title(): TypeOf<TConfig, 'title'> {
        return this.config.title;
    }

    public set title(v: TypeOf<TConfig, 'title'>) {
        if (v) {
            this.config.title = v;
        }
    }
}