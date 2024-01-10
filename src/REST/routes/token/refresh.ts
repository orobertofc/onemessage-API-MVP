import {
  authCookieOptions,
  refreshCookieOptions,
} from "../COOKIE_SETTINGS/cookie_settings.js";
import { Request, Response, Router } from "express";
import { Token_controller } from "../../controllers/Token_controller.js";
import { refreshToken } from "../../../interfaces/token_object.js";

export const refreshTokenRouter = Router();

refreshTokenRouter.post("/refresh", async (req: Request, res: Response) => {
  try {
    const oldRefreshToken = <refreshToken>req.cookies.refreshToken;

    if (!oldRefreshToken)
      return res.status(401).json({ error: "Missing refresh token" });

    const [newAccessToken, newRefreshToken] =
      await Token_controller.refresh(oldRefreshToken);

    res.cookie("accessToken", newAccessToken, authCookieOptions);
    res.cookie("refreshToken", newRefreshToken, refreshCookieOptions);
    res.status(201).json({ message: "Token refreshed" });
  } catch (error) {
    console.error(error.message);
    return res.status(500);
  }
});
