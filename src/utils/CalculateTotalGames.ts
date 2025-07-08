import { db } from "../lib/db";

// Count total number of boardgames currently in database //
export const calculateTotalGames = async (): Promise<number> => {
    try {
        const res = await db.query('SELECT COUNT(*) FROM boardgames');
        return parseInt(res.rows[0].count, 10)
    } catch (error) {
        console.error("Database query error: ", error)
        throw error
    }
};