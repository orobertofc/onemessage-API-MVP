import prismaClient from "../../../prisma/prismaClient.js";

async function createMessage(
  sender: string,
  recipient: string,
  message: string,
): Promise<void> {
  try {
    const conversation = await prismaClient.conversation.findFirst({
      where: {
        OR: [
          {
            user1Id: sender,
            user2Id: recipient,
          },
          {
            user1Id: recipient,
            user2Id: sender,
          },
        ],
      },
    });
    let conversationID: number = conversation?.conversationId;

    if (!conversationID) {
      conversationID = await createConversation(sender, recipient);
    }

    await prismaClient.message.create({
      data: {
        senderId: sender,
        conversationId: conversationID,
        content: message,
        timestamp: new Date(),
      },
    });

    console.log("New message");
  } catch (error) {
    console.log(error);
    throw new Error(error.message);
  }
}

async function createConversation(
  user1Id: string,
  user2Id: string,
): Promise<number> {
  try {
    const conversation = await prismaClient.conversation.create({
      data: {
        user1Id,
        user2Id,
        lastMessageAt: new Date(),
      },
    });
    console.log("New conversation");
    return conversation.conversationId;
  } catch (error) {
    console.log(error);
    throw new Error(error.message);
  }
}

export default createMessage;
