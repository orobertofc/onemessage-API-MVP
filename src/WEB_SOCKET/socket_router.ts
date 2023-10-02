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
    });

    socket.on("message:fetch", () => {
      const userID: string = socket.data.userID;

      fetchMessages(userID)
        .then((serializedJson) => {
          // Emit the serialized JSON data to the socket
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
      console.log(err instanceof Error);
      console.log(err.message);
      console.log(err.data);
    });

    // Listen for disconnect
    socket.on("disconnect", () => {
      console.log(`User ${socket.id} disconnected`);
    });
  });
}

export default socketEvents;
