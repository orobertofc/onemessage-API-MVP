import jwt from "jsonwebtoken";
import checkUserValid from "../../../helpers/database/SQL/checkUser";
import startConversation from "./new_conversation";

/**
 * Creates a new conversation between a sender and a receiver.
 *
 * @param {string} senderAccessToken - The sender's access token.
 * @param {string} receiverID - The ID of the receiver.
 * @param {string} message - The initial message of the conversation.
 *
 * @returns {void}
 *
 * @throws {Error} If there is an error creating the conversation.
 */
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