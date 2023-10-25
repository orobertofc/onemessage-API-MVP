import connectMongo from "./connectMongo.js";
import "dotenv/config";
import { refreshToken } from "../../interfaces/token_object.js";

/**
 * Class representing a Mongo controller for managing MongoDB database operations.
 */
export class Mongo_controller {
  private readonly database: string;
  private readonly accessTokenCollection: string;
  private readonly refreshTokenCollection: string;

  /* Constructor sets the data of the connection to the MongoDB database every time on purpose.
  This is because the data is stored in environment variables, and in case of needing to quickly swap databases,
  subsequent calls to the constructor will use the new database without having to restart the server.
  */
  constructor() {
    this.database = process.env.MONGO_DATABASE_NAME;
    this.accessTokenCollection = process.env.MONGO_ACCESS_TOKEN_COLLECTION;
    this.refreshTokenCollection = process.env.MONGO_REFRESH_TOKEN_COLLECTION;
  }

  /**
   * Saves a token object to MongoDB.
   *
   * @param {object} tokenObject - The token object to be saved.
   * @param {"refresh" | "access"} selectedCollection - The selected collection in MongoDB where the token object will be saved.
   *
   * @return {Promise<void>} Resolves when the token object is successfully saved to MongoDB. Rejects with an error if there is an issue connecting to MongoDB.
   *
   * @throws {Error} Error connecting to MongoDB.
   */
  public async tokenToMongoDB(
    tokenObject: object,
    selectedCollection: "refresh" | "access",
  ): Promise<void> {
    try {
      const databaseInstance = connectMongo.db(this.database);

      let theCollection: string;
      if (selectedCollection === "refresh") {
        theCollection = this.refreshTokenCollection;
      }
      if (selectedCollection === "access") {
        theCollection = this.accessTokenCollection;
      }
      const collection = databaseInstance.collection(theCollection);
      await collection.insertOne(tokenObject);
    } catch (error) {
      throw new Error("Error connecting to MongoDB");
    }
  }

  /**
   * Delete tokens associated with a user.
   *
   * @param {string} userId - The ID of the user whose tokens need to be deleted.
   * @return {Promise<void>} - A promise that resolves to void.
   * @throws {Error} - If an error occurred while deleting tokens.
   */
  public async deleteTokens(userId: string): Promise<void> {
    try {
      const databaseInstance = connectMongo.db(this.database);

      const deleteAccess = databaseInstance
        .collection(this.accessTokenCollection)
        .deleteMany({ id: userId });
      const deleteRefresh = databaseInstance
        .collection(this.refreshTokenCollection)
        .deleteMany({ id: userId });

      await Promise.all([deleteAccess, deleteRefresh]);
    } catch (error) {
      console.error(`Failed to remove tokens due to error: ${error}`);
      throw new Error(error.message);
    }
  }

  /**
   * Checks whether an access token exists in the access token collection.
   * @param {string} accessToken - The access token to check.
   * @return {Promise<boolean>} - A promise that resolves to a boolean value indicating whether the access token exists or not.
   * @throws {Error} - If an error occurs during the process.
   */
  public async checkAccessToken(accessToken: string): Promise<boolean> {
    try {
      const db = connectMongo.db(this.database);
      const collection = db.collection(this.accessTokenCollection);

      const token = await collection.findOne({ token: accessToken });

      return token !== null;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  /**
   * Checks if a refresh token is valid.
   * @param {string} refreshToken - The refresh token to check.
   * @returns {Promise<boolean>} - A Promise that resolves to a boolean indicating if the refresh token is valid.
   * @throws {Error} - If there is an error while checking the refresh token.
   */
  public async checkRefreshToken(refreshToken: refreshToken): Promise<boolean> {
    try {
      const db = connectMongo.db(this.database);
      const collection = db.collection(this.refreshTokenCollection);

      const token = await collection.findOne({ token: refreshToken });

      return token !== null;
    } catch (error) {
      throw new Error(error.message);
    }
  }
}
