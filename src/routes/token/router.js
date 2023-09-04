const {Router} = require("express");

const tokenRouter = Router();

tokenRouter.use(require("./refresh"));

module.exports = tokenRouter;