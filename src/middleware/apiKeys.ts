import express, { NextFunction, Request, Response } from "express";
import { db } from "../lib/db"
import { logger } from "../middleware/logger"



// function to generate a random 36 character string for the api key // 
// This would be called upon a new user being generated when they sign up for a key 
// Key would then be inserted into database. Would be hashed at some point along the journey for added security. 
const genKey = () => {
    return [...Array(30)]
        .map((e) => Math.floor(Math.random() * 36).toString(36))
        .join('')
}

// Function to validate API key //
export async function validateApiKey(req: Request, res: Response, next: NextFunction) { // exported to be used in router.ts

    const apiKey = req.headers['x-api-key']; // define apiKey from headers of the request

    if (!apiKey) {
        res.status(401).json({ error: 'Unauthorized. Api Key is missing.' })
        logger(req, res)

    } else if (apiKey) {
        try {
            const findKey = await db.query('SELECT EXISTS(SELECT 1 FROM users WHERE api_key = $1)', [apiKey])
            // console.log("API key match =", findKey.rows[0].exists)
            if (findKey.rows[0].exists === 'false') {
                res.status(401).json({ error: 'Unauthorized. Api key is incorrect.' })
                logger(req, res)
            } else {
                console.log('Api Key Match!')
                logger(req, res)
                next() // if key matches, proceed to endpoint called.
            }
        } catch (error: any) {
            console.error("Database query error: ", error)
        }
    }
}


