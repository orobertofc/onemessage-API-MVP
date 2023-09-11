import { Router } from "express";
import middleware from "./middleware.js";
import loginRouter from "./login/main.js";
import newUserRouter from "./new/main.js";

const userRouter = Router();

// Middleware - keep it on top always
userRouter.use(middleware);

// Routes
userRouter.use(newUserRouter);
userRouter.use(loginRouter);

export default userRouter;
