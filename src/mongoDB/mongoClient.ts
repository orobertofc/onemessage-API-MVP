import { MongoClient } from "mongodb";
import "dotenv/config";

const mongo: MongoClient = new MongoClient(process.env.MONGODB);
const mongoClient: MongoClient = await mongo.connect();
export default mongoClient;
