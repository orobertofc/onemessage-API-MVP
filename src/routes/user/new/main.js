const express = require('express');
const new_user = require("../../../controllers/users/new/main.js");
const cookieParser = require('cookie-parser');
const {json, urlencoded} = require("body-parser");

const userRouter = express.Router();

// parse cookies
userRouter.use(cookieParser());
// parse application/x-www-form-urlencoded
userRouter.use(urlencoded({ extended: false }))
// parse application/json
userRouter.use(json())

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

    const tokens = await new_user(user_name);

    const auth_cookie_options = {
      expires: new Date(Date.now() + 60 * 60 * 1000), // 1 hour (in milliseconds)
      httpOnly: true,
      secure: true
    }

    const refresh_cookie_options = {
      expires: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours (in milliseconds)
      httpOnly: true,
      secure: true
    };

    if (Array.isArray(tokens)) {
      res.cookie("auth_DO_NOT_SHARE_OR_DELETE", tokens[0], auth_cookie_options);
      res.cookie("refresh_DO_NOT_SHARE_OR_DELETE", tokens[1], refresh_cookie_options);
      return res.status(200).json("Account created");
    }

  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ "error": "Internal server error" });
  }
});

module.exports = userRouter;
