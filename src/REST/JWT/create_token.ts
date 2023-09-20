import {
  generateAccessToken,
  generateRefreshToken,
} from "./create_token/create_token.js";
import findAndDeleteTokens from "./delete_token/find_and_delete_tokens.js";
import { userObject } from "../../interfaces/user_object.js";

/**
 * Creates access and refresh tokens for a given user.
 *
 * @param {userObject} userObject - The user object containing the name and id.
 * @throws {Error} Throws an error if an unexpected exception occurs.
 * @returns {Array} Returns an array with the generated access and refresh tokens.
 */
async function createToken(userObject: userObject): Promise<[string, string]> {
  try {
    const user = {
      userName: userObject.name,
      id: userObject.id,
    };

    await findAndDeleteTokens(userObject.id);

    const [accessToken, refreshToken] = await Promise.all([
      generateAccessToken(user),
      generateRefreshToken(user.id),
    ]);

    return [accessToken, refreshToken];
  } catch (error) {
    throw new Error(error.message);
  }
}

export default createToken;
