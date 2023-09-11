import { Server } from 'socket.io';
import User from './User_Class.js';
import middleware from './middleware.js';



function socketEvents(server: object) {
  const io: Server = new Server(server);

  io.use(middleware);

  const userConnected: string[] = [];

  io.on('connection', (client) => {
    console.log(`Socket ${client.id} connected`);
    userConnected.push(client.id);

    console.log(userConnected);

    // @ts-ignore
    const user = new User(client.handshake.token);

    client.on('start-conversation', async (data) => {
      await user.startConversation(data.msg, data.destination);
    });
  });
}


export default socketEvents;