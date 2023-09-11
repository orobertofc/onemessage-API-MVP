import { Router } from "express";
import refreshTokenRouter from "./refresh.js";

const tokenRouter = Router();

tokenRouter.use(refreshTokenRouter);

export default tokenRouter;