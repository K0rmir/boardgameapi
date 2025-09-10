import * as dotenv from "dotenv";
import aggregateLogs from "./utils/cron";
import {db} from "./lib/db";
import { app } from "./app";

dotenv.config();

if (!process.env.PORT) {
  process.exit(1)
}

const PORT: string = process.env.PORT


// TODO: Move this somewhere more appropriate
// Cron route/endpoint //
/*app.get("/utils/cron", async (req, res) => {
  try {
    await aggregateLogs(req, res);
    res.status(200).send("Cron Job Completed");
  } catch (error) {
    console.error("Cron Job Failed:", error);
    res.status(500).send("Cron job failed");
  }
});*/


// Express server for local usage/testing
/*const startServer = async () => {
  try {
    // Check  connection
    db.query("SELECT 1", (err, res) => {
      if (err) {
        console.error("Error executing query:", err.stack);
        process.exit(1); // Exit the process if the connection fails
      } else {
        console.log("Database connection verified. Query result:", res.rows);
      }
    });

    // Start the server
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error("Failed to connect to the database", err);
    process.exit(1);
  }
};

startServer();*/

export default app;
