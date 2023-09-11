import jwt from "jsonwebtoken";
import createToken from "./create_token.js";
import getUserById from "./SQL/get_user_by_id.js";
import {accessToken} from "../../interfaces/token_object.js";
import checkAccessToken from "../helpers/database/mongoDB/check_token";


/**
 * Refreshes the access token and refresh token for a user.
 *
 * @param {string} oldRefreshToken - The old refresh token to be used for refreshing the tokens.
 * @return {Promise<[string, string]>} - A Promise that resolves to an array containing the new access token and refresh token.
 * @throws {Error} - If an error occurs during the token refreshing process.
 */
async function refreshToken(oldRefreshToken: string): Promise<[string, string]> {
  try {
    const token = <accessToken> jwt.verify(oldRefreshToken, process.env.JWT_REFRESH_SECRET)

    const user = await getUserById(token.id);
    if (!user) throw new Error("User does not exist");

    const tokenValid: boolean = await checkAccessToken(oldRefreshToken);
    if (!tokenValid) throw new Error("Token is not valid");

    const [newAccessToken, newRefreshToken] = await createToken(user);
    return [newAccessToken, newRefreshToken];

  } catch (error) {
    throw new Error(error.message);
  }
}

export default refreshToken;