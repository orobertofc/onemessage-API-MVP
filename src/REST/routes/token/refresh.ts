import refreshToken from "../../JWT/refresh_token.js";
import {
  authCookieOptions,
  refreshCookieOptions,
} from "../COOKIE_SETTINGS/cookie_settings.js";
import { Router } from "express";

const refreshTokenRouter = Router();

/**
 * Express middleware handler for the POST '/refresh' route of the tokenRouter object.
 * It refreshes the access and refresh tokens. If any of these tokens are missing, it will respond with an error message
 * and a 401 HTTP status. In case of any exception occurred in the process, it will response with
 * the error message and a 500 HTTP status.
 *
 * @async
 * @function
 * @param {Object} req - Express request object which should contain the old `refreshToken` and `accessToken` in the cookies.
 * @param {Object} res - Express response object used to send the response to the client.
 * @returns {Promise} Response object with status 200 on success else
 * Response object with status 401 on "Missing refresh or access token" or
 * Response object with status 500 on any error during processing.
 */

// @ts-ignore
refreshTokenRouter.post("/refresh", async function (req, res) {
  try {
    const oldRefreshToken = req.cookies.refreshToken;

    if (!oldRefreshToken)
      return res.status(401).json({ error: "Missing refresh token" });

    const [newAccessToken, newRefreshToken] =
      await refreshToken(oldRefreshToken);

    res.cookie("accessToken", newAccessToken, authCookieOptions);
    res.cookie("refreshToken", newRefreshToken, refreshCookieOptions);
    res.status(200).json({ message: "Token refreshed" });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ error: error.message });
  }
});

export default refreshTokenRouter;
