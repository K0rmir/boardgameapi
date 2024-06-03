// Data Model Interfaces
import { BaseBoardGame, BoardGame, Boardgames } from "./boardgame.interface";
import { db } from "../lib/db"

// In-Memory Store

// This will be deleted eventually when endpoints for adding/updating/deleting are added

let boardgames: Boardgames = [
    {
        id: 0,
        name: "Catan",
        description: "Catan is a cool game.",
        minPlayers: 3,
        maxPlayers: 5
    },
    {
        id: 1,
        name: "Wyrmspan",
        description: "Here there be dragons!",
        minPlayers: 1,
        maxPlayers: 5
    },
    {
        id: 2,
        name: "Everdell",
        description: "Animals init.",
        minPlayers: 1,
        maxPlayers: 4
    },
    {
        id: 3,
        name: "Sky Team",
        description: "Get off my plane!.",
        minPlayers: 2,
        maxPlayers: 2
    },
]

//  Service Methods

// Fetch all BoardGames  //
export const findBoardgames = async (filters: {
    max_players?: number,
    play_time?: number,
    year_published?: number,
    game_category?: string[],
    game_mechanic?: string[],
    game_designer?: string[]
},
    page: number, limit: number): Promise<Boardgames> => {

    const offset = (page - 1) * limit;

    let query = 'SELECT * FROM boardgames WHERE 1=1' // define base query. WHERE 1=1 is a common SQL technique and allows every condition to be appended with AND without worrying if it's the first condition.
    const queryParams: (number | string | any)[] = [];
    let paramCount = 1;

    for (const [key, value] of Object.entries(filters)) { // Loop through the filters object, if any value is not undefined, append it to the query, then push value to query params for SQL dependancy array
        if (value !== undefined) {
            if (typeof value === "number") {
                query += ` AND ${key} = $${paramCount++}` // '$${paramCount++}' gives us our dynamic values ($1, $2 etc) to prevent SQL injection.
                queryParams.push(value) // push value to be used in query dependancy array
            } else if (Array.isArray(value)) {
                query += ` AND ${key} && $${paramCount++}`
                queryParams.push(value);
            }
        }
    }

    // Add Pagination //
    query += ` LIMIT $${paramCount++} OFFSET $${paramCount++}` // After loop, appending limit and offset to query to control data
    queryParams.push(limit, offset) // push values to be used in query dependancy array

    try {
        const res = await db.query(query, queryParams); // query database with dynamic query string (query) and dependancy array (queryParams)
        return res.rows
    } catch (error) {
        console.error("Database query error: ", error)
        throw error
    }
};

// Count number of rows returned in query for pagination metadata //
export const getTotalCount = async (filters: {
    max_players?: number,
    play_time?: number,
    year_published?: number,
    game_category?: string[],
    game_mechanic?: string[],
    game_designer?: string[]
},
): Promise<number> => {

    console.log("Game Category = ", filters.game_category)

    let query = 'SELECT COUNT(*) FROM boardgames WHERE 1=1'
    const queryParams: (number | string[])[] = [];
    let paramCount = 1;

    for (const [key, value] of Object.entries(filters)) { // Loop through the filters object, if any value is not undefined, append it to the query, then push value to query params for SQL dependancy array
        if (value !== undefined) {
            if (typeof value === "number") {
                query += ` AND ${key} = $${paramCount++}` // '$${paramCount++}' gives us our dynamic values ($1, $2 etc) to prevent SQL injection.
                queryParams.push(value) // push value to be used in query dependancy array
            } else if (Array.isArray(value)) {
                query += ` AND ${key} && $${paramCount++}`
                queryParams.push(value);
            }
        }
    }

    try {
        const res = await db.query(query, queryParams);
        return parseInt(res.rows[0].count, 10)
    } catch (error) {
        console.error("Database query error: ", error)
        throw error
    }
};

// Return single element with id as parameter
export const findGameByTitle = async (gameName: string | undefined): Promise<BoardGame[]> => {

    try {
        const res = await db.query('SELECT * FROM boardgames WHERE game_name = $1', [gameName]);
        return res.rows
    } catch (error) {
        console.error("Database query error: ", error)
        throw error;

    }
};

// Create a new boardgame //
export const create = async (newBoardGame: BaseBoardGame): Promise<BoardGame> => {
    const id = new Date().valueOf();
    boardgames[id] = {
        id,
        ...newBoardGame,
    };
    return boardgames[id]
};

// Update a board game. //

// Method recieves boardgame id and boardGameUpdate object as arguments. Use id to find boardgame in the store and update it with the properties of boardGameUpdate.
// export const update = async (
//     id: number,
//     boardGameUpdate: BaseBoardGame
// ): Promise<BoardGame | null> => {
//     const boardGame = await find(id);

//     if (!boardGame) {
//         return null;
//     }

//     boardgames[id] = { id, ...boardGameUpdate };

//     return boardgames[id]
// }

// Delete board game from store //
// export const remove = async (id: number): Promise<null | void> => {
//     const boardGame = await find(id);

//     if (!boardGame) {
//         return null
//     }
//     delete boardgames[id]

// }


