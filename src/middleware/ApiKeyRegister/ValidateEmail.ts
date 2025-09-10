import {NextFunction, Request, Response} from "express";
import { db } from "../../lib/db";
import {EmailRequestBody} from "../../Routes/ApiKey/RegisterApiKey";

// TODO: Greater validation is needed overall here. Should assert it's an actual email address as well as checking it exists.
// Key could possibly be sent to users email.

export async function validateEmail(req: Request<{}, {}, EmailRequestBody>, res: Response, next: NextFunction) {

    const { email } = req.body

    if (!email) {
        console.error("Bad request. Email is missing from body of request.")
        return res.status(400).json({ error: "Bad request. Email is missing from body of request"})
    } else {
        try {
            // TODO: direct call to db isn't ideal here. Create helper function for this.
            const checkEmail = await db.query('SELECT EXISTS(SELECT 1 FROM users WHERE email = $1)', [email]);

            if (checkEmail.rows[0].exists) {
                return res.status(409).json({emailExists: true})
            } else {
                next()
            }
        } catch (error) {
            console.error("Database Query Error:", error)
            throw error
        }
    }


}