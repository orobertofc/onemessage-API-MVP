import { v4 as uuidv4 } from "uuid";
import { Token_controller } from "./Token_controller.js";
import { compareSync } from "bcrypt";
import { Prisma_rest_controller } from "./Prisma_rest_controller.js";
import { User } from "@prisma/client";
import { hash_password } from "../../utils/hash.js";

/**
 * User Controller class for managing user related functionality
 */
export class User_controller {
  private readonly userName: string;
  private id: string;
  private readonly password: string;
  constructor(userName: string, password: string) {
    this.userName = userName;
    this.password = password;
  }

  /**
   * Generates a new token and ID for the user.
   *
   * @returns {Promise<[string, string, string]>} A promise that resolves to an array containing the new refresh token, access token, and user ID.
   */
  public async new(): Promise<[string, string, string]> {
    this.id = uuidv4();
    const token = new Token_controller(this.id, this.userName);

    const password = hash_password(this.password);

    const [, [refreshToken, accessToken]] = await Promise.all([
      //returns void
      Prisma_rest_controller.saveToDB({
        name: this.userName,
        id: this.id,
        password: password,
      }),
      // returns array containing the refresh token and access token
      token.create(),
    ]);
    return [refreshToken, accessToken, this.id];
  }

  /**
   * Logs in the user with the provided credentials.
   *
   * @returns {Promise<[string, string, string]>} - A promise that resolves with an array containing the access token, refresh token, and user ID upon successful login.
   * @throws {Error} - If there is an error during the login process.
   */
  public async login(): Promise<[string, string, string]> {
    try {
      // Use the data provided by the constructor to get the user data from the database
      // never trust the data provided by the user :skull:
      const user: User = await Prisma_rest_controller.getByName(this.userName);

      const password_valid: boolean = compareSync(this.password, user.password);
      if (password_valid === false) {
        throw new Error("Wrong password");
      }

      const token = new Token_controller(user.id, this.userName);
      const [accessToken, refreshToken] = await token.create();

      return [accessToken, refreshToken, user.id];
    } catch (error) {
      throw new Error(error.message);
    }
  }
}
