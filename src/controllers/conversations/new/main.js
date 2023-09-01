import jwt from "jsonwebtoken";
import checkUserValid from "../../../helpers/database/SQL/checkUser";
import startConversation from "./new_conversation";

app.use()

async function newConversation(senderAccessToken, receiverID, message) {
  try {
    const senderExtracted = jwt.verify(senderAccessToken, process.env.JWT_ACCESS_SECRET);

    const [senderValid, receiverValid] = await Promise.all([
      checkUserValid(senderExtracted.privateId, "private"),
      checkUserValid(receiverID, "public")
    ]);

    if (senderValid === true && receiverValid === true) {
      // Create conversation
      await startConversation(senderExtracted.privateId, receiverID, message);
    }

  } catch (error) {
    throw new Error(error.message);
  }
}