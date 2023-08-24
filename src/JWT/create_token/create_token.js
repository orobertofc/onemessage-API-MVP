const jwt = require('jsonwebtoken');
const tokenToMongoDB = require("./token_to_mongoDB");

async function generateAccessToken(payload) {
  try {

    const user = {
      username: payload.user_name,
      public_id: payload.public_id,
      private_id: payload.private_id,
    }

    const JWT_access_secret = process.env.JWT_ACCESS_SECRET;
    const accessToken = jwt.sign(user, JWT_access_secret, { expiresIn: '1h' });

      await tokenToMongoDB({
        private_id: user.private_id,
        token: accessToken,
      }, process.env.MONGO_ACCESS_TOKEN_COLLECTION);

    return accessToken;

  } catch (error) {
    throw new Error(`Error generating access token: ${error.message}`);
  }

}

async function generateRefreshToken(payload) {
  try {
    const JWT_refresh_secret = process.env.JWT_REFRESH_SECRET;
    const refreshToken = jwt.sign({ private_id: payload }, JWT_refresh_secret, { expiresIn: '1h' });

    await tokenToMongoDB({
      private_id: payload,
      token: refreshToken
    } , process.env.MONGO_REFRESH_TOKEN_COLLECTION);

    return refreshToken;

  } catch (error) {
    throw new Error(error.message);
  }
}

module.exports = {
  generateAccessToken,
  generateRefreshToken
};