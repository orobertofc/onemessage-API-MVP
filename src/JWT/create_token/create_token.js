const jwt = require('jsonwebtoken');
const tokenToMongoDB = require("./token_to_mongoDB");

/**
 * Generates an access token for a given payload.
 *
 * @param {Object} payload - The payload containing user information.
 * @param {string} payload.userName - The username of the user.
 * @param {number} payload.ID - The ID of the user.
 * @return {Promise<string>} - The generated access token.
 * @throws {Error} - If access token generation fails or an error occurs.
 */
async function generateAccessToken(payload) {
  try {
    const user = {
      userName: payload.userName,
      id: payload.id
    };

    const token_expiration = Math.floor(Number(process.env.ACCESS_TOKEN_EXPIRATION) / 1000);

    const JWTAccessSecret = process.env.JWT_ACCESS_SECRET;
    const accessToken = jwt.sign(user, JWTAccessSecret, { expiresIn: token_expiration });

    if (accessToken === undefined) {
      throw new Error("Access token generation failed");
    }

    await tokenToMongoDB({
      id: user.id,
      token: accessToken,
    }, process.env.MONGO_ACCESS_TOKEN_COLLECTION);

    return accessToken;
  } catch (error) {
    throw new Error(error.message);
  }
}

/**
 * Generates a refresh token for the given payload.
 *
 * @param {string} payload - The payload used to generate the refresh token.
 * @return {Promise<string>} - A promise that resolves to the generated refresh token.
 * @throws {Error} - If refresh token generation fails or an error occurs while saving the token to the database.
 */
async function generateRefreshToken(payload) {
  try {
    const refreshTokenPayload = {
      id: payload
    };

    const token_expiration = Math.floor(Number(process.env.REFRESH_TOKEN_EXPIRATION) / 1000);

    const JWTRefreshSecret = process.env.JWT_REFRESH_SECRET;
    const refreshToken = jwt.sign(refreshTokenPayload, JWTRefreshSecret, { expiresIn: token_expiration });

    if (refreshToken === undefined) {
      throw new Error("Refresh token generation failed");
    }

    await tokenToMongoDB({
      id: refreshTokenPayload.id,
      token: refreshToken,
    }, process.env.MONGO_REFRESH_TOKEN_COLLECTION);

    return refreshToken;
  } catch (error) {
      throw new Error(error.message);
  }
}

module.exports = {
  generateAccessToken,
  generateRefreshToken,
}