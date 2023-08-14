export interface LobbyConfig {
    title: string;
    teams: number;
    maxPlayersPerTeam: number;
    public: boolean;
    password?: string;
}