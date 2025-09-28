export type BoardGame = {
    id: number;
    game_name: string;
    game_description: string
    year_published: number
    min_players: number
    max_players: number
    play_time: number
    max_playtime: number
    game_category: string[],
    game_mechanic: string[],
    game_designer: string[]
}

// Type for query parameters //
export type Filters = {
    game_description?: boolean,
    max_players?: number,
    play_time?: number,
    year_published?: number,
    game_category?: string[],
    game_mechanic?: string[],
    game_designer?: string[]
}

// Modify express Request type to include api keys for use in other functions
declare module "express-serve-static-core" {
    interface Request {
        validatedApiKey: string
        hashedApiKey: string
    }
}