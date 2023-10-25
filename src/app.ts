import express, { Express } from "express";
import cookieParser from "cookie-parser";
import logger from "morgan";
import cors from "cors";
import { tokenRouter } from "./REST/routes/token/router.js";
import { userRouter } from "./REST/routes/user/router.js";
import { keepAliveRouter } from "./REST/routes/keep_alive/keep_alive.js";
import swaggerUi from "swagger-ui-express";

const app: Express = express();

// CORS settings for the REST api
// TODO: change to more restrictive settings before pushing to prod
const corsOptions = {
  origin: true,
  credentials: true,
};
app.use(cors(corsOptions));

// Utility middlewares
app.use(logger("combined"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// REST routers
app.use("/keep_alive", keepAliveRouter);
app.use("/tokens", tokenRouter);
app.use("/users", userRouter);

// Swagger UI
app.use(
  "/docs",
  swaggerUi.serve,
  swaggerUi.setup(null, {
    swaggerUrl: "../swagger.yaml",
    swaggerOptions: {
      validatorUrl: null,
    },
  }),
);

// 404 handler, keep this and the one below it always at the bottom
app.use(function (req, res, next) {
  res.status(404).send("URL does not exist");
});

// Error handler, keep as the last app.use and below the 404 handler
// @ts-ignore
app.use(function (err, req, res, next) {
  res.status(500).send("Something went wrong");
});

export default app;
