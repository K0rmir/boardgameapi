// Required External Modules and Interfaces
import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import * as BoardGameService from "./boardgames.service"
import { BoardGame, filters } from "./boardgame.interface";
import { validateApiKey } from "../middleware/apiKeys"
import { rateLimiter } from "../middleware/ratelimiter"
import { logger } from "../middleware/logger"
import { db } from "../lib/db"
import bcrypt from 'bcrypt';


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
async function getApiKey(req: Request): Promise<string | undefined> {

	const apiKey: string | string[] | undefined = req.headers['x-api-key'];
	const hashedKeys = await db.query('SELECT api_key FROM users');
	let hashedApiKey: string | undefined = ''

	for (const hashedKey of hashedKeys.rows) {
		if (await bcrypt.compare(apiKey as string, hashedKey.api_key)) {
			hashedApiKey = hashedKey.api_key;
		}
	}

	return hashedApiKey;
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

// Helper function to calculate response time //
function responseTimeStamp(errorStatus: boolean, startTime?: number): number {
	if (errorStatus && startTime !== undefined) {
		const endTime = Number(process.hrtime.bigint());
		return endTime - startTime;
	} else {
		return Number(process.hrtime.bigint());
	}
};

//  Controller Definitions

// GET all boardgames or games by filters //
boardGamesRouter.get("/", async (req: Request, res: Response, next: NextFunction) => {
	const startTime = responseTimeStamp(false);
	const hashedApiKey = getApiKey(req)

	// Define Set of valid filters. Sets are more efficent for iterating over and checking.
	// This set and loop may need to be moved into a helper function when params on the random endpoint are enabled.
	const validFilters = new Set(['gamedescription', 'maxplayers', 'playtime', 'yearpublished', 'gamecategory', 'gamemechanic', 'gamedesigner', 'pagesize', 'page'])

	// Loop over req.query object where user query params are stored and check if they are in the validFilters set. 
	for (const [reqParam, value] of Object.entries(req.query)) {
		if (!validFilters.has(reqParam)) {
			res.status(400).send(`Could not return results. There could be an issue with your query param, '${reqParam}'.`)
			logger(req, res, Number(responseTimeStamp(true, startTime) / 1000000), await hashedApiKey);
			return;
		}
		// Check to ensure relevant integer query params don't have words as values //
		if (reqParam === 'maxplayers' || reqParam === 'playtime' || reqParam === 'yearpublished') {
			if (typeof value === 'string' && !/\d/.test(value)) {
				res.status(400).send(`Could not return results. There could be an issue with the value of one or more of your query params.`);
				logger(req, res, Number(responseTimeStamp(true, startTime) / 1000000), await hashedApiKey);
				return;
			}
		}
	}

	const filters: filters = { // define search params/filters by pulling them from the search query
		game_description: req.query.gamedescription === 'false' ? false : req.query.gamedescription ? true : undefined,
		max_players: req.query.maxplayers ? parseInt(req.query.maxplayers as string, 10) : undefined,
		play_time: req.query.playtime ? parseInt(req.query.playtime as string, 10) : undefined,
		year_published: req.query.yearpublished ? parseInt(req.query.yearpublished as string, 10) : undefined,
		game_category: req.query.gamecategory ? req.query.gamecategory.toString().split(",") : undefined,
		game_mechanic: req.query.gamemechanic ? req.query.gamemechanic.toString().split(",") : undefined,
		game_designer: req.query.gamedesigner ? req.query.gamedesigner.toString().split(",") : undefined,
	}

	// Variables for pagination passed to the service methods for use in SQL queries.
	const page = req.query.page ? parseInt(req.query.page as string, 10) : 1;

	let limit = req.query.pagesize ? parseInt(req.query.pagesize as string, 10) : 50; // limit how many boardgames are returned per page
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
		const endTime = responseTimeStamp(false);
		const responseTime = Number(endTime - startTime) / 1000000;
		logger(req, res, responseTime, await hashedApiKey)
		return;
	} catch (e) {
		res.status(500).send(e)
		return;
	}
});

// GET random boardgame //
boardGamesRouter.get("/random", async (req: Request, res: Response, next: NextFunction) => {
	const startTime = responseTimeStamp(false);
	const hashedApiKey = getApiKey(req)

	try {
		const totalGames = await BoardGameService.findTotalGames(); // get total amount of games currently in database.
		const randomNumber = Math.ceil(Math.random() * totalGames); // generate random number between 1 and totalGames
		const randomGame = await BoardGameService.findRandomGame(randomNumber) // get random game by using randomNumber as OFFSET

		if (randomGame) {
			res.status(200).json(randomGame);
			const endTime = responseTimeStamp(false);
			const responseTime = Number(endTime - startTime) / 1000000;
			logger(req, res, responseTime, await hashedApiKey);
			return;
		} else {
			res.status(400).send("Could not get random game.");
			logger(req, res, Number(responseTimeStamp(true, startTime) / 1000000), await hashedApiKey)
			return;
		}
	} catch (error) {
		console.error("Error fetching random game: ", error);
		res.status(500).send(error);
	}
});

// GET boardgame by title 
boardGamesRouter.get("/gamename", async (req: Request, res: Response, next: NextFunction) => {
	const startTime = responseTimeStamp(false);

	const gameName: string | undefined = Object.keys(req.query)[0];
	const hashedApiKey = getApiKey(req)

	try {
		const boardgame: BoardGame[] | string = await BoardGameService.findGameByTitle(gameName)

		if (boardgame === 'null') {
			res.status(400).send("Game not found.")
			logger(req, res, Number(responseTimeStamp(true, startTime)), await hashedApiKey)
			return;
		} else {
			res.status(200).send(boardgame)
			const endTime = responseTimeStamp(false);
			const responseTime = Number(endTime - startTime) / 1000000;
			logger(req, res, responseTime, await hashedApiKey)
			return;
		}

	} catch (error) {
		res.status(500).send(error)
	}
});

