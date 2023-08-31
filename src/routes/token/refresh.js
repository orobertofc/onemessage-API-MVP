const {Router, urlencoded} = require("express");
const getToken = require("../../JWT/get_token");
const cookieParser = require("cookie-parser");

const tokenRouter = Router();

tokenRouter.post('/refresh', async function(req, res) {
  try {
    const oldRefreshToken = req.cookies.refreshToken;
    const oldAccessToken = req.cookies.accessToken;

    if (!oldRefreshToken || !oldAccessToken) return res.status(401).json({error: "Missing refresh or access token"});

    const tokens = await getToken(oldRefreshToken, oldAccessToken, false);

    res.cookie('accessToken', tokens[0], {httpOnly: true});
    res.cookie('refreshToken', tokens[1], {httpOnly: true});
    res.sendStatus(200);
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ "error": error.message });
  }
})

module.exports = tokenRouter;