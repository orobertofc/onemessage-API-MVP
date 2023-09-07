const {MongoClient} = require("mongodb");
const mongo = require('mongodb').MongoClient;

async function checkAccessToken (accessToken) {
  let client;

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

module.exports = checkAccessToken;