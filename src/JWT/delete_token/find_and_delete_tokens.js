const {MongoClient} = require('mongodb');


async function findAndDeleteTokens(userId) {
  let client;

  try {
    let databases = [process.env.MONGO_ACCESS_TOKEN_COLLECTION, process.env.MONGO_REFRESH_TOKEN_COLLECTION];

    client = new MongoClient(process.env.MONGODB);
    await client.connect();


    const databaseInstance = client.db(process.env.MONGO_DATABASE_NAME);
    const collection1 = databaseInstance.collection(databases[0]);
    await collection1.deleteMany({ id: userId });

    const collection2 = databaseInstance.collection(databases[1]);
    await collection2.deleteMany({ id: userId });

  } catch (error) {
    console.error(`Failed to remove tokens due to error: ${error}`);
    throw new Error(error.message);

  } finally {
    await client.close();
  }
}

module.exports = findAndDeleteTokens;
