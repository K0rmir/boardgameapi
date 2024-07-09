import { db } from "../lib/db"

export default async function aggregateLogs() {
    console.log("--CronJob Start--")
    await db.query(`INSERT INTO api_usage_aggregate (api_key, endpoint, date, request_count, avg_response_time_ms, error_count) SELECT api_key, endpoint, DATE_TRUNC('day', timestamp) AS date, COUNT(*) AS request_count, AVG(response_time_ms) AS avg_response_time_ms, COUNT(*) FILTER(WHERE status_code >= 400) AS error_count FROM api_usage_logs WHERE timestamp >= NOW() - INTERVAL '1 day' GROUP BY api_key, endpoint, DATE_TRUNC('day', timestamp)`)
    console.log("--CronJob End--")
}
