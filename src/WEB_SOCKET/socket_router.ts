import { Server } from "socket.io";
import createMessage from "./events/message:send/main.js";
import middleware from "./middleware.js";
import fetchMessages from "./events/messages:fetch/main.js";
import { deleteSocketFromRedis, socketToRedis } from "../redis/functions.js";
import { performAction } from "./events/action.js";
import { send_message_to_recipient } from "./events/message:send/send_message_to_recipient.js";

function socketEvents(server: object) {
  const io: Server = new Server(server, { cors: { origin: "*" } });
  io.use(middleware);

  io.on("connection", (socket) => {
    console.log(`User ${socket.id} connected`);
    performAction(
      socket,
      () => socketToRedis(socket.data.userID, socket.id),
      "connection:success",
      "connection:error",
    ).catch(() => socket.disconnect());

    socket.on("message:send", ({ to, message }) => {
      send_message_to_recipient(socket, socket.data.userID, to, message);
      performAction(
        socket,
        () => createMessage(socket.data.userID, to, message),
        "message:sent",
        "message:error",
      );
    });

    socket.on("message:fetch", () => {
      fetchMessages(socket.data.userID)
        .then((serializedJson) => {
          socket.emit("message:fetch:success", serializedJson);
        })
        .catch((error) => {
          console.error(error);
          socket.emit(
            "message:fetch:error",
            error.message || "An error occurred during message fetch.",
          );
        });
    });

    socket.on("connect_error", (err) => {
      console.log("Socket.io error: " + err.message);
      deleteSocketFromRedis(socket.data.userID);
    });

    socket.on("disconnect", () => {
      console.log(`User ${socket.id} disconnected`);
      deleteSocketFromRedis(socket.data.userID);
    });
  });
}

export default socketEvents;
