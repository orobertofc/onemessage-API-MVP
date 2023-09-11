import { Router } from "express";

const userRouter = Router();

// @ts-ignore
userRouter.use(async function(req, res, next) {
    const { userName, password } = req.body;

    if (!userName) {
      return res.status(400).json({ "error": "Missing username" });
    }

    if (!password) {
      return res.status(400).json({ "error": "Missing password" });
    }

    if (userName.length < 3) {
      return res.status(400).json({ "error": "userName must be at least 3 characters long" });
    }

    if (userName.length > 20) {
      return res.status(400).json({ "error": "useName must be less than 20 characters long" });
    }

    if (password.length < 8) {
      return res.status(400).json({ "error": "password must be at least 8 characters long" });
    }

    if (password.length > 25) {
      return res.status(400).json({ "error": "password must be less than 25 characters long" });
    }

    next();
});

export default userRouter;