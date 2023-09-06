const { generateAccessToken, generateRefreshToken} = require('./create_token/create_token');
const findAndDeleteTokens = require("./delete_token/find_and_delete_tokens");

async function createToken(userObject) {
  try {
    const user = {
      userName: userObject.name,
      id: userObject.id,
    }

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

module.exports = createToken;