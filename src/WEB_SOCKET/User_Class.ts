import { PrismaClient } from "@prisma/client";
import { decode } from "jsonwebtoken";
import { accessToken } from "../interfaces/token_object.js";

const prisma = new PrismaClient();

interface User {
  userName: string;
  id: string;
}

class User {
  constructor(accessToken: accessToken) {
    // @ts-ignore
    // prettier-ignore
    const token = <accessToken> decode(accessToken, process.env.JWT_ACCESS_SECRET);

    this.userName = token.userName;
    this.id = token.id;
  }

  async startConversation(msg: string, destination: string) {
    try {
      // begin transaction
      const result = await prisma.$transaction([
        // create a new conversation
        prisma.conversation.create({
          data: {
            user1Id: this.id,
            user2Id: destination,
            lastMessageAt: new Date(),
          },
        }),
        // then, send an initial message
        prisma.message.create({
          data: {
            senderId: this.id,
            conversationId: null, // to be filled in with the conversation ID
            content: msg,
            timestamp: new Date(),
            isRead: false,
          },
        }),
      ]);

      // link the new message to the new conversation
      await prisma.message.update({
        where: { messageId: result[1].messageId },
        data: { conversationId: result[0].conversationId },
      });
    } catch (error) {
      console.error(error);
      throw error;
    } finally {
      await prisma.$disconnect();
    }
  }
}

export default User;
