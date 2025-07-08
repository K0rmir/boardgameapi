import { NextFunction, Request, Response } from "express";
import { boardGamesRouter } from "../../app";
import { responseTimeStamp } from "../../utils/ResponseTimeStamp";
import { getHashedApiKey } from "../../middleware/apiKeys";
import { logger } from "../../middleware/logger";
import { fetchGameByTitle } from "../../Services/FetchGameByTitle";
import { BoardGame } from "../../types";



// GET boardgame by title
boardGamesRouter.get(
  "/gamename",
  async (req: Request, res: Response, next: NextFunction) => {
    const apiKey = req.headers["x-api-key"] as string;
    const startTime = responseTimeStamp(false);

    const gameName: string | undefined = Object.keys(req.query)[0];
    const hashedApiKey = getHashedApiKey(apiKey);

    try {
      const boardgame: BoardGame[] | string =
        await fetchGameByTitle(gameName);

      if (boardgame === "null") {
        res.status(400).send("Game not found.");
        logger(
          req,
          res,
          Number(responseTimeStamp(true, startTime)),
          await hashedApiKey
        );
        return;
      } else {
        res.status(200).send(boardgame);
        const endTime = responseTimeStamp(false);
        const responseTime = Number(endTime - startTime) / 1000000;
        logger(req, res, responseTime, await hashedApiKey);
        return;
      }
    } catch (error) {
      res.status(500).send(error);
    }
  }
);