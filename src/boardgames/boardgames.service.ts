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

export const getTotalCount = async (filters: {
    max_players?: number,
    play_time?: number,
    year_published?: number
},
): Promise<number> => {

    let query = 'SELECT COUNT(*) FROM boardgames WHERE 1=1'
    const queryParams: (number | string)[] = [];
    let paramCount = 1;

    for (const [key, value] of Object.entries(filters)) {
        if (value !== undefined) {
            query += ` AND ${key} = $${paramCount++}`
            queryParams.push(value)
        }
    }

    console.log(query, queryParams)

    try {
        const res = await db.query(query, queryParams);
        return parseInt(res.rows[0].count, 10)
    } catch (error) {
        console.error("Database query error: ", error)
        throw error
    }
};

// Fetch all BoardGames  //
export const findBoardgames = async (filters: {
    max_players?: number,
    play_time?: number,
    year_published?: number
},
    page: number, limit: number): Promise<Boardgames> => {

    const offset = (page - 1) * limit;

    let query = 'SELECT * FROM boardgames WHERE 1=1'
    const queryParams: (number | string)[] = [];
    let paramCount = 1;

    for (const [key, value] of Object.entries(filters)) {
        if (value !== undefined) {
            query += ` AND ${key} = $${paramCount++}`
            queryParams.push(value)
        }
    }

    // Add Pagination //
    query += ` LIMIT $${paramCount++} OFFSET $${paramCount++}`
    queryParams.push(limit, offset)

    // console.log(query, queryParams)

    try {
        const res = await db.query(query, queryParams);
        return res.rows
    } catch (error) {
        console.error("Database query error: ", error)
        throw error
    }
};

// Return single element with id as parameter
export const find = async (id: number): Promise<BoardGame[]> => {
    try {
        const res = await db.query('SELECT * FROM boardgames WHERE id = $1', [id]);
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
export const update = async (
    id: number,
    boardGameUpdate: BaseBoardGame
): Promise<BoardGame | null> => {
    const boardGame = await find(id);

    if (!boardGame) {
        return null;
    }

    boardgames[id] = { id, ...boardGameUpdate };

    return boardgames[id]
}

// Delete board game from store //
export const remove = async (id: number): Promise<null | void> => {
    const boardGame = await find(id);

    if (!boardGame) {
        return null
    }
    delete boardgames[id]

}


