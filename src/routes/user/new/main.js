const {Router} = require("express");
const new_user = require("../../../controllers/users/new/main.js");


const userRouter = Router();

userRouter.post('/new', async function(req, res) {
  try {
    const user_name = req.body.user_name;

    if (!user_name) {
      return res.status(400).json({ "error": "Missing user_name in the request body" });
    }

    if (user_name.length < 3) {
      return res.status(400).json({ "error": "user_name must be at least 3 characters long" });
    }

    if (user_name.length > 20) {
      return res.status(400).json({ "error": "user_name must be less than 20 characters long" });
    }

    const [refreshToken, accessToken, id] = await new_user(user_name);

    const auth_cookie_options = {
      expires: new Date(Date.now() + Number(process.env.ACCESS_TOKEN_EXPIRATION)),
      httpOnly: true,
      secure: true
    }

    const refresh_cookie_options = {
      expires: new Date(Date.now() + Number(process.env.REFRESH_TOKEN_EXPIRATION)),
      httpOnly: true,
      secure: true
    };

    res.cookie("accessToken", accessToken, auth_cookie_options);
    res.cookie("refreshToken", refreshToken, refresh_cookie_options);
    return res.status(200).json({"user id": id});

  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ "error": error.message });
  }
});

module.exports = userRouter;
