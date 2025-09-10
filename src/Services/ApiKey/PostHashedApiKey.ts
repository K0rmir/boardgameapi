import { db } from "../../lib/db";

export async function postHashedApiKey(email: string, apiKeyHashed: string): Promise<{ success: boolean; error?: string}> {

    try {
        const res = await db.query('INSERT INTO users (email, api_key) VALUES ($1, $2)', [email, apiKeyHashed])
        return { success: res.rowCount === 1}
    } catch (error) {
        console.error('Database query error: ', error)
        throw error
    }
}