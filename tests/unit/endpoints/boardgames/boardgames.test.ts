import { callEndpointBoardgames } from "../../../testsGlobal"

/**
 * General tests
 */

describe('GET /boardgames - Success no query params', () => {
    it('should return a 200 with 50 boardgames', async () => {
        const response = await callEndpointBoardgames()
        await expect(response.body.resultsReturned).toEqual(50)
        await expect(response.body.currentPage).toEqual(1)
    })
})

describe('GET /boardgames - Success with pagination', () => {
    it('should return a 200 and be able to get the second page', async () => {
        const firstPageResponse = await callEndpointBoardgames()
        await expect(firstPageResponse.body.currentPage).toEqual(1)

        const secondPageResponse = await callEndpointBoardgames("?page=2")
        await expect(secondPageResponse.body.currentPage).toEqual(2)
        // Construct URL object from nextPage to accurately assert on and get around https/http in baseUrl
        expect(new URL(secondPageResponse.body.nextPage).search).toBe("?page=3")
    })

    it('should return a 200 with a custom page size as query param', async () => {
        const response = await callEndpointBoardgames("?pagesize=10")
        await expect(response.body.resultsReturned).toEqual(10)
    })

})