import express, { NextFunction, Request, Response } from "express";
import { db } from "../lib/db"
// import { CronJob } from 'cron';

export async function logger(req: Request, res: Response, responseTime: number, hashedApiKey?: string) {

    const responseTimeMs = () => {
        return parseFloat(responseTime.toFixed(2));
    }

    try {
        await db.query('INSERT INTO api_usage_logs (api_key, endpoint, method, status_code, response_time_ms, query_params) VALUES ($1, $2, $3, $4, $5, $6)', [hashedApiKey || null, req.path, req.method, res.statusCode, responseTimeMs(), Object.keys(req.query)]);
        console.log("Database log inserted successfully");
    } catch (error) {
        console.error(error);
        throw error;
    }
}

// Cron job functions for local testing //

// const job = new CronJob(
//     '*/1 * * * *',
//     async function () {
//         console.log("--CronJob Start--");

//         const date = new Date();
//         const today = date.toLocaleDateString('en-CA');

//         //         // Check if there are any logs today, if so aggregate, if not, insert zero's //
//         const checkLogsToday: any = await db.query(`SELECT timestamp FROM api_usage_logs WHERE DATE(timestamp) = $1`, [today]);

//         if (checkLogsToday.rows.length > 0) {
//             const aggregateLogs = await db.query(`INSERT INTO api_usage_aggregate (api_key, endpoint, date, request_count, avg_response_time_ms, error_count, query_params) SELECT api_key, endpoint, DATE_TRUNC('day', timestamp) AS date, COUNT(*) AS request_count, AVG(response_time_ms) AS avg_response_time_ms, COUNT(*) FILTER(WHERE status_code >= 400) AS error_count, query_params FROM api_usage_logs WHERE timestamp >= NOW() - INTERVAL '1 day' GROUP BY api_key, endpoint, DATE_TRUNC('day', timestamp), query_params`);
//             console.log("Logs found & aggregated");
//             console.log("--CronJob End--");
//         } else {
//             await db.query('INSERT INTO api_usage_aggregate (api_key, endpoint, date, request_count, avg_response_time_ms, error_count) VALUES ($1, $2, $3, $4, $5, $6)', ['NULL', '/', today, 0, 0, 0]);
//             console.log(` No logs found on ${today}. Inserted zeros`);
//             console.log("--CronJob End--");
//         }
//     },
//     null,
//     true
// );

