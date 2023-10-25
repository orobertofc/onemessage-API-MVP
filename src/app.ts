import express, { Express } from "express";
import cookieParser from "cookie-parser";
import logger from "morgan";
import cors from "cors";
import { tokenRouter } from "./REST/routes/token/router.js";
import { userRouter } from "./REST/routes/user/router.js";
import { keepAliveRouter } from "./REST/routes/keep_alive/keep_alive.js";
import swaggerUi from "swagger-ui-express";

const app = express();

// CORS stuff
const corsOptions = {
  origin: true,
  credentials: true,
};
app.use(cors(corsOptions));

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use("/keep_alive", keepAliveRouter);
app.use("/token", tokenRouter);
app.use("/user", userRouter);

// 404 handler
app.use(function (req, res, next) {
  res.status(404).send("URL does not exist");
});

// Error handler, keep as the last app.use and below the 404 handler
// @ts-ignore
app.use(function (err, req, res, next) {
  res.status(500).send("Something went wrong");
});

export default app;
