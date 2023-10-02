import { MongoClient } from "mongodb";
import "dotenv/config";

const mongoClient: MongoClient = new MongoClient(process.env.MONGODB);

export default mongoClient;
