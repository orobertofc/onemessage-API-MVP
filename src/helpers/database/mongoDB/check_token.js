const mongo = require('mongodb').MongoClient;

async function checkAccessToken (token) {
  let client;

  try {
    client = await mongo.connect(process.env.MONGO_URI);
    const db = client.db(process.env.MONGO_DATABASE_NAME);
    const collection = db.collection(process.env.MONGO_ACCESS_TOKEN_COLLECTION);

    const token = await collection.findOne({token: token});

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

module.exports = checkAccessToken;