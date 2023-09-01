const { Router } = require("express")


const messageRouter = Router()

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