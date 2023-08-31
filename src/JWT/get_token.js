const { generateAccessToken, generateRefreshToken} = require('./create_token/create_token');
const jwt = require('jsonwebtoken');
const deleteTokensFromDatabase = require("./delete_token/delete_token");
const checkUserExists = require("./SQL/IDIsValid");

async function getToken(oldRefreshToken, oldAccessToken, newUser) {
  try {
    let user;

    if (oldRefreshToken !== false && oldAccessToken !== false) {
      const refreshPayload = jwt.verify(oldRefreshToken, process.env.JWT_REFRESH_SECRET);
      user = await checkUserExists(refreshPayload.id);
      await deleteTokensFromDatabase(oldRefreshToken, oldAccessToken);
    }

    if (newUser !== false) {
      user = newUser;
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