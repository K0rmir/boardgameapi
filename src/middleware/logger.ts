import express, { NextFunction, Request, Response } from "express";
import { db } from "../lib/db"
import { CronJob } from 'cron';

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

const job = new CronJob(
    '*/1 * * * *',
    async function () {
        console.log("--CronJob Start--")
        const aggregateLogs = await db.query(`INSERT INTO api_usage_aggregate (api_key, endpoint, date, request_count, avg_response_time_ms, error_count) SELECT api_key, endpoint, DATE_TRUNC('day', timestamp) AS date, COUNT(*) AS request_count, AVG(response_time_ms) AS avg_response_time_ms, COUNT(*) FILTER(WHERE status_code >= 400) AS error_count FROM api_usage_logs WHERE timestamp >= NOW() - INTERVAL '1 day' GROUP BY api_key, endpoint, DATE_TRUNC('day', timestamp)`)
        console.log("--CronJob End--")
    },
    null,
    true
)

