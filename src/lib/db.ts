// Connect to Supabase database //
import pg from "pg";
import dotenv from "dotenv";

dotenv.config();

const dbConnectionString = process.env.DATABASE_URL;

if (!dbConnectionString) {
    throw new Error("DATABASE_URL is not set in the environment variables"); // Throw error if no connection string is provided for database.
}

export const db = new pg.Pool({ connectionString: dbConnectionString });

db.on('error', (err) => { // add event listener 'on' to handle any unexpected errors that occur while client is idle.
    console.error('Unexpected error on idle client', err);
    process.exit(-1);
});
