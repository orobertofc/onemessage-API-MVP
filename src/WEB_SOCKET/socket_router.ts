import { performAction } from "./action.js";
import { middleware } from "./middleware.js";
import { Server, Socket } from "socket.io";
import { RedisController } from "../databases/redis/Redis_controller.js";
import { Prisma_ws_controller } from "./Prisma_ws_controller.js";
import http from "http";

export function socketEvents(httpServer: http.Server) {
  const io: Server = new Server(httpServer, { cors: { origin: "*" } });
  io.use(middleware);

  io.on("connection", (socket: Socket) => {
    console.log(`User ${socket.id} connected`);
    const redis = new RedisController(socket.id, socket.data.userID);
    const socketController = new Prisma_ws_controller(socket, redis);

    performAction(
      socket,
      () => redis.setSocket(),
      "connection:success",
      "connection:error",
    ).catch(() => socket.disconnect());

    socket.on("message:send", ({ to, message }) => {
      if (to === undefined || message === undefined) {
        socket.emit("message:error", "Invalid message or recipient");
        return;
      }
      performAction(
        socket,
        () => socketController.message_send(message, to),
        "message:sent",
        "message:error",
      );
    });

    socket.on("message:fetch", () => {
      socketController
        .message_fetch()
        .then((serializedJson) => {
          socket.emit("message:fetch:success", serializedJson);
        })
        .catch((error) => {
          console.error(error);
          socket.emit(
            "message:fetch:error",
            "An error occurred during message fetch.",
          );
        });
    });

    socket.on("connect_error", (err) => {
      console.log("Socket.io error: " + err.message);
      redis.deleteSocket().then((r) => {});
    });

    socket.on("disconnect", () => {
      console.log(`User ${socket.id} disconnected`);
      redis.deleteSocket().then((r) => {});
    });
  });
}
