import { Server } from "socket.io";

function socketEvents(server: object) {
  const io: Server = new Server(server, { cors: { origin: "*" } });

  // io.use(middleware);

  io.on("connection", (socket) => {
    console.log(`user ${socket.id} connected`);
    socket.emit("hello");

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
