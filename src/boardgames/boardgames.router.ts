// Required External Modules and Interfaces
import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import * as BoardGameService from "./boardgames.service"
import { BoardGame } from "./boardgame.interface";
import { error } from "console";
import { validateApiKey } from "../middleware/apiKeys"
import { rateLimiter } from "../middleware/ratelimiter"
import { logger } from "../middleware/logger"

// Cors configuration
const corsOptions = {
    origin: '*',
    METHODS: ['GET'],
    optionsSuccessStatus: 204
}

//  Router Definition
export const boardGamesRouter = express.Router();

boardGamesRouter.use(cors(corsOptions), rateLimiter, validateApiKey)

// Helper function to get apiKey for endpoint logging
function getApiKey(req: Request): string | undefined {
    return req.headers['x-api-key'] as string | undefined;
}

// Helper function to build pagination links //
const buildPaginationLinks = (req: Request, page: number, totalPages: number): { nextPage: string | null, prevPage: string | null } => {

    const baseUrl = `${req.protocol}://${req.get('host')}${req.baseUrl}${req.path}`
    const query = new URLSearchParams(req.query as any);

    // Build next page URL
    query.set('page', (page + 1).toString());
    const nextPage = page < totalPages ? `${baseUrl}?${query.toString()}` : null;

    // Build previous page URL
    query.set('page', (page - 1).toString());
    const prevPage = page > 1 ? `${baseUrl}?${query.toString()}` : null;

    return { nextPage, prevPage };
};

//  Controller Definitions

// GET all boardgames or games by filters //
boardGamesRouter.get("/", async (req: Request, res: Response, next: NextFunction) => {

    const apiKey = getApiKey(req)

    // Define Set of valid filters. Sets are more efficent for iterating over and checking.
    // This set and loop may need to be moved into a helper function when params on the random endpoint are enabled.
    const validFilters = new Set(['maxplayers', 'playtime', 'yearpublished', 'gamecategory', 'gamemechanic', 'gamedesigner'])

    // Loop over req.query object where user query params are stored and check if they are in the validFilters set. 
    for (const reqParam of Object.keys(req.query)) {
        if (!validFilters.has(reqParam)) {
            res.status(400).send(`Could not return results. There could be an issue with your query param, '${reqParam}'.`)
            logger(req, res, apiKey);
            return;
        }
    }

    const filters = { // define search params/filters by pulling them from the search query
        max_players: req.query.maxplayers ? parseInt(req.query.maxplayers as string, 10) : undefined,
        play_time: req.query.playtime ? parseInt(req.query.playtime as string, 10) : undefined,
        year_published: req.query.yearpublished ? parseInt(req.query.yearpublished as string, 10) : undefined,
        game_category: req.query.gamecategory ? req.query.gamecategory.toString().split(",") : undefined,
        game_mechanic: req.query.gamemechanic ? req.query.gamemechanic.toString().split(",") : undefined,
        game_designer: req.query.gamedesigner ? req.query.gamedesigner.toString().split(",") : undefined,
    }

    // Variables for pagination passed to the service methods for use in SQL queries.
    const page = req.query.page ? parseInt(req.query.page as string, 10) : 1;

    let limit = req.query.pagesize ? parseInt(req.query.pagesize as string, 10) : 100; // limit how many boardgames are returned per page
    if (limit > 100) {
        limit = 100;
    }

    try {
        const boardgames = await BoardGameService.findBoardgames(filters, page, limit)
        const totalCount = await BoardGameService.getTotalCount(filters);
        const totalPages = Math.ceil(totalCount / limit); // declare total number of pages here for pagination metadata
        const { nextPage, prevPage } = buildPaginationLinks(req, page, totalPages) // call helper function to build pagination next/prev page links

        res.status(200).send({ // send object of pagination metadata and boardgames results as response
            totalCount,
            totalPages,
            currentPage: page,
            nextPage,
            prevPage,
            resultsReturned: boardgames.length,
            results: boardgames
        });
        logger(req, res, apiKey)
        return;
    } catch (e) {
        res.status(500).send(e)
        return;
    }
})

// GET random boardgame //
boardGamesRouter.get("/random", async (req: Request, res: Response, next: NextFunction) => {

    const apiKey = getApiKey(req)

    try {
        const totalGames = await BoardGameService.findTotalGames(); // get total amount of games currently in database.
        const randomNumber = Math.ceil(Math.random() * totalGames); // generate random number between 1 and totalGames
        const randomGame = await BoardGameService.findRandomGame(randomNumber) // get random game by using randomNumber as OFFSET

        if (randomGame) {
            res.status(200).json(randomGame);
            logger(req, res, apiKey)
            return;
        } else {
            res.status(400).send("Could not get random game.");
            logger(req, res, apiKey)
            return;
        }

    } catch (error) {
        console.error("Error fetching random game: ", error);
        res.status(500).send(error);
    }
});

// GET boardgame by title 
boardGamesRouter.get("/:gameName", async (req: Request, res: Response, next: NextFunction) => {

    const gameName: string | undefined = req.params.gameName?.toString()
    const apiKey = getApiKey(req)

    try {
        const boardgame: BoardGame[] | string = await BoardGameService.findGameByTitle(gameName)

        if (boardgame === 'null') {
            res.status(400).send("Game not found.")
            logger(req, res, apiKey)
            return;
        } else {
            res.status(200).send(boardgame)
            logger(req, res, apiKey)
            return;
        }

    } catch (error) {
        res.status(500).send(error)
    }
});

