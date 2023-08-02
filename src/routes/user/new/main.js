const express = require('express');
const main = require("../../../controllers/users/new/main.js");

const userRouter = express.Router();

userRouter.post('/new', async function(req, res, next) {
  const user_name = req.body.user_name; // Access the user_name from the parsed JSON body

  if (!user_name) {
    res.status(400).json({ "error": "Missing user_name in the request body" });
    return;
  }

  let IDs = await main(user_name);

  if (Array.isArray(IDs)) {
    res.status(200).json({ "private_id": IDs[0], "public_id": IDs[1] });
  } else {
    res.status(500).json({ "error": IDs });
  }

});

module.exports = userRouter;
