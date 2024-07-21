// Required External Modules

import * as dotenv from "dotenv";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import { boardGamesRouter } from "./boardgames/boardgames.router"
import { db } from "./lib/db"

dotenv.config();

// App Variables

if (!process.env.PORT) {
    process.exit(1);
}

// const PORT: number = parseInt(process.env.PORT as string, 10);
const PORT: string = process.env.PORT;

const app = express()

// App Configuration

app.use(helmet());
app.use(cors());
app.use(express.json());
// app.use("/src/boardgames", boardGamesRouter);
app.use("/boardgames", boardGamesRouter);

// Server Activation

const startServer = async () => {
    try {
        // Check database connection
        await db.query('SELECT 1', (err, res) => {
            if (err) {
                console.error('Error executing query:', err.stack);
                process.exit(1); // Exit the process if the connection fails
            } else {
                console.log('Database connection verified. Query result:', res.rows);
            }
        });

        // Start the server
        app.listen(PORT, () => {
            console.log(`Server is running on http://localhost:${PORT}`);
        });
    } catch (err) {
        console.error('Failed to connect to the database', err);
        process.exit(1);
    }
};

// startServer();

export default app;
