const {Router} = require("express");
const new_user = require("../../../controllers/users/new/main.js");


const userRouter = Router();

/**
 * Handles a POST request to create a new user.
 *
 * It receives the username and password from the request body.
 * The function validates the username and password where a missing parameter or username
 * length not within the range of 3 to 20 characters is considered invalid resulting in a 400 status response.
 * A valid username is hashed and a new user is created.
 * Upon successful creation, it generates refresh and access tokens which are stored as secure HTTP-only cookies
 * with appropriate expiry times set from environment variables.
 *
 * Access token cookie is named `accessToken` and
 * Refresh token cookie is named `refreshToken`.
 * These cookies have a few security options enabled, including `Secure` and `HttpOnly` flags.
 * Expiry times for these cookies are set according to environment variables `ACCESS_TOKEN_EXPIRATION` and
 * `REFRESH_TOKEN_EXPIRATION` respectively.
 *
 * If the process is successful, it responds with a status of 200 and user's ID in json format.
 * If any error encounters during the process, it responds with a status of 500 and the error message.
 *
 * @async
 * @function
 * @param {object} req - Express request object
 * @param {object} res - Express response object
 * @param {string} req.body.user_name - The user's username
 * @param {string} req.body.password - The user's password
 * @throws {object} 400 - "Missing parameters" if user_name or password is missing
 * @throws {object} 400 - "user_name must be at least 3 characters long" if user_name is less than 3 characters
 * @throws {object} 400 - "user_name must be less than 20 characters long" if user_name is more than 20 characters
 * @throws {object} 500 - If any other error is encountered.
 * @returns {object} status 200 and { "user id": id } - user's id
 */
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
