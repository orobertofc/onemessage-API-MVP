import { Server } from 'socket.io';
import User from './User_Class.js';
import middleware from './middleware.js';



function socketEvents(server: object) {
  const io: Server = new Server(server);

  io.use(middleware);


  io.on("connection", (socket) => {
    console.log(`user ${socket.id} connected`)

    // Listen for disconnect
    socket.on("disconnect", () => {
      console.log(`User ${socket.id} disconnected`);
    });
  });
}


export default socketEvents;