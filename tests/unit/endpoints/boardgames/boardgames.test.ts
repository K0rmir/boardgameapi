import { callEndpointBoardgames } from "../../../testsGlobal"

/**
 * General tests
 */

describe('GET /boardgames - Success no query params', () => {
    it('should return a 200 with 50 boardgames by default', async () => {
        const response = await callEndpointBoardgames()
        await expect(response.body.meta.resultsReturned).toEqual(50)
        await expect(response.body.meta.currentPage).toEqual(1)
    })
})

describe('GET /boardgames - Success with pagination', () => {
    it('should return a 200 and be able to get the second page', async () => {
        const firstPageResponse = await callEndpointBoardgames()
        console.log("response =", firstPageResponse.body)
        await expect(firstPageResponse.body.meta.currentPage).toEqual(1)

        await expect(firstPageResponse.body.results.length > 0)

        const secondPageResponse = await callEndpointBoardgames("page=2")
        await expect(secondPageResponse.body.meta.currentPage).toEqual(2)

        await expect(firstPageResponse.body.results.length > 0)

        // Construct URL object from nextPage to accurately assert on and get around https/http in baseUrl
        expect(new URL(secondPageResponse.body.meta.nextPage).search).toContain("page=3")
    })

    it('should return a 200 with a custom page size as query param', async () => {
        const response = await callEndpointBoardgames("pagesize=10")
        await expect(response.body.meta.resultsReturned).toEqual(10)
    })

    it ('should return a 200 with a custom page number as query param', async () => {
        const response = await callEndpointBoardgames("page=5")
        await expect(response.body.meta.currentPage).toEqual(5)
    })

})