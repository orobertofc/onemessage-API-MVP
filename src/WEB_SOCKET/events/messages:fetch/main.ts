import prismaClient from "../../../prisma/prismaClient.js";

async function fetchMessages(userID: string): Promise<object> {
  console.log("fetch_messages event received");
  let userData;
  try {
    const user = await prismaClient.user.findUnique({
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

    // Return the user data as an object(no need to serialize it, js does the shenanigans for us)
    return (userData = {
      userName: user.name,
      id: user.id,
      conversations: [...user.conversations1, ...user.conversations2].map(
        (conversation) => {
          // Fuck prismaORM. Why don't you export the types like you do with everyone else's projects? Now i gotta :any this shit
          const messages = conversation.messages.map((message: any) => ({
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
    });
  } catch (error) {
    console.log(error);
    throw new Error(error.message);
  }
}

export default fetchMessages;
