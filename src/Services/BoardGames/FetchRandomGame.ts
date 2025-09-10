import { BoardGame } from "../../types";
import { db } from "../../lib/db";

// Get random game using random number between 1 & total games as OFFSET from DB //
export const fetchRandomGame = async (randomNumber: number): Promise<BoardGame[]> => {
    try {
        const res = await db.query('SELECT * FROM boardgames OFFSET $1 LIMIT 1', [randomNumber]);
        return res.rows;
    } catch (error) {
        console.error("Database query error: ", error)
        throw error
    }
}