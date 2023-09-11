import { Server } from 'socket.io';
import middleware from './middleware.js';

function socketEvents(server: object) {
  const io: Server = new Server(server);

  io.use(middleware);


  io.on("connection", (socket) => {
    console.log(`user ${socket.id} connected`)

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