import { accessToken, refreshToken } from "../../interfaces/token_object.js";
import jwt from "jsonwebtoken";
import { Mongo_controller } from "../../databases/mongoDB/Mongo_controller.js";
import { Prisma_rest_controller } from "./Prisma_rest_controller.js";

/**
 * Token_controller class handles the generation and refreshing of access and refresh tokens.
 * It communicates with the Mongo_controller class to store and retrieve tokens in/from a MongoDB database.
 *
 * @class
 */
export class Token_controller {
  private readonly id: string;
  private mongo: Mongo_controller;
  private readonly userName: string;

  constructor(id: string, userName: string) {
    this.id = id;
    this.userName = userName;
  }

  /**
   * Creates a new entity and returns an access token and a refresh token.
   *
   * @returns {Promise<[string, string]>} A promise that resolves to an array containing the access token and refresh token.
   * @throws {Error} If an error occurs during the creation process.
   */
  public async create(): Promise<[string, string]> {
    try {
      if (this.mongo === undefined) {
        this.mongo = new Mongo_controller();
      }
      await this.mongo.deleteTokens(this.id);

      const [accessToken, refreshToken] = await Promise.all([
        this.generateAccess(),
        this.generateRefresh(),
      ]);

      return [accessToken, refreshToken];
    } catch (error) {
      throw new Error(error.message);
    }
  }

  /**
   * Refreshes an access token and a refresh token.
   *
   * @param {string} oldRefreshToken - The old refresh token.
   * @returns {Promise<[string, string]>} - A promise that resolves to an array containing the new access token and the new refresh token.
   * @throws {Error} - If an error occurs during the refresh process.
   */
  public static async refresh(
    oldRefreshToken: refreshToken,
  ): Promise<[string, string]> {
    try {
      // @ts-ignore
      const tokenInfo = <
        accessToken // @ts-ignore
      >jwt.verify(oldRefreshToken, process.env.JWT_REFRESH_SECRET);

      // no need to check if those exist like the create() method because this one is static
      const token = new Token_controller(tokenInfo.id, tokenInfo.userName);
      token.mongo = new Mongo_controller();

      const [user, tokenValid] = await Promise.all([
        Prisma_rest_controller.isUserValid(tokenInfo.id),
        token.mongo.checkRefreshToken(oldRefreshToken),
      ]);

      if (user === false) {
        throw new Error("User not found");
      }

      if (!tokenValid) {
        throw new Error("Invalid token");
      }

      const [newAccessToken, newRefreshToken] = await token.create();
      return [newAccessToken, newRefreshToken];
    } catch (error) {
      throw new Error(error.message);
    }
  }

  /**
   * Generates an access token for a user.
   *
   * @returns {Promise<string>} A promise that resolves with the generated access token.
   * @throws {Error} If access token generation fails or an error occurs.
   */
  private async generateAccess(): Promise<string> {
    try {
      const payload: accessToken = {
        userName: this.userName,
        id: this.id,
      };
      const token_expiration = Math.floor(
        Number(process.env.ACCESS_TOKEN_EXPIRATION) / 1000,
      );

      const JWTAccessSecret = process.env.JWT_ACCESS_SECRET;
      const accessToken = jwt.sign(payload, JWTAccessSecret, {
        expiresIn: token_expiration,
      });

      if (accessToken === undefined) {
        throw new Error("Access token generation failed");
      }

      await this.mongo.tokenToMongoDB(
        {
          id: this.id,
          token: accessToken,
        },
        "access",
      );

      return accessToken;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  /**
   * Generates a refresh token for the user.
   *
   * @returns {Promise<string>} The generated refresh token.
   * @throws {Error} If the refresh token generation fails.
   */
  private async generateRefresh(): Promise<string> {
    try {
      const payload: refreshToken = {
        id: this.id,
      };

      const token_expiration = Math.floor(
        Number(process.env.REFRESH_TOKEN_EXPIRATION) / 1000,
      );

      const JWTRefreshSecret = process.env.JWT_REFRESH_SECRET;
      const refreshToken = jwt.sign(payload, JWTRefreshSecret, {
        expiresIn: token_expiration,
      });

      if (refreshToken === undefined) {
        throw new Error("Refresh token generation failed");
      }

      await this.mongo.tokenToMongoDB(
        {
          id: this.id,
          token: refreshToken,
        },
        "refresh",
      );

      return refreshToken;
    } catch (error) {
      throw new Error(error.message);
    }
  }
}
