// Required External Modules and Interfaces
import express, { Request, Response } from "express";
import * as BoardGameService from "./boardgames.service"
import { BoardGame } from "./boardgame.interface";
import { error } from "console";


//  Router Definition
export const boardGamesRouter = express.Router();

//  Controller Definitions

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

// GET all boardgames or filter by maxplayers //
boardGamesRouter.get("/", async (req: Request, res: Response) => {

    const filters = { // define search params/filters by pulling them from the search query
        max_players: req.query.maxplayers ? parseInt(req.query.maxplayers as string, 10) : undefined,
        play_time: req.query.playtime ? parseInt(req.query.playtime as string, 10) : undefined,
        year_published: req.query.yearpublished ? parseInt(req.query.yearpublished as string, 10) : undefined,
        game_category: req.query.gamecategory ? req.query.gamecategory.toString().split(",") : undefined,
        game_mechanic: req.query.gamemechanic ? req.query.gamemechanic.toString().split(",") : undefined,
        game_designer: req.query.gamedesigner ? req.query.gamedesigner.toString().split(",") : undefined,
    }

    console.log("Query Parameters:", req.query);

    // Variables for pagination passed to the service methods for use in SQL queries.
    const page = req.query.page ? parseInt(req.query.page as string, 10) : 1;
    const limit = 100; // limit how many boardgames are returned per page

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
    } catch (e) {
        res.status(500).send(error)
    }
})

// GET random boardgame //

boardGamesRouter.get("/random", async (req: Request, res: Response) => {
    try {
        const totalGames = await BoardGameService.findTotalGames(); // get total amount of games currently in database.
        const randomNumber = Math.ceil(Math.random() * totalGames); // generate random number between 1 and totalGames
        const randomGame = await BoardGameService.findRandomGame(randomNumber) // get random game by using randomNumber as OFFSET

        if (randomGame) {
            res.status(200).json(randomGame);
        } else {
            res.status(400).send("Could not get random game.");
        }

    } catch (error) {
        console.error("Error fetching random game: ", error);
        res.status(500).send(error);
    }
});

// GET boardgame by title 

boardGamesRouter.get("/:gameName", async (req: Request, res: Response) => {
    const gameName: string | undefined = req.params.gameName?.toString()

    try {
        const boardgame: BoardGame[] = await BoardGameService.findGameByTitle(gameName)

        if (boardgame) {
            return res.status(200).send(boardgame)
        }
        res.status(400).send("Game not found.")
    } catch (error) {
        res.status(500).send(error)
    }
});