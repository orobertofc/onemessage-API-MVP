const {Router} = require("express");

const messageRouter = Router();

messageRouter.use(require("./new/main.js"));

module.exports = messageRouter;