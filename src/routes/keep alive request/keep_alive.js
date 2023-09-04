const { Router } = require('express');

const keepAliveRouter = Router();

keepAliveRouter.get('/keep_alive', async function(req, res) {
  try {
    res.status(200).json({message: "Server is alive"});
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ "error": error.message });
  }
});