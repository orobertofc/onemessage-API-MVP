import { Router } from "express";
import hash512 from "../../../helpers/hash512.js";
import loginUser from "../../../controllers/users/login/main.js";
import {
  authCookieOptions,
  refreshCookieOptions,
} from "../../COOKIE_SETTINGS/cookie_settings.js";

const loginRouter = Router();

loginRouter.post("/login", async function (req, res) {
  try {
    const { userName, password } = req.body;
    const hashedPassword = await hash512(password);

    const [accessToken, refreshToken, id] = await loginUser(
      userName,
      hashedPassword,
    );

    res.cookie("accessToken", accessToken, authCookieOptions);
    res.cookie("refreshToken", refreshToken, refreshCookieOptions);
    return res.status(200).json({ userID: id });
  } catch (error) {
    console.error(error.message);

    if (error.message === "Invalid password") {
      return res.status(401).json({ error: error.message });
    }

    return res.status(500).json({ error: error.message });
  }
});

export default loginRouter;
