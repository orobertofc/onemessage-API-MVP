import mongoClient from "../../../mongoDB/mongoClient.js";

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
  try {
    const databaseInstance = mongoClient.db(process.env.MONGO_DATABASE_NAME);
    const collection = databaseInstance.collection(collection_name);
    await collection.insertOne(tokenObject);
  } catch (error) {
    throw new Error("Error connecting to MongoDB");
  }
}

export default tokenToMongoDB;
