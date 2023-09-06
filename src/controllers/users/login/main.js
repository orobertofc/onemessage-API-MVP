const getToken = require("../../../JWT/create_token");
const userFromDb = require("../login/get_user_from_db");
const createToken = require("../../../JWT/create_token");


async function loginUser(userName, password) {
  try {
    const user = await userFromDb(userName);

    if (user.password !== password) {
      throw new Error("Invalid password");
    }

    const [accessToken, refreshToken] = await createToken(user)

    return [accessToken, refreshToken, user.id];

  } catch (error) {
    throw new Error(error.message);
  }
}

module.exports = loginUser;