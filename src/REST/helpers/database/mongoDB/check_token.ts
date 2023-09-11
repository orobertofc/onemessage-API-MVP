import {MongoClient} from "mongodb";

/**
 * Checks if the provided access token exists in the MongoDB access token collection.
 *
 * @param {string} accessToken - The access token to check.
 * @returns {Promise<boolean>} - A promise that resolves with a boolean indicating if the access token exists.
 * @throws {Error} - If an error occurs while checking the access token.
 */
async function checkAccessToken (accessToken: any): Promise<boolean> {
  let client: MongoClient;

  try {
    client = new MongoClient(process.env.MONGODB);
    await client.connect();

    const db = client.db(process.env.MONGO_DATABASE_NAME);
    const collection = db.collection(process.env.MONGO_ACCESS_TOKEN_COLLECTION);

    const token = await collection.findOne({token: accessToken});

    if (!token) {
      return false;
    }

    return true;

  } catch (error) {
    throw new error(error.message);

  } finally {
    await client.close();
  }
}

export default checkAccessToken;