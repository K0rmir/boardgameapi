import { BoardGame } from "../types";
import { db } from "../lib/db";

export const getGameByTitle = async (gameName: string | undefined): Promise<BoardGame[] | string> => {

    try {
        const res = await db.query('SELECT * FROM boardgames WHERE game_name ILIKE $1', [gameName]);
        if (res.rows.length === 0) {
            console.log("Game is null")
            return 'null'
        } else {
            return res.rows
        }
    } catch (error) {
        console.error("Database query error: ", error)
        throw error;
    }
};