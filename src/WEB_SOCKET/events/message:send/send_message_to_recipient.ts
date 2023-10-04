import { socketFromRedis } from "../../../redis/functions.js";

export async function send_message_to_recipient(
  socket: any,
  sender: string,
  recipient: string,
  message: string,
): Promise<void> {
  try {
    socketFromRedis(recipient).then((socketId) => {
      socket.to(socketId).emit("message:receive", { message, sender });
    });
  } catch (error) {}
}
