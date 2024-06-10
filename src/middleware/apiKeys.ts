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
        res.status(401).json({ error: 'Unauthorized. Api Key is missing or incorrect.' })
        logger(req, res)
    } else if (apiKey) {
        try {
            const findKey = await db.query('SELECT * from users WHERE key = $1', [apiKey])
            if (findKey.rows.length === 0) {
                res.status(401).json({ error: 'Unauthorized. Api key is missing or incorrect.' })
                logger(req, res)
                console.error("Api Key does not exist in datadase.")
            } else {
                console.log('Api Key Match!')
                next() // if key matches, proceed to endpoint called.
            }
        } catch (error) {
            console.error("Database query error: ", error)
        }
    }
}


