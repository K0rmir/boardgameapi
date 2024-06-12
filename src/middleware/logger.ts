import express, { NextFunction, Request, Response } from "express";
import { db } from "../lib/db"

export async function logger(req: Request, res: Response) {

    const start = Date.now()

    try {
        const duration = Date.now() - start
        const createLog = await db.query('INSERT INTO api_usage_logs (api_key, endpoint, method, status_code, response_time_ms) VALUES ($1, $2, $3, $4, $5)', [req.headers['x-api-key'], req.path, req.method, res.statusCode, duration]);
        console.log("Database log inserted successfully")
    } catch (error) {
        console.error(error)
        throw error
    }
}

