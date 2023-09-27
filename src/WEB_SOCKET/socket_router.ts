import { Server } from "socket.io";
import createMessage from "./events/message:send/main.js";
import middleware from "./middleware.js";
import fetchMessages from "./events/messages:fetch/main.js";

function socketEvents(server: object) {
  const io: Server = new Server(server, { cors: { origin: "*" } });

  io.use(middleware);

  io.on("connection", (socket) => {
    console.log(`user ${socket.id} connected`);
    socket.emit("hello");

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
