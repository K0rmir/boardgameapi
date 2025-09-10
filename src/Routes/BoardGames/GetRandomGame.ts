import { Request, Response, Router} from "express";
import { responseTimeStamp } from "../../utils/ResponseTimeStamp";
import { Logger } from "../../utils/Logger";
import { calculateTotalGames } from "../../utils/CalculateTotalGames";
import { fetchRandomGame } from "../../Services/BoardGames/FetchRandomGame";


export function GetRandomGame(boardGamesRouter: Router) {
    boardGamesRouter.get(
        "/random",
        async (req: Request, res: Response) => {
            const startTime = responseTimeStamp()

            try {
                const totalGames = await calculateTotalGames(); // get total amount of games currently in database. This value could do with being cached.
                const randomNumber = Math.ceil(Math.random() * totalGames); // generate random number between 1 and totalGames
                const randomGame = await fetchRandomGame(randomNumber); // get random game by using randomNumber as OFFSET

                if (randomGame) {
                    await Logger(req, res.statusCode, responseTimeStamp(startTime));
                    res.status(200).json(randomGame);
                } else {
                    res.status(400).send("Could not get random game.");
                    await Logger(req, res.statusCode, responseTimeStamp(startTime))
                }
            } catch (error) {
                console.error("Error fetching random game: ", error)
                res.status(500).send(error)
            }
        }
    )
}


