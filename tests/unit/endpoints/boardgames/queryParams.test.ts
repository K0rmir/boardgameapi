import { BoardGame } from "../../../../src/types";
import { callEndpointBoardgames } from "../../../testsGlobal"
import {asyncWrapProviders} from "node:async_hooks";

/**
 * Query Param tests
 */

describe('GET /boardgames - Success with query params', () => {
    /**
     * Game Description
     */
    it('should return a 200 with gameDescription as query param', async () => {
        const response = await callEndpointBoardgames("?gamedescription=true")
        await expect(response.body.results[0].game_description).toBeDefined()
    })
    /**
     * Max Players - 4
     */
    it('should return a 200 with maxplayers as query param', async () => {
        const response = await callEndpointBoardgames("?maxplayers=4")
        const games = response.body.results
        games.forEach((game: BoardGame) => expect(game.max_players).toEqual(4))
    })
    /**
     * Playtime - 60
     */
    it('should return a 200 with playtime as query param', async () => {
        const response = await callEndpointBoardgames("?playtime=60")
        const games = response.body.results
        games.forEach((game: BoardGame) => expect(game.play_time).toEqual(60))
    })
    /**
     * Year Published - 2015
     */
    it('should return a 200 with yearpublished as query param', async () => {
        const response = await callEndpointBoardgames("?yearpublished=2015")
        const games = response.body.results
        games.forEach((game: BoardGame) => expect(game.year_published).toEqual(2015))
    })
    /**
     * Game Category - Card Game
     */
    it('should return a 200 with gamecategory as query param', async () => {
        const response = await callEndpointBoardgames("?gamecategory=Card Game")
        const games = response.body.results
        games.forEach((game: BoardGame) => expect(game.game_category).toContain("Card Game"))
    })
    /**
     * Game Mechanic - Dice Rolling
     */
    it('should return a 200 with gamemechanic as query param', async () => {
        const response = await callEndpointBoardgames("?gamemechanic=Dice Rolling")
        const games = response.body.results
        games.forEach((game: BoardGame) => expect(game.game_mechanic).toContain("Dice Rolling"))
    })
    /**
     * Game Designer - Elizabeth Hargrave
     */
    it('should return a 200 with gamedesigner as query param', async () => {
        const response = await callEndpointBoardgames("?gamedesigner=Elizabeth Hargrave")
        const games = response.body.results
        games.forEach((game: BoardGame) => expect(game.game_designer).toContain("Elizabeth Hargrave"))
    })
    /**
     * Multiple query params - Max Players & Play Time & Game Mechanic
     */
    it('should return a 200 with multiple query params', async () => {
        const response = await callEndpointBoardgames("?maxplayers=4&playtime=45&gamemechanic=Dice Rolling")
        const games = response.body.results

        console.log("doo =", games)

        games.forEach((game: BoardGame) => expectGameData(game))
    })
})

// Function args should ideally be generic enough to call anywhere
async function expectGameData(game: BoardGame) {
    await expect(game.max_players).toEqual(4)
    await expect(game.play_time).toEqual(45)
    await expect(game.game_category).toContain("Dice Rolling")

}
