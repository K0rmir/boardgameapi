import request from "supertest";

export const headers = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'x-api-key': process.env.API_KEY ?? ""
}

export const baseUrl = "https://boardapi.vercel.app"

// TODO: Could probably have a similar query param builder function here as is what's in endpoint
// Might be nice to call the query params with specific types and a obj

export async function callEndpointBoardgames(params?: string | undefined) {

    const paramsWithPageSize = params ? `${params}&pagesize=5` : ""

    return await request(baseUrl)
        .get(`/boardgames/?${paramsWithPageSize}`)
        .set(headers)
        .expect(200)
}

export async function callEndpointGameName(gameName: string) {
    return await request(baseUrl)
        .get(`/boardgames/${gameName}`)
        .set(headers)
        .expect(200)
}

export async function callEndpointRandom() {
    return await request(baseUrl)
        .get("/boardgames/random")
        .set(headers)
        .expect(200)
}