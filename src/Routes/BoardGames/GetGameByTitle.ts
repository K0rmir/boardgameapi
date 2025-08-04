import { Request, Response, Router} from "express";
import { responseTimeStamp } from "../../utils/ResponseTimeStamp";
import { Logger } from "../../utils/Logger";
import { getGameByTitle } from "../../Services/FetchGameByTitle";
import { BoardGame } from "../../types";

export function GetGameByTitle(boardGamesRouter: Router) {
    boardGamesRouter.get(
        "/:gamename",
        async (req: Request, res: Response) => {
            const startTime = responseTimeStamp()
            const gameName: string = req.params.gamename

            try {
                const boardgame: BoardGame[] | string =
                    await getGameByTitle(gameName);

                if (boardgame === "null") {
                    await Logger(req, res.statusCode, responseTimeStamp(startTime))
                    res.status(400).send("Game not found.");
                } else {
                    await Logger(req, res.statusCode, responseTimeStamp(startTime))
                    res.status(200).send(boardgame)
                }
            } catch (error) {
                res.status(500).send(error)
            }
        }
    )
}
