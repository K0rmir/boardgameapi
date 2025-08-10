import { Filters, BoardGame } from "../types";
import { db } from "../lib/db"

// Fetch all BoardGames  //
export const fetchBoardgames = async (filters: Filters, page: number, limit: number): Promise<BoardGame[]> => {

    const offset = (page - 1) * limit;

    // define base query. WHERE 1=1 is a common SQL technique and allows every condition to be appended with AND without worrying if it's the first condition.
    let query;
    if (filters.game_description == true) {
        query = 'SELECT id, game_name, game_description, year_published, min_players, max_players, play_time, min_playtime, max_playtime, game_category, game_mechanic, game_designer FROM boardgames WHERE 1=1'
    } else {
        query = 'SELECT id, game_name, year_published, min_players, max_players, play_time, min_playtime, max_playtime, game_category, game_mechanic, game_designer FROM boardgames WHERE 1=1 '
    }

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