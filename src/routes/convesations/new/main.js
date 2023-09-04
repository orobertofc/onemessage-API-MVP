const { Router } = require("express")
const newConversation = require("../../../controllers/conversations/new/main.js")

const messageRouter = Router()

/**
 * This endpoint allows a user to create a new conversation.
 * The user must provide the receiver's ID, a message, and a valid access token stored in cookies.
 * The function checks if all required parameters are provided and if they meet certain constraints such as message length.
 * If the message is too long or empty, the function will return an error.
 * If everything is fine, the function will try to create a new conversation and send the message.
 * If there's any error during this process, it will output the error message.
 * If the process is successful, it will return a successful response.
 *
 * @route {POST} /conversation/new
 * @async
 * @function
 * @param {Object} req - Express request object. Requires accessToken in cookies, receiverID, and message in body.
 * @param {Object} res - Express response object.
 * @throws Will throw an error if any problem happens during conversation creation or if parameters provided are incorrect.
 * @returns {Object} - Response object. If successful, will contain status(200) and a successful message. If failed, will contain status(400/500) and an error message.
 */

messageRouter.post('/conversation/new', async function(req, res) {
  try {
    const senderAccessToken = req.cookies.accessToken;
    const { receiverID, message } = req.body;

    if (senderAccessToken || !message || !receiverID) return res.status(400).json({error: "Missing parameters"});
    if (message.length > 1000) return res.status(400).json({error: "Message cannot be longer than 1000 characters"});
    if (message.length < 1) return res.status(400).json({error: "Message cannot be empty"});

    const conversation = await newConversation(senderAccessToken, receiverID, message);

  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ "error": error.message });

  } finally {
    res.status(200).json({message: "Message sent"});
  }
})