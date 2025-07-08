import { db } from "../lib/db";

// Helper function returns total number of rows returned in query for pagination metadata //
export const calculateTotalResultCount = async (filters: {
    max_players?: number,
    play_time?: number,
    year_published?: number,
    game_category?: string[],
    game_mechanic?: string[],
    game_designer?: string[]
},
): Promise<number> => {

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