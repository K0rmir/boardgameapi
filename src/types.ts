import "express";

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
export type Filters = {
    game_description?: boolean,
    max_players?: number,
    play_time?: number,
    year_published?: number,
    game_category?: string[],
    game_mechanic?: string[],
    game_designer?: string[]
}

// Modify Request type to include keys for use in other functions
declare module "express-serve-static-core" {
    interface Request {
        validatedApiKey: string
        hashedApiKey: string
    }
}