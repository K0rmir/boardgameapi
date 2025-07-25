import {NextFunction, Request, Response, Router} from "express";
import { boardGamesRouter } from "../../app";
import { responseTimeStamp } from "../../utils/ResponseTimeStamp";
import { getHashedApiKey } from "../../middleware/apiKeys";
import { logger } from "../../middleware/logger";
import { calculateTotalGames } from "../../utils/CalculateTotalGames";
import { fetchRandomGame } from "../../Services/FetchRandomGame";


export function GetRandomGame(boardGamesRouter: Router) {
    boardGamesRouter.get(
        "/random",
        async (req: Request, res: Response, next: NextFunction) => {
            const apiKey = req.headers["x-api-key"] as string;
            const startTime = responseTimeStamp(false);
            const hashedApiKey = getHashedApiKey(apiKey);

            try {
                const totalGames = await calculateTotalGames(); // get total amount of games currently in database.
                const randomNumber = Math.ceil(Math.random() * totalGames); // generate random number between 1 and totalGames
                const randomGame = await fetchRandomGame(randomNumber); // get random game by using randomNumber as OFFSET

                if (randomGame) {
                    const endTime = responseTimeStamp(false);
                    const responseTime = Number(endTime - startTime) / 1000000;
                    await logger(req, res, responseTime, await hashedApiKey);
                    res.status(200).json(randomGame);


                } else {
                    res.status(400).send("Could not get random game.");
                    await logger(
                        req,
                        res,
                        Number(responseTimeStamp(true, startTime) / 1000000),
                        await hashedApiKey
                    );
                }
            } catch (error) {
                console.error("Error fetching random game: ", error);
                res.status(500).send(error);
            }
        }
    );
}


