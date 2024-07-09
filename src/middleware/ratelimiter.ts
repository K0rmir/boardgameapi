import express, { NextFunction, Request, Response } from "express";
import { db } from "../lib/db"
import { logger } from "./logger"

export async function rateLimiter(req: Request, res: Response, next: NextFunction) {

    const requestLimit = 100;

    const apiKey = req.headers['x-api-key'] as string;

    if (!apiKey) {
        res.status(401).json({ error: 'Unathorized. Api Key is missing.' })
        console.log('Unathorized. Api Key is missing.')
        logger(req, res, 'MISSING_KEY');
        // return;
    } else if (apiKey) {
        try {

            // Define time window for total requests
            const currentTime = new Date();
            const windowSize = new Date(currentTime.getTime() - 60 * 60 * 1000); // 1 hour

            // Define number of times key has been used within windowSize
            const data = await db.query('SELECT COUNT(*) FROM api_usage_logs WHERE api_key = $1 AND timestamp >= $2', [apiKey, windowSize.toISOString()]);
            const keyCount = data.rows[0].count;

            if (keyCount >= requestLimit) {
                res.status(429).json({ error: 'Rate Limit Exceeded. Try again in one hour.' });
                logger(req, res, apiKey);
                return
            } else {
                next();
            }
        } catch (error) {
            console.error("Database Error", error);
        }
    }
}