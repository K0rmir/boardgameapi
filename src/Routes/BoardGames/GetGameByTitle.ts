import { Request, Response, Router} from "express";
import { responseTimeStamp } from "../../utils/ResponseTimeStamp";
import { getHashedApiKey } from "../../middleware/apiKeys";
import { logger } from "../../middleware/logger";
import { getGameByTitle } from "../../Services/FetchGameByTitle";
import { BoardGame } from "../../types";

export function GetGameByTitle(boardGamesRouter: Router) {
    boardGamesRouter.get(
        "/:gamename",
        async (req: Request, res: Response) => {
            const apiKey = req.headers["x-api-key"] as string;
            const startTime = responseTimeStamp(false);

            const gameName: string = req.params.gamename
            console.log("request =", req.params)
            const hashedApiKey = getHashedApiKey(apiKey);

            try {
                const boardgame: BoardGame[] | string =
                    await getGameByTitle(gameName);

                if (boardgame === "null") {
                    res.status(400).send("Game not found.");
                    await logger(
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
                    await logger(req, res, responseTime, await hashedApiKey);
                    return;
                }
            } catch (error) {
                res.status(500).send(error);
            }
        }
    );
}
