import { MongoClient } from "mongodb";

/**
 * Saves a token object to MongoDB.
 * @param {Object} tokenObject - The token object to be saved.
 * @param {string} collection_name - The name of the collection in MongoDB where the token object will be saved.
 * @return {Promise<void>} - A promise that resolves when the token object is successfully saved to MongoDB, or rejects with an error if there was a failure.
 */
async function tokenToMongoDB(
  tokenObject: object,
  collection_name: string,
): Promise<void> {
  let client: MongoClient;
  try {
    client = new MongoClient(process.env.MONGODB);
    await client.connect();

    const databaseInstance = client.db(process.env.MONGO_DATABASE_NAME);
    const collection = databaseInstance.collection(collection_name);
    await collection.insertOne(tokenObject);
  } catch (error) {
    throw new Error("Error connecting to MongoDB");
  } finally {
    await client.close();
  }
}

export default tokenToMongoDB;
