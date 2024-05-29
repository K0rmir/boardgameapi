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
    const maxPlayers = req.query.maxplayers ? parseInt(req.query.maxplayers as string, 10) : undefined

    // Variables for pagination passed to the service methods for use in SQL queries.
    const page = req.query.page ? parseInt(req.query.page as string, 10) : 1;
    const limit = 100; // limit how many boardgames are returned per page

    try {
        let boardgames;
        let totalCount;

        if (maxPlayers !== undefined) {
            boardgames = await BoardGameService.findByMaxPlayers(maxPlayers, page, limit)
            totalCount = await BoardGameService.getTotalCountByMaxPlayers(maxPlayers) // Call getTotalCountByMaxPlayers from service to count total results
        } else {
            boardgames = await BoardGameService.findAll(page, limit);
            totalCount = await BoardGameService.getTotalCount(); // Call getTotalCount from service to count total results
        }

        const totalPages = Math.ceil(totalCount / limit); // declare total number of page here for pagination metadata
        const { nextPage, prevPage } = buildPaginationLinks(req, page, totalPages)

        res.status(200).send({ // send object of pagination metadata and boardgames results as response
            totalCount,
            totalPages,
            currentPage: page,
            nextPage,
            prevPage,
            resultsReturned: limit,
            results: boardgames
        });
    } catch (e) {
        res.status(500).send(error)
    }
})

// GET items/:id

boardGamesRouter.get("/:id", async (req: Request, res: Response) => {
    const id: number = parseInt(req.params.id, 10);

    try {
        const boardgame: BoardGame[] = await BoardGameService.find(id)

        if (boardgame) {
            return res.status(200).send(boardgame)
        }

        res.status(400).send("Game not found.")
    } catch (error) {
        res.status(500).send(error)
    }
})


// POST items

// PUT items/:id

// DELETE items/:id