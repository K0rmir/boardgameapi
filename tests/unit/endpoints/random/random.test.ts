import { callEndpointRandom } from "../../../testsGlobal";

describe('GET /random - Success', () => {
    it('should return a 200 with a random boardgame', async () => {
        const response = await callEndpointRandom()
        await expect(response.body[0].id).toBeDefined()
        await expect(response.body[0].game_name).toBeDefined()
    })
})