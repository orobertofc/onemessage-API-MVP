const {Router} = require("express");

const userRouter = Router();

// middleware, keep it on top always
userRouter.use(require("./middleware.js"));

// routes
userRouter.use(require("./new/main.js"));
userRouter.use(require("./login/main.js"));

module.exports = userRouter;