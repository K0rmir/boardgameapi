import express from "express";
import cors from "cors";
import { validateApiKey } from "../middleware/BoardGames/ValidateApiKey";
import { rateLimiter } from "../middleware/BoardGames/ratelimiter";
import { registerBoardGameRoutes } from "../Routes/BoardGames";

// Cors configuration
const corsOptions = {
    origin: "*",
    methods: ["GET"],
    optionsSuccessStatus: 204,
};

export const boardGamesRouter = express.Router();

boardGamesRouter.use(cors(corsOptions), validateApiKey, rateLimiter);

registerBoardGameRoutes(boardGamesRouter)