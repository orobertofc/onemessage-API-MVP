import { createClient } from "redis";
import "dotenv/config";

const client = await createClient({
  url: process.env.REDIS_URL,
})
  .on("error", (err) => console.log("Redis Client Error", err))
  .connect();

export default client;
