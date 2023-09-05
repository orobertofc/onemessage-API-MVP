const { v4: uuidv4 } = require("uuid");
const userToDb = require("./insert_user_in_db");
require("../../../JWT/create_token/token_to_mongoDB");
const getToken = require("../../../JWT/get_token");
/**
 * Creates a new user with the given name.
 *
 * @param {string} userName - The name of the user.
 * @param {string} password - The password of the user.
 * @returns {Promise<Array>} - A Promise that resolves to an array containing the access token,
 *                           refresh token, and user ID.
 * @throws {Error} - If an error occurs while creating the new user.
 */
async function newUser(userName, password) {
  try {
    const id = uuidv4();

    const user = {
      name: userName,
      id: id,
    };

    let [, [accessToken, refreshToken]] = await Promise.all([
      userToDb(user, password),
      getToken(false, false, user, false)
    ])

    return [accessToken, refreshToken, id];

  } catch (error) {
    throw new Error(error.message);
  }
}

module.exports = newUser;

