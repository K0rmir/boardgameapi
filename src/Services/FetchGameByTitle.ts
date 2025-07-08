import { BoardGame } from "./boardgame.interface";
import { db } from "../lib/db";


// Return single boardgame with game name as parameter //
export const fetchGameByTitle = async (gameName: string | undefined): Promise<BoardGame[] | string> => {

    try {
        const res = await db.query('SELECT * FROM boardgames WHERE game_name = $1', [gameName]);
        if (res.rows.length === 0) {
            return 'null'
        } else {
            return res.rows
        }
    } catch (error) {
        console.error("Database query error: ", error)
        throw error;
    }
};