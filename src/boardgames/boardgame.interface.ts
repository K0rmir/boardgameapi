export interface BaseBoardGame {
    name: string;
    description: string
    minPlayers: number
    maxPlayers: number
}

export interface BoardGame extends BaseBoardGame {
    id: number;
}

export type Boardgames = BoardGame[]