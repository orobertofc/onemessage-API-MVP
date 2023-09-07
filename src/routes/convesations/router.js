const {Router} = require("express");

const messageRouter = Router();

messageRouter.use(require("./middleware.js"));
messageRouter.use(require("./new/main.js"));

module.exports = messageRouter;