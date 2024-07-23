import { db } from "../../../lib/db"

export default async function aggregateLogs() {
    console.log("--CronJob Start--");

    const date = new Date();
    const today = date.toLocaleDateString('en-CA');

    // Check if there are any logs today, if so aggregate, if not, insert zero's //
    const checkLogsToday: any = await db.query(`SELECT timestamp FROM api_usage_logs WHERE DATE(timestamp) = $1`, [today]);

    if (checkLogsToday.rows.length > 0) {
        await db.query(`INSERT INTO api_usage_aggregate (api_key, endpoint, date, request_count, avg_response_time_ms, error_count) SELECT api_key, endpoint, DATE_TRUNC('day', timestamp) AS date, COUNT(*) AS request_count, AVG(response_time_ms) AS avg_response_time_ms, COUNT(*) FILTER(WHERE status_code >= 400) AS error_count FROM api_usage_logs WHERE timestamp >= NOW() - INTERVAL '1 day' GROUP BY api_key, endpoint, DATE_TRUNC('day', timestamp)`);
        console.log(`Logs found on ${today} & aggregated.`);
        console.log("--CronJob End--");
    } else {
        await db.query('INSERT INTO api_usage_aggregate (api_key, endpoint, date, request_count, avg_response_time_ms, error_count) VALUES ($1, $2, $3, $4, $5, $6)', ['NULL', '/', today, 0, 0, 0]);
        console.log(` No logs found on ${today}. Inserted zeros.`);
        console.log("--CronJob End--");
    }
}
