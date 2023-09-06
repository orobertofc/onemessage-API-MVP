const { Router } = require('express');

const keepAliveRouter = Router();

/**
 * This router is a simple GET endpoint at '/keep_alive' to check whether the server is alive or not.
 * It is common to use it for health check purposes.
 *
 * @async
 * @route GET /
 * @group keepAlive - Operations for the 'keepAlive' route
 * @returns {object} 200 - An object with a message that server is alive.
 * @returns {object} 500 - An object with an 'error' field containing the error message in case of a server error.
 */
keepAliveRouter.get('/', async function(req, res) {
  try {
    res.status(200).json({message: "Server is alive"});
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ "error": error.message });
  }
});

module.exports =  keepAliveRouter;