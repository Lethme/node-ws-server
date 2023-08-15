import {IDisposable, TypeOf} from "../../utils/types";
import {TeamConfig, TeamSocketInfo} from "./types";
import {Socket} from "socket.io";

export class Team<TSocket extends TeamSocketInfo = TeamSocketInfo, TConfig extends TeamConfig = TeamConfig> implements IDisposable {
    private _sockets: Map<string, TSocket>;
    private _config: TConfig;

    constructor(config: TConfig) {
        this._config = { ...config };
        this._sockets = new Map<string, TSocket>();
    }

    public get maxSize(): TypeOf<TConfig, 'maxSocketsAmount'> {
        return this._config.maxSocketsAmount;
    }

    public set maxSize(v: TypeOf<TConfig, 'maxSocketsAmount'>) {
        if (v >= 1) {
            this._config.maxSocketsAmount = v;
        }
    }

    public get size(): number { return this._sockets.size; }

    public get title(): TypeOf<TConfig, 'title'> {
        return this._config.title;
    }

    public set title(v: TypeOf<TConfig, 'title'>) {
        if (v) {
            this._config.title = v;
        }
    }

    public addSocket(socketInfo: TSocket) {
        if (!this._sockets.has(socketInfo.socket.id) && this._sockets.size < this._config.maxSocketsAmount) {
            this._sockets.set(socketInfo.socket.id, socketInfo);
        }
    }

    public removeSocket(id: TypeOf<Socket, 'id'>) {
        this._sockets.delete(id);
    }

    public getSocketInfo(id: TypeOf<Socket, 'id'>): TSocket | undefined {
        return this._sockets.get(id);
    }

    public hasSocket(id: TypeOf<Socket, 'id'>): boolean {
        return this._sockets.has(id);
    }

    public emit(event: string, ...args: Array<any>) {
        for (const { socket } of this._sockets.values()) {
            socket.emit(event, ...args);
        }
    }

    dispose(): void {
        this._sockets.clear();
    }
}