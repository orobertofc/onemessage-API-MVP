import { createClient } from "redis";
import "dotenv/config";

export const connectRedis = await createClient({
  url: process.env.REDIS_URL,
})
  .on("error", (err) => console.log("Redis Client Error", err))
  .connect();
