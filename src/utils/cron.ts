import { db } from "../lib/db"
import express, { Request, Response } from 'express';

export default async function aggregateLogs(req: Request, res: Response) {
    console.log("--Cron job started--");

    // Using yesterday instead of 'today' as vercel cron job is scheduled to run between 12am-1am due to free plan
    const date = new Date();
    date.setDate(date.getDate() - 1);

    const yesterday = date.toLocaleDateString('en-CA');

    // Check if there are any logs today, if so aggregate, if not, insert zero's //

    try {
        const checkLogsToday = await db.query(`SELECT timestamp FROM api_usage_logs WHERE DATE(timestamp) = $1`, [yesterday]);

        if (checkLogsToday.rows && checkLogsToday.rows.length > 0) {
            await db.query(`INSERT INTO api_usage_aggregate (api_key, endpoint, date, request_count, total_response_time_ms, error_count, query_params) SELECT api_key, endpoint, DATE_TRUNC('day', timestamp) AS date, COUNT(*) AS request_count, SUM(response_time_ms) AS total_response_time_ms, COUNT(*) FILTER(WHERE status_code >= 400) AS error_count, query_params FROM api_usage_logs WHERE timestamp >= NOW() - INTERVAL '1 day' GROUP BY api_key, endpoint, DATE_TRUNC('day', timestamp), query_params`);
            console.log(`Logs found on ${yesterday} & aggregated.`);
        } else if (!checkLogsToday.rows) {
            await db.query('INSERT INTO api_usage_aggregate (api_key, endpoint, date, request_count, avg_response_time_ms, error_count, query_params) VALUES ($1, $2, $3, $4, $5, $6)', ['NULL', '/', yesterday, 0, 0, 0, []]);
            console.log(` No logs found on ${yesterday}. Inserted zeros.`);
        }
    } catch (error) {
        console.error("Error when handling logs.", error);
        throw error;
    }

    res.status(200).json({ message: "Cron job completed" });
}
