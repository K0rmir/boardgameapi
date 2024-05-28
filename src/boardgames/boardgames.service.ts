// Data Model Interfaces
import { BaseBoardGame, BoardGame, Boardgames } from "./boardgame.interface";
import { db } from "../lib/db"

// In-Memory Store

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
export const findAll = async (): Promise<Boardgames> => {
    console.log("Fetching all games in database")
    try {
        const res = await db.query('SELECT * FROM boardgames');
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

// Return board games with a max player count

export const findByMaxPlayers = async (maxPlayers: number): Promise<Boardgames> => {
    try {
        const res = await db.query('SELECT * FROM boardgames WHERE max_players = $1', [maxPlayers]);
        return res.rows
    } catch (error) {
        console.error("Database query error: ", error)
        throw error
    }
}

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


