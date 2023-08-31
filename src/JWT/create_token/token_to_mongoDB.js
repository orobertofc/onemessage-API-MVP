const {MongoClient} = require("mongodb");


async function tokenToMongoDB(tokenObject, collection_name) {
  let client
  try {
    client = new MongoClient(process.env.MONGODB);
    await client.connect();

    const databaseInstance = client.db(process.env.MONGO_DATABASE_NAME);
    const collection = databaseInstance.collection(collection_name);
    await collection.insertOne(tokenObject);

  } catch (error) {
    throw new Error(error.message);

  } finally {
    await client.close();
  }
}

module.exports = tokenToMongoDB;