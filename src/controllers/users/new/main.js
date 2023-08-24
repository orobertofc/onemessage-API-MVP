const { v4: uuidv4 } = require("uuid");
const { generateAccessToken, generateRefreshToken } = require("../../../JWT/create_token/create_token");
const userToDb = require("./user_to_db");
require("../../../JWT/create_token/token_to_mongoDB");
async function newUser(user_name) {
  try {
    const public_id = uuidv4();
    const private_id = uuidv4();

    const user = {
      user_name: user_name,
      public_id: public_id,
      private_id: private_id,
    };

    const [access_token, refresh_token] = await Promise.all([
      generateAccessToken(user),
      generateRefreshToken(user.private_id),
    ]);

    await userToDb(user);

    return [access_token, refresh_token];

    } catch (error) {
      throw new Error(error.message);
    }
  }

module.exports = newUser;
