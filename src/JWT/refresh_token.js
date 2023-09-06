const jwt = require("jsonwebtoken");
const createToken = require("./create_token");
const getUserById = require("./SQL/get_user_by_id");



/**
 * Refreshes the access token and refresh token for a user.
 *
 * @param {string} oldRefreshToken - The old refresh token to be used for refreshing the tokens.
 * @return {Promise<[string, string]>} - A Promise that resolves to an array containing the new access token and refresh token.
 * @throws {Error} - If an error occurs during the token refreshing process.
 */
async function refreshToken(oldRefreshToken) {
  try {
    const tokenDecoded = jwt.decode(oldRefreshToken);

    const user = await getUserById(tokenDecoded.id);
    if (!user) throw new Error("User does not exist");

    return [newAccessToken, newRefreshToken] = await createToken(user);

  } catch (error) {
    throw new Error(error.message);
  }
}

module.exports = refreshToken;