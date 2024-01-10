import { MongoClient } from "mongodb";
import "dotenv/config";

const mongo: MongoClient = new MongoClient(process.env.MONGODB, {});
const connectMongo: MongoClient = await mongo.connect();
export default connectMongo;
