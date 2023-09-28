import mongoClient from "../../../../mongoDB/mongoClient.js";

/**
 * Checks if the provided access token exists in the MongoDB access token collection.
 *
 * @param {string} accessToken - The access token to check.
 * @returns {Promise<boolean>} - A promise that resolves with a boolean indicating if the access token exists.
 * @throws {Error} - If an error occurs while checking the access token.
 */
async function checkAccessToken(accessToken: string): Promise<boolean> {
  try {
    const db = mongoClient.db(process.env.MONGO_DATABASE_NAME);
    const collection = db.collection(process.env.MONGO_ACCESS_TOKEN_COLLECTION);

    const token = await collection.findOne({ token: accessToken });

    if (!token) {
      return false;
    }
    return true;
  } catch (error) {
    throw new Error(error.message);
  }
}

export default checkAccessToken;
