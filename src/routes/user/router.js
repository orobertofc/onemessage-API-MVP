const {Router} = require("express");

const userRouter = Router();

userRouter.use(require("./new/main.js"));
userRouter.use(require("./login/main.js"));

module.exports = userRouter;