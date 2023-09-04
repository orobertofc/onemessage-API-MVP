const userRouter = require("express").Router();
const hash512 = require("../../../helpers/hash512");
const loginUser = require("../../../controllers/users/login/main");
const {authCookieOptions, refreshCookieOptions} = require("../../COOKIE_SETTINGS/cookie_settings");


userRouter.post("/login", async function(req, res) {
  try {
    const {userName, password} = req.body;

    if (!userName || !password) {
      return res.status(400).json({ "error": "Missing required fields" });
    }

    const hashedPassword = await hash512(password);

    const [refreshToken, accessToken, id] = await loginUser(userName, hashedPassword);

    res.cookie("accessToken", accessToken, authCookieOptions);
    res.cookie("refreshToken", refreshToken, refreshCookieOptions);
    return res.status(200).json({"user id": id});

  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ "error": error.message });
  }
});

module.exports = userRouter;