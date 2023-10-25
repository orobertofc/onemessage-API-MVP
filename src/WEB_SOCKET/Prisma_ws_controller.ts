import { connectPrisma } from "../databases/prisma/connectPrisma.js";
import { Conversation } from "@prisma/client";
import { RedisController } from "../databases/redis/Redis_controller.js";
import { Socket } from "socket.io";

/**
 * Controls every read/write operation for the socket-related events.
 * For REST database controllers, check the Prisma_rest_controller
 */

export class Prisma_ws_controller {
  // Keeping some instances to avoid creating new ones every time. I know it may use more memory, but it's a tradeoff
  // Some of these are used a lot and are related to database operations (reduces overhead with connection pooling)
  private readonly socket: Socket;
  private readonly userID: string;
  private conversation: Conversation;
  private redis: RedisController;

  constructor(socket: any, redis: RedisController) {
    this.socket = socket;
    this.userID = socket.data.userID;
    this.redis = redis;
  }

  public async message_send(message: string, recipient: string): Promise<void> {
    const isExistingConversation = (id1: string, id2: string) =>
      (this.conversation?.user1Id === id1 &&
        this.conversation?.user2Id === id2) ||
      (this.conversation?.user1Id === id2 &&
        this.conversation?.user2Id === id1);

    if (!isExistingConversation(this.userID, recipient)) {
      let conversation;
      conversation = await this.getExistingConversation(recipient);

      if (!conversation) {
        conversation = await this.createConversation(recipient);
      }
      this.conversation = conversation;
    }

    this.redirectMessage(message, recipient).then(() => {
      console.log("Message sent to recipient");
    });
    await this.createMessage(message);
  }

  public async message_fetch(): Promise<object> {
    try {
      const user = await connectPrisma.user.findUnique({
        where: {
          id: this.socket.data.userID,
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

      console.log("Message fetch");
      // Return the user data as an object(no need to serialize it, js does the shenanigans for us)
      return {
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
      };
    } catch (error) {
      console.log(error);
      throw new Error(error.message);
    }
  }

  private async createMessage(message: string): Promise<void> {
    try {
      await connectPrisma.message.create({
        data: {
          senderId: this.userID,
          conversationId: this.conversation.conversationId,
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

  private async createConversation(recipient: string): Promise<Conversation> {
    try {
      console.log("New conversation");
      return connectPrisma.conversation.create({
        data: {
          user1Id: this.userID,
          user2Id: recipient,
          lastMessageAt: new Date(),
        },
      });
    } catch (error) {
      console.log(error);
      throw new Error(error.message);
    }
  }

  private async redirectMessage(
    message: string,
    recipient: string,
  ): Promise<void> {
    try {
      const socketID = await this.redis.getSocketByID(recipient);
      console.log(socketID);

      if (socketID == undefined) {
        console.log("User is offline");
      }

      // @ts-ignore
      this.socket.to(socketID).emit("message:receive", {
        message,
        sender: this.userID,
      });

      console.log("Message redirected");
    } catch (error) {
      console.log(error);
      throw new Error(error.message);
    }
  }
  private async getExistingConversation(
    recipient: string,
  ): Promise<Conversation> {
    return connectPrisma.conversation.findFirst({
      where: {
        OR: [
          {
            user1Id: this.userID,
            user2Id: recipient,
          },
          {
            user1Id: recipient,
            user2Id: this.userID,
          },
        ],
      },
    });
  }
}
