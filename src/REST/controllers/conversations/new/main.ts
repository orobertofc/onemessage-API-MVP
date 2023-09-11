import jwt from "jsonwebtoken";
import checkUserValid from "../../../helpers/database/SQL/checkUser.js";
import startConversation from "./new_conversation.js";
import {accessToken} from "../../../../interfaces/token_object.js";

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
async function newConversation(senderAccessToken: string, receiverID: string, message: string): Promise<void> {
  try {
    const senderExtracted = jwt.verify(senderAccessToken, process.env.JWT_ACCESS_SECRET) as accessToken;

    const sender = {
      userName: senderExtracted.userName,
      id: senderExtracted.id
    }

    const [senderValid, receiverValid] = await Promise.all([
      checkUserValid(sender.id),
      checkUserValid(receiverID)
    ]);

    if (senderValid === true && receiverValid === true) {
      // Create conversation
      await startConversation(sender.id, receiverID, message);
    }

  } catch (error) {
    throw new Error(error.message);
  }
}

module.exports = newConversation;