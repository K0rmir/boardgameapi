import express, { NextFunction, Request, Response } from "express";
import { boardGamesRouter } from "../../app";
import { BoardGame, Filters } from "../../types";
import { responseTimeStamp } from "../../utils/ResponseTimeStamp";
import { getHashedApiKey } from "../../middleware/apiKeys";
import { logger } from "../../middleware/logger";
import { fetchBoardgames } from "../../Services/FetchAllBoardGames";
import { calculateTotalResultCount } from "../../utils/CalculateTotalResultCount";
import { buildPaginationLinks } from "../../utils/BuildPaginationLinks";

// GET all boardgames or games by filters //
boardGamesRouter.get(
  "/",
  async (req: Request, res: Response, next: NextFunction) => {
    const apiKey = req.headers["x-api-key"] as string;
    const startTime = responseTimeStamp(false);
    const hashedApiKey = getHashedApiKey(apiKey);

    // Define Set of valid filters. This set and loop should be moved into a helper when params on the random endpoint are enabled.
    const validFilters = new Set([
      "gamedescription",
      "maxplayers",
      "playtime",
      "yearpublished",
      "gamecategory",
      "gamemechanic",
      "gamedesigner",
      "pagesize",
      "page",
    ]);

    // Loop over req.query object where user query params are stored and check if they are in the validFilters set.
    for (const [requestParam, value] of Object.entries(req.query)) {
      if (!validFilters.has(requestParam)) {
        res
          .status(400)
          .send(
            `Could not return results. There could be an issue with your query param, '${requestParam}'.`
          );
        logger(
          req,
          res,
          Number(responseTimeStamp(true, startTime) / 1000000),
          await hashedApiKey
        );
        return;
      }
      // Check to ensure relevant integer query params don't have words as values //
      if (
        requestParam === "maxplayers" ||
        requestParam === "playtime" ||
        requestParam === "yearpublished"
      ) {
        if (typeof value === "string" && !/\d/.test(value)) {
          res
            .status(400)
            .send(
              `Could not return results. There could be an issue with the value of one or more of your query params.`
            );
          logger(
            req,
            res,
            Number(responseTimeStamp(true, startTime) / 1000000),
            await hashedApiKey
          );
          return;
        }
      }
    }

    const filters: Filters = {
      // define search params/filters by pulling them from the search query
      game_description:
        req.query.gamedescription === "false"
          ? false
          : req.query.gamedescription
            ? true
            : undefined,
      max_players: req.query.maxplayers
        ? parseInt(req.query.maxplayers as string, 10)
        : undefined,
      play_time: req.query.playtime
        ? parseInt(req.query.playtime as string, 10)
        : undefined,
      year_published: req.query.yearpublished
        ? parseInt(req.query.yearpublished as string, 10)
        : undefined,
      game_category: req.query.gamecategory
        ? req.query.gamecategory.toString().split(",")
        : undefined,
      game_mechanic: req.query.gamemechanic
        ? req.query.gamemechanic.toString().split(",")
        : undefined,
      game_designer: req.query.gamedesigner
        ? req.query.gamedesigner.toString().split(",")
        : undefined,
    };

    // Variables for pagination passed to the service methods for use in SQL queries.
    const page = req.query.page ? parseInt(req.query.page as string, 10) : 1;

    let limit = req.query.pagesize
      ? parseInt(req.query.pagesize as string, 10)
      : 50; // limit how many boardgames are returned per page
    if (limit > 100) {
      limit = 100;
    }

    try {
      const boardgames = await fetchBoardgames(
        filters,
        page,
        limit
      );
      const totalCount = await calculateTotalResultCount(filters);
      const totalPages = Math.ceil(totalCount / limit); // declare total number of pages here for pagination metadata
      const { nextPage, prevPage } = buildPaginationLinks(
        req,
        page,
        totalPages
      ); // call helper function to build pagination next/prev page links

      res.status(200).send({
        // send object of pagination metadata and boardgames results as response
        totalCount,
        totalPages,
        currentPage: page,
        nextPage,
        prevPage,
        resultsReturned: boardgames.length,
        results: boardgames,
      });
      const endTime = responseTimeStamp(false);
      const responseTime = Number(endTime - startTime) / 1000000;
      logger(req, res, responseTime, await hashedApiKey);
      return;
    } catch (e) {
      res.status(500).send(e);
      return;
    }
  }
);