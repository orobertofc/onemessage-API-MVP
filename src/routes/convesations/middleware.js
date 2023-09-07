const jwt = require('jsonwebtoken');
const checkAccessToken = require("../../helpers/database/mongoDB/check_token.js")
const messageRouter = require("express").Router();

messageRouter.use(async function (req, res, next) {
  const token = req.cookies.accessToken;
  if (!token) {
    return res.status(401).json({"error": "Missing access token"});
  }

  try {
    jwt.decode(token);

    const isTokenValid = await checkAccessToken(token);
    if (isTokenValid === false) {
      return res.status(403).json({"error": "Invalid access token"});
    }

  } catch (error) {
    return res.status(403).json({"error": error.message});

  } finally {
    next();
  }
});

module.exports = messageRouter;