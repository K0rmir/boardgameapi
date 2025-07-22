import { Router } from "express";
import { GetAllGames } from "./GetAllGames";
import { GetGameByTitle } from "./GetGameByTitle";
import { GetRandomGame } from "./GetRandomGame";

export function registerBoardGameRoutes(router: Router) {
    GetAllGames(router)
    GetGameByTitle(router)
    GetRandomGame(router)
}