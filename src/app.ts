import express from "express";
import cookieParser from "cookie-parser";
import logger from "morgan";
import cors from "cors";
import tokenRouter from "./REST/routes/token/router.js";
import userRouter from "./REST/routes/user/router.js";
import keepAliveRouter from "./REST/routes/keep alive/keep_alive.js";

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

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  const err = new Error("Not Found");
  // @ts-ignore
  err.status = 404;
  next(err);
});

// error handler
// @ts-ignore
app.use(function (err, req, res, next) {
  console.error(err.stack); // print stack trace to console

  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("ENV") === "dev" ? err : {};

  res.status(404);
});

export default app;
