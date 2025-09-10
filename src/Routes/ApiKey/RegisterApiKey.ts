import {Router, Response, Request} from "express";
import { postHashedApiKey } from "../../Services/ApiKey/PostHashedApiKey";

export type EmailRequestBody = {
    email: string
}

export function RegisterApiKey(apiKeyRegisterRouter: Router) {
    apiKeyRegisterRouter.post("/", async (req: Request<{}, {}, EmailRequestBody>, res: Response) => {

        const apiKey = generateApiKey()
        const apiKeyHashed = await hashApiKey(apiKey)

        if (apiKeyHashed) {
           const insert =  await postHashedApiKey(req.body.email, apiKeyHashed)
            if (insert.success) {
                res.status(200).json({apiKey: apiKey})
            }
        }
    })
}

function generateApiKey() {
    return [...Array(30)]
        .map(() => Math.floor(Math.random() * 36).toString(36))
        .join('')
}

async function hashApiKey(apiKey: string): Promise<string> {
    try {
        return await Bun.password.hash(apiKey, { algorithm: "bcrypt" })
    } catch (error) {
        console.error("Could not hash api key:", error)
        throw error
    }

}