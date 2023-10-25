import { MongoClient } from "mongodb";
import "dotenv/config";

const mongo: MongoClient = new MongoClient(process.env.MONGODB, {
  // TODO remove this before commit
  connectTimeoutMS: 30000,
});
const connectMongo: MongoClient = await mongo.connect();
export default connectMongo;
