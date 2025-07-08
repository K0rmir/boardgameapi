import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import { validateApiKey } from "./middleware/apiKeys";
import { rateLimiter } from "./middleware/ratelimiter";

// Cors configuration
const corsOptions = {
    origin: "*",
    METHODS: ["GET"],
    optionsSuccessStatus: 204,
};

//  Router Definition
export const boardGamesRouter = express.Router();

boardGamesRouter.use(cors(corsOptions), validateApiKey, rateLimiter);