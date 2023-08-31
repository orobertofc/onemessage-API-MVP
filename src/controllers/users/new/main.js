const { v4: uuidv4 } = require("uuid");
const { generateAccessToken, generateRefreshToken } = require("../../../JWT/create_token/create_token");
const userToDb = require("./user_to_db");
require("../../../JWT/create_token/token_to_mongoDB");
const getToken = require("../../../JWT/get_token");
async function newUser(userName) {
  try {
    const id = uuidv4();

    const user = {
      name: userName,
      id: id,
    };

    let [, [accessToken, refreshToken]] = await Promise.all([
      userToDb(user),
      getToken(false, false, user)
    ])

    return [accessToken, refreshToken, id];

  } catch (error) {
    throw new Error(error.message);
  }
}

module.exports = newUser;

