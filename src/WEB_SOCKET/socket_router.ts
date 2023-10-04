import { Server } from "socket.io";
import createMessage from "./events/message:send/main.js";
import middleware from "./middleware.js";
import fetchMessages from "./events/messages:fetch/main.js";
import { socketToRedis } from "../redis/functions.js";
import { performAction } from "./events/action.js";

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
    ).then((r) => socket.disconnect());

    socket.on("message:send", ({ to, message }) => {
      try {
        createMessage(socket.data.userID, to, message).then((r) => {
          socket.emit("message:sent");
        });
      } catch (error) {
        console.log(error.message);
        socket.emit("message:error", error);
      }
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

    // Error handler
    socket.on("connect_error", (err) => {
      console.log("Socket.io error: " + err.message);
      delete_socket(socket.data.userID);
    });

    // Listen for disconnect
    socket.on("disconnect", () => {
      console.log(`User ${socket.id} disconnected`);
    });
  });
}

export default socketEvents;
