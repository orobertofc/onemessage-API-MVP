const { generateAccessToken, generateRefreshToken} = require('./create_token/create_token');
const jwt = require('jsonwebtoken');
const deleteTokensFromDatabase = require("./delete_token/delete_token");
const checkUserExists = require("./SQL/IDIsValid");
const find_and_delete_tokens = require("./delete_token/find_and_delete_tokens");

/**
 * Asynchronously generates a new set of refresh and access tokens for a user.
 * If an older set of refresh and access tokens is present, it verifies the refresh token, checks if the user exists,
 * and deletes the older tokens from the database. For a new user, it generates the tokens based on user data.
 *
 * @async
 * @function getToken
 * @param {string|boolean} oldRefreshToken - The older refresh token, false if not present.
 * @param {string|boolean} oldAccessToken - The older access token, false if not present.
 * @param {Object|boolean} newUser - Data of new user. false if not a new user.
 * @throws {Error} If there are any errors in token generation process or user verification.
 * @returns {Promise<Array<string>>} - Returns a Promise that resolves to an array with new access token as first element,
 * and new refresh token as second element.
 */

async function getToken(oldRefreshToken, oldAccessToken, newUser, login) {
  try {
    let user;

    if (oldRefreshToken !== false && oldAccessToken !== false) {
      const refreshPayload = jwt.verify(oldRefreshToken, process.env.JWT_REFRESH_SECRET);
      user = await checkUserExists(refreshPayload.id);
      user = refreshPayload
      deleteTokensFromDatabase(oldRefreshToken, oldAccessToken);
    }

    if (newUser !== false) {
      user = newUser;
    }

    if (login !== false) {
      user = login;
      await find_and_delete_tokens(user.id);
    }

    const [newAccessToken, newRefreshToken] = await Promise.all([
      generateAccessToken(user),
      generateRefreshToken(user.id),
    ]);

    return [newAccessToken, newRefreshToken];
  } catch (error) {
    throw new Error(error.message);
  }
}

module.exports = getToken;