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


// Interface for query parameters //
export interface filters {
    game_description: boolean | undefined,
    max_players: number | undefined,
    play_time: number | undefined,
    year_published: number | undefined,
    game_category: string[] | undefined,
    game_mechanic: string[] | undefined,
    game_designer: string[] | undefined
}