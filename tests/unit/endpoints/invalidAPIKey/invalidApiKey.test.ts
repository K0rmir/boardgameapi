import { callEndpointWithInvalidKey, callEndpointWithNoKey } from "../../../testsGlobal";


describe('GET /boardgame - Error, invalid API Key', () => {
    it('should return a 401 with "error": "Unauthorized. Api key is incorrect."', async () => {
        const response = await callEndpointWithInvalidKey("invalid")
        await expect(response.body.error).toEqual("Unauthorized. Api key is incorrect.")
    });
})

describe('GET /boardgame - Error, missing API Key', () => {
    it('should return a 401 with "error": "Unauthorized. Api key is missing."', async () => {
        const response = await callEndpointWithNoKey(undefined)
        await expect(response.body.error).toEqual("Unauthorized. Api key is missing.")
    });
})