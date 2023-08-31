const jwt = require('jsonwebtoken');
const tokenToMongoDB = require("./token_to_mongoDB");

async function generateAccessToken(payload) {
  try {
    const user = {
      userName: payload.userName,
      id: payload.ID
    };

    const JWTAccessSecret = process.env.JWT_ACCESS_SECRET;
    const accessToken = jwt.sign(user, JWTAccessSecret, { expiresIn: '1h' });

    if (accessToken === undefined) {
      throw new Error("Access token generation failed");
    }

    await tokenToMongoDB({
      ID: user.id,
      token: accessToken,
    }, process.env.MONGO_ACCESS_TOKEN_COLLECTION);

    return accessToken;
  } catch (error) {
    throw new Error(error.message);
  }
}

async function generateRefreshToken(payload) {
  try {
    const refreshTokenPayload = {
      id: payload
    };

    const JWTRefreshSecret = process.env.JWT_REFRESH_SECRET;
    const refreshToken = jwt.sign(refreshTokenPayload, JWTRefreshSecret, { expiresIn: '1h' });

    if (refreshToken === undefined) {
      throw new Error("Refresh token generation failed");
    }

    await tokenToMongoDB({
      ID: refreshTokenPayload.id,
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