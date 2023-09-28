import { MongoClient } from "mongodb";

const mongoClient: MongoClient = new MongoClient(process.env.MONGODB);

export default mongoClient;
