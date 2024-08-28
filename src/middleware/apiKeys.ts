import express, { NextFunction, Request, Response } from "express";
import { db } from "../lib/db";
import { logger } from "./logger";
import bcrypt from "bcrypt";

// Function to validate API key //
export async function validateApiKey(
  req: Request,
  res: Response,
  next: NextFunction
) {
  // exported to be used in router.ts

  const apiKey = req.headers["x-api-key"] as string; // define apiKey from headers of the request

  if (!apiKey) {
    res.status(401).json({ error: "Unauthorized. Api Key is missing." });
    console.log("Unauthorized. Api Key is missing.");
    logger(req, res, null, "MISSING_KEY");
    return;
  } else if (apiKey) {
    try {
      let isAuthenticated: boolean = false;
      const hashedApiKey = getHashedApiKey(apiKey);

      if (await hashedApiKey) {
        isAuthenticated = true;
      }

      if (!isAuthenticated) {
        res.status(401).json({ error: "Unauthorized. Api key is incorrect." });
        logger(req, res, null, `INVALID_KEY - ${hashedApiKey}`);
        return;
      }

      next();
    } catch (error) {
      console.error("Database Query Error: ", error);
    }
  }
}

// Helper function for fetching hashed apiKey from database //
export async function getHashedApiKey(apiKey: string) {
  const hashedKeys = await db.query("SELECT api_key FROM users");

  for (const hashedKey of hashedKeys.rows) {
    if (await bcrypt.compare(apiKey, hashedKey.api_key)) {
      const hashedApiKey = hashedKey.api_key;
      return hashedApiKey;
    }
  }
}
