import express, { NextFunction, Request, Response } from "express";
import { db } from "../lib/db"
import { logger } from "./logger"

// Function to validate API key //
export async function validateApiKey(req: Request, res: Response, next: NextFunction) { // exported to be used in router.ts

    const apiKey = req.headers['x-api-key']; // define apiKey from headers of the request

    if (!apiKey) {
        res.status(401).json({ error: 'Unauthorized. Api Key is missing.' })
        console.log('Unathorized. Api Key is missing.')
        logger(req, res, 'MISSING_KEY');
        return;

    } else if (apiKey) {
        try {
            const findKey = await db.query('SELECT EXISTS(SELECT 1 FROM users WHERE api_key = $1)', [apiKey])
            const keyExists = findKey.rows[0].exists
            if (!keyExists) {
                res.status(401).json({ error: 'Unauthorized. Api key is incorrect.' })
                console.log('Unauthorized. Api key is incorrect.')
                logger(req, res, `INVALID_KEY - ${apiKey}`)
                return;
            } else {
                next() // if key matches, proceed to endpoint called.
            }
        } catch (error: any) {
            console.error("Database query error: ", error)
        }
    }
}


