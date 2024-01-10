import { Router } from "express";
import { refreshTokenRouter } from "./refresh.js";

export const tokenRouter = Router();

tokenRouter.use(refreshTokenRouter);
