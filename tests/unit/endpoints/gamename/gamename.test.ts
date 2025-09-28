import { callEndpointGameName } from "../../../testsGlobal";

describe('GET /gamename - Success', () => {
    it('should return a 200 with the requested boardgame', async () => {
        const response = await callEndpointGameName("wingspan")
        await expect(response.body[0].game_name).toEqual("Wingspan")
    })
})