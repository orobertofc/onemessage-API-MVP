const userRouter = require("express").Router();
const hash512 = require("../../../helpers/hash512");
const loginUser = require("../../../controllers/users/login/main");
const {authCookieOptions, refreshCookieOptions} = require("../../COOKIE_SETTINGS/cookie_settings");


userRouter.post("/login", async function(req, res) {
  try {
    const {userName, password} = req.body;
    const hashedPassword = await hash512(password);

    const [accessToken, refreshToken, id] = await loginUser(userName, hashedPassword);

    res.cookie("accessToken", accessToken, authCookieOptions);
    res.cookie("refreshToken", refreshToken, refreshCookieOptions);
    return res.status(200).json({"userID": id});

  } catch (error) {
    console.error(error.stackTrace)
    console.error(error.message);
    return res.status(500).json({ "error": error.message });
  }
});

module.exports = userRouter;