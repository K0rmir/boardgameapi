import { NextFunction, Request, Response } from "express";
import { db } from "../../lib/db";
import bcrypt from "bcrypt"

export async function validateApiKey(
  req: Request,
  res: Response,
  next: NextFunction
) {

  const apiKey: string | undefined = req.get("x-api-key")

  if (!apiKey) {
    console.error("Unauthorized. Api Key is missing.");
    return res.status(401).json({ error: "Unauthorized. Api Key is missing." });
  } else {
    try {
      const hashedApiKey = await getHashedApiKey(apiKey);

      if (hashedApiKey) {
        // Store raw & hashed key for use in endpoints
        req.validatedApiKey = apiKey
        req.hashedApiKey = hashedApiKey
        next()
      } else {
        return res.status(401).json({ error: "Unauthorized. Api key is incorrect." });
      }
    } catch (error) {
      console.error("Database Query Error: ", error);
    }
  }
}

export async function getHashedApiKey(apiKey: string) {
  const hashedKeys = await db.query("SELECT api_key FROM users");

  for (const hashedKey of hashedKeys.rows) {
    if (await bcrypt.compare(apiKey, hashedKey.api_key)) {
      return hashedKey.api_key
    }
  }
}
