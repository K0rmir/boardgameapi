import { BoardGame } from "../../src/types"

// Function args should ideally be generic enough to call anywhere
export async function expectGameData(game: BoardGame) {
    await expect(game.max_players).toEqual(4)
    await expect(game.play_time).toEqual(45)
    await expect(game.game_category).toContain("Dice Rolling")
}

