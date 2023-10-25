import { Request, Response, Router } from "express";
import {
  authCookieOptions,
  refreshCookieOptions,
} from "../../COOKIE_SETTINGS/cookie_settings.js";
import { User_controller } from "../../../controllers/User_controller.js";

export const newUserRouter = Router();

newUserRouter.post(
  "/new",
  async (req: Request, res: Response): Promise<Response> => {
    try {
      const { userName, password }: { userName: string; password: string } =
        req.body;

      const user: User_controller = new User_controller(userName, password);
      const [accessToken, refreshToken, id] = await user.new();

    res.cookie("accessToken", accessToken, authCookieOptions);
    res.cookie("refreshToken", refreshToken, refreshCookieOptions);
    return res.status(200).json({ userID: id });
  } catch (error) {
    console.error(error.message);
    console.error(error.stack);

    if (
      error.message ===
      "Username already taken. Please choose a different username."
    ) {
      return res.status(409).json({ error: error.message });
    }

    return res.status(500).json({ error: error.message });
  }
});

export default newUserRouter;
