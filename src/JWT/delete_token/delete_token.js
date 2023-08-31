const { MongoClient } = require('mongodb');

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