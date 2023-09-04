const { MongoClient } = require('mongodb');

/**
 * Deletes the specified refresh token and access token from the database.
 *
 * @param {string} oldRefreshToken - The old refresh token to delete.
 * @param {string} oldAccessToken - The old access token to delete.
 * @throws {Error} If either the oldRefreshToken or oldAccessToken is missing.
 * @throws {Error} If an error occurs while deleting tokens from the database.
 * @returns {boolean} True if the tokens were successfully deleted, otherwise false.
 */
async function deleteTokensFromDatabase(oldRefreshToken, oldAccessToken) {
  let client;
  if (!oldRefreshToken || !oldAccessToken) {
    throw new Error('Missing tokens');
  }

  try {
    const client = new MongoClient(process.env.MONGODB);
    await client.connect();
    const database = client.db(process.env.MONGO_DATABASE_NAME);
    const refreshTokensCollection = database.collection(process.env.MONGO_REFRESH_TOKEN_COLLECTION);
    const accessTokensCollection = database.collection(process.env.MONGO_ACCESS_TOKEN_COLLECTION);

    const deleteRefreshTokenPromise = refreshTokensCollection.deleteOne({ token: oldRefreshToken });
    const deleteAccessTokenPromise = accessTokensCollection.deleteOne({ token: oldAccessToken });
    await Promise.all([deleteRefreshTokenPromise, deleteAccessTokenPromise]);

    return deleteRefreshTokenPromise.acknowledged && deleteAccessTokenPromise.acknowledged;

  } catch (error) {
    throw new Error('Error deleting tokens from database: ' + error.message);

  } finally {
    await client.close();
  }
}

module.exports = deleteTokensFromDatabase;