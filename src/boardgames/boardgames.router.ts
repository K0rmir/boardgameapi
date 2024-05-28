// Required External Modules and Interfaces
import express, { Request, Response } from "express";
import * as BoardGameService from "./boardgames.service"
import { BoardGame } from "./boardgame.interface";
import { error } from "console";


//  Router Definition
export const boardGamesRouter = express.Router();


//  Controller Definitions

// GET all boardgames or filter by maxplayers //

boardGamesRouter.get("/", async (req: Request, res: Response) => {
    const maxPlayers = req.query.maxplayers ? parseInt(req.query.maxplayers as string, 10) : undefined

    try {
        let boardgames;

        if (maxPlayers !== undefined) {
            boardgames = await BoardGameService.findByMaxPlayers(maxPlayers)
        } else {
            boardgames = await BoardGameService.findAll();
        }
        res.status(200).send(boardgames);
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