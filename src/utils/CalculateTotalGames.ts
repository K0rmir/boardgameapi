import { db } from "../lib/db";

// Count total number of boardgames currently in database
// Could ideally do with caching this return value somehow as it's currently called every time the random endpoint is hit.
// Not optimal to count the total rows every time when the total num of games in db isn't something that updates often.
export const calculateTotalGames = async (): Promise<number> => {
    try {
        const res = await db.query('SELECT COUNT(*) FROM boardgames');
        return parseInt(res.rows[0].count, 10)
    } catch (error) {
        console.error("Database query error: ", error)
        throw error
    }
};