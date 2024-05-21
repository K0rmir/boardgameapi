// Required External Modules

import * as dotenv from "dotenv";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import { boardGamesRouter } from "./boardgames/boardgames.router"

dotenv.config();

// App Variables

if (!process.env.PORT) {
    process.exit(1);
}

const PORT: number = parseInt(process.env.PORT as string, 10);

const app = express()

// App Configuration

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use("/src/boardgames", boardGamesRouter)

// Server Activation

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`)
})
