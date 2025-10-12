import request from "supertest";

/**
 * Headers with valid API Key
 */
export const headersValid = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'x-api-key': process.env.API_KEY
}

/**
 * Headers with invalid API Key
 */
type invalidApiKeyStates = "invalid" | undefined

const getHeadersInvalid = (apiKeyState: invalidApiKeyStates) => {
    return {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'x-api-key': apiKeyState === "invalid" ? `${process.env.API_KEY}--invalid` : ""
    }
}

export const baseUrl = "https://boardapi.vercel.app"

// TODO: Could probably have a similar query param builder function here as is what's in endpoint
// Might be nice to call the query params with specific types and a obj

/**
 * Base Request with valid API Key
 */
const baseRequestValid = async (endpoint: string) => {
    return await request(baseUrl)
        .get(endpoint)
        .set(headersValid)
        .expect(200)
}

export async function callEndpointBoardgames(params?: string | undefined) {
    const paramsWithPageSize = params ? `${params}&pagesize=5` : ""
    return await baseRequestValid(`/boardgames/?${paramsWithPageSize}`)
}

export async function callEndpointGameName(gameName: string) {
    return await baseRequestValid(`/boardgames/${gameName}`)
}

export async function callEndpointRandom() {
    return await baseRequestValid(`/boardgames/random`)
}

/**
 * Base Request with invalid API Key
 */
const baseRequestInvalid = async (apiKeyState: invalidApiKeyStates) => {
    return request(baseUrl)
        .get("/boardgames")
        .set(getHeadersInvalid(apiKeyState))
        .expect(401)
}

export async function callEndpointWithInvalidKey(apiKeyState: invalidApiKeyStates) {
   return await baseRequestInvalid(apiKeyState)
}

export async function callEndpointWithNoKey(apiKeyState: invalidApiKeyStates) {
    return await baseRequestInvalid(apiKeyState)
}