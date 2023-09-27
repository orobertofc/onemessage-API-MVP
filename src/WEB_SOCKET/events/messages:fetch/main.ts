import pg from "pg";
import { PrismaClient } from "@prisma/client";

const pool = new pg.Pool({
  connectionString: process.env.POSTGRES_URL,
  ssl: process.env.POSTGRES_SSL === "true" || true,
});

async function fetchMessages(userID: string): Promise<object> {
  console.log("fetch_messages event received");
  let prisma: PrismaClient;
  try {
    prisma = new PrismaClient();

    const user = await prisma.user.findUnique({
      where: {
        id: userID,
      },
      include: {
        conversations1: {
          include: {
            messages: true,
          },
        },
        conversations2: {
          include: {
            messages: true,
          },
        },
      },
    });

    if (!user) {
      throw new Error("User not found");
    }

    // Prepare the data to be sent to the socket
    const userData = {
      userName: user.name,
      id: user.id,
      conversations: [...user.conversations1, ...user.conversations2].map(
        (conversation) => {
          // Extract message data from the conversation
          const messages = conversation.messages.map((message) => ({
            messageId: message.messageId,
            content: message.content,
            timestamp: message.timestamp,
            isRead: message.isRead,
          }));

          // Create a new conversation object with the extracted messages
          return {
            conversationId: conversation.conversationId,
            user1Id: conversation.user1Id,
            user2Id: conversation.user2Id,
            lastMessageAt: conversation.lastMessageAt,
            messages: messages,
          };
        },
      ),
    };

    console.log(userData);

    // Return the data as JSON
    return userData;
  } catch (error) {
    console.log(error);
    throw new Error(error.message);
  } finally {
    if (prisma) {
      await prisma.$disconnect();
    }
  }
}

export default fetchMessages;
