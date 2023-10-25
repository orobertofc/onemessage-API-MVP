import { Router } from "express";
import { loginRouter } from "./login/main.js";
import { newUserRouter } from "./new/main.js";
import { userMiddleware } from "./middleware.js";

export const userRouter = Router();

// Middleware - keep it on top always
userRouter.use(userMiddleware);

// Routes
userRouter.use(newUserRouter);
userRouter.use(loginRouter);
