import {Message, PrismaClient} from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Function to start a new conversation by sending a message to the receiver
 *
 * @param {number} senderId - user ID of the sender
 * @param {number} receiverId - user ID of the receiver
 * @param {string} messageContent - content of the initial message
 * @returns {Promise<Message>} The newly created message
 */
async function startConversation(senderId: string, receiverId: string, messageContent: string): Promise<Message> {
  try {
    // begin transaction
    const result = await prisma.$transaction([
      // create a new conversation
      prisma.conversation.create({
        data: {
          user1Id: senderId,
          user2Id: receiverId,
          lastMessageAt: new Date(),
        },
      }),
      // then, send an initial message
      prisma.message.create({
        data: {
          senderId: senderId,
          conversationId: null, // to be filled in with the conversation ID
          content: messageContent,
          timestamp: new Date(),
          isRead: false,
        },
      }),
    ]);

    // link the new message to the new conversation
    return await prisma.message.update({
      where: {messageId: result[1].messageId},
      data: {conversationId: result[0].conversationId},
    });

  } catch (error) {
    console.error(error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

module.exports = startConversation;