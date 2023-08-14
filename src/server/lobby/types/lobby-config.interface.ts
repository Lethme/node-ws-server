export interface LobbyConfig {
    title: string;
    teams: number;
    maxSocketsAmount: number;
    public: boolean;
    password?: string;
}