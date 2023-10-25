import { Request, Response, Router } from "express";
import {
  authCookieOptions,
  refreshCookieOptions,
} from "../../COOKIE_SETTINGS/cookie_settings.js";
import { User_controller } from "../../../controllers/User_controller.js";

export const loginRouter = Router();

/**
 * @api {post} /login User Login
 * @apiName UserLogin
 * @apiGroup Users
 *
 * @apiParam (Request body) {String} userName The username of the user.
 * @apiParam (Request body) {String} password The password of the user.
 *
 * @apiSuccess {String} userID The ID of the user.
 *
 * @apiSuccessExample Successful Response:
 * HTTP/1.1 200 OK
 * {
 *     "userID": "5x9a2v1dau4i7v1x8v3"
 * }
 *
 * @apiError (Error 401) {String} error An error message indicating an invalid password.
 * @apiErrorExample Error response for invalid password:
 * HTTP/1.1 401 Unauthorized
 * {
 *     "error": "Invalid password"
 * }
 *
 * @apiError (Error 500) {String} error An error message indicating a server error.
 * @apiErrorExample Error response for server error:
 * HTTP/1.1 500 Internal Server Error
 * {
 *     "error": "Server error"
 * }
 */

loginRouter.post("/login", async (req: Request, res: Response) => {
  try {
    const { userName, password } = req.body;
    const hashedPassword = await hash512(password);

    const user = new User_controller(userName, password);
    const [accessToken, refreshToken, id]: [string, string, string] =
      await user.login();

    res.cookie("accessToken", accessToken, authCookieOptions);
    res.cookie("refreshToken", refreshToken, refreshCookieOptions);

    return res.status(200).json({ userID: id });
  } catch (error: any) {
    console.error(error.message);

    if (error.message === "Wrong password") {
      return res.status(401).json({ error: error.message });
    }

    return res.status(500);
  }
});
