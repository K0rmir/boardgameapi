import { Request, Response, Router} from "express";
import { Filters, BoardGamesReturn } from "../../types";
import { responseTimeStamp } from "../../utils/ResponseTimeStamp";
import { Logger } from "../../utils/Logger";
import { fetchBoardgames } from "../../Services/BoardGames/FetchAllBoardGames";
import { calculateTotalResultCount } from "../../utils/CalculateTotalResultCount";
import { buildPaginationLinks } from "../../utils/BuildPaginationLinks";

// GET all boardgames or games by filters //
export function GetAllGames(boardGamesRouter: Router) {
    boardGamesRouter.get(
        "/",
        async (req: Request, res: Response) => {
            const startTime = responseTimeStamp()

            // Define Set of valid filters. This set and loop should be moved into a helper when params on the random endpoint are enabled.
            const validFilters = new Set([
                "gameDescription",
                "maxPlayers",
                "playTime",
                "yearPublished",
                "gameCategory",
                "gameMechanic",
                "gameDesigner",
                "pageSize",
                "page",
            ])

            // Loop over req.query object where user query params are stored and check if they are in the validFilters set.
            for (const [requestParam, value] of Object.entries(req.query)) {
                if (!validFilters.has(requestParam)) {
                    res
                        .status(400)
                        .send(
                            `Could not return results. There could be an issue with your query param, '${requestParam}'.`
                        );
                    await Logger(req, res.statusCode, responseTimeStamp(startTime))
                }
                // Check to ensure relevant integer query params don't have words as values //
                if (
                    requestParam === "maxPlayers" ||
                    requestParam === "playTime" ||
                    requestParam === "yearPublished"
                ) {
                    if (typeof value === "string" && !/\d/.test(value)) {
                        res
                            .status(400)
                            .send(
                                `Could not return results. There could be an issue with the value of one or more of your query params.`
                            );
                        await Logger(req,res.statusCode, responseTimeStamp(startTime))
                    }
                }
            }

            const filters: Filters = {
                // define search params/filters by pulling them from the search query
                game_description:
                    req.query.gameDescription === "false"
                        ? false
                        : req.query.gameDescription
                            ? true
                            : undefined,
                max_players: req.query.maxPlayers
                    ? parseInt(req.query.maxPlayers as string, 10)
                    : undefined,
                play_time: req.query.playTime
                    ? parseInt(req.query.playTime as string, 10)
                    : undefined,
                year_published: req.query.yearPublished
                    ? parseInt(req.query.yearPublished as string, 10)
                    : undefined,
                game_category: req.query.gameCategory
                    ? req.query.gameCategory.toString().split(",")
                    : undefined,
                game_mechanic: req.query.gameMechanic
                    ? req.query.gameMechanic.toString().split(",")
                    : undefined,
                game_designer: req.query.gameDesigner
                    ? req.query.gameDesigner.toString().split(",")
                    : undefined,
            }

            // Variables for pagination passed to the service methods for use in SQL queries.
            const page = req.query.page ? parseInt(req.query.page as string, 10) : 1

            let limit = req.query.pageSize
                ? parseInt(req.query.pageSize as string, 10)
                : 50; // limit how many boardgames are returned per page
            if (limit > 100) {
                limit = 100
            }

            try {
                const boardgames = await fetchBoardgames(filters, page, limit)
                const totalCount = await calculateTotalResultCount(filters)
                const totalPages = Math.ceil(totalCount / limit) // declare total number of pages here for pagination metadata
                const { nextPage, prevPage } = buildPaginationLinks(req, page, totalPages) // call helper function to build pagination next/prev page links
                await Logger(req, res.statusCode, responseTimeStamp(startTime))

                const response: BoardGamesReturn = {
                    meta: {
                        totalCount: totalCount,
                        totalPages: totalPages,
                        currentPage: page,
                        nextPage: nextPage,
                        prevPage: prevPage,
                        resultsReturned: boardgames.length,
                    },
                    results: boardgames

                }

                res.status(200).send(response)
            } catch (e) {
                res.status(500).send(e)
            }
        }
    );

}