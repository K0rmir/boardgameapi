import { Request, Response, Router} from "express";
import { responseTimeStamp } from "../../utils/ResponseTimeStamp";
import { logger } from "../../middleware/logger";
import { getGameByTitle } from "../../Services/FetchGameByTitle";
import { BoardGame } from "../../types";

export function GetGameByTitle(boardGamesRouter: Router) {
    boardGamesRouter.get(
        "/:gamename",
        async (req: Request, res: Response) => {
            const startTime = responseTimeStamp(false);

            const gameName: string = req.params.gamename
            const hashedApiKey = req.hashedApiKey

            try {
                const boardgame: BoardGame[] | string =
                    await getGameByTitle(gameName);

                if (boardgame === "null") {
                    res.status(400).send("Game not found.");
                    await logger(
                        req,
                        res,
                        Number(responseTimeStamp(true, startTime)),
                        hashedApiKey
                    );
                    return;
                } else {
                    res.status(200).send(boardgame);
                    const endTime = responseTimeStamp(false);
                    const responseTime = Number(endTime - startTime) / 1000000;
                    await logger(req, res, responseTime, hashedApiKey);
                    return;
                }
            } catch (error) {
                res.status(500).send(error);
            }
        }
    );
}
