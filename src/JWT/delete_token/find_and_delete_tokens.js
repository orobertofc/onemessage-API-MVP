const {MongoClient} = require('mongodb');


async function find_and_delete_tokens(userId) {
  try {

  let databases = [process.env.MONGO_ACCESS_TOKEN_COLLECTION, process.env.MONGO_REFRESH_TOKEN_COLLECTION];

  for (let i = 0; i < databases.length; i++) {
    const client = new MongoClient(process.env.MONGODB);
    await client.connect();
    const databaseInstance = client.db(process.env.MONGO_DATABASE_NAME);
    const collection = databaseInstance.collection(databases[i]);
    await collection.deleteMany({userId: userId});
    await client.close();
  }

  } catch (error) {
    throw new Error(error.message);
  }
}

module.exports = find_and_delete_tokens;
