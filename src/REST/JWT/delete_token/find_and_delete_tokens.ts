import mongoClient from "../../../mongoDB/mongoClient.js";

/**
 * Finds and deletes tokens associated with a user.
 *
 * @param {string} userId - The ID of the user.
 *
 * @return {Promise<void>} - A promise that resolves once the tokens have been deleted.
 * @throws {Error} - If an error occurs while removing the tokens.
 */
async function findAndDeleteTokens(userId: string): Promise<void> {
  try {
    const databases = [
      process.env.MONGO_ACCESS_TOKEN_COLLECTION,
      process.env.MONGO_REFRESH_TOKEN_COLLECTION,
    ];
    const databaseInstance = mongoClient.db(process.env.MONGO_DATABASE_NAME);
    const collection1 = databaseInstance.collection(databases[0]);
    await collection1.deleteMany({ id: userId });

    const collection2 = databaseInstance.collection(databases[1]);
    await collection2.deleteMany({ id: userId });
  } catch (error) {
    console.error(`Failed to remove tokens due to error: ${error}`);
    throw new Error(error.message);
  }
}

export default findAndDeleteTokens;
