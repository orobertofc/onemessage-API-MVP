import { accessToken } from "../interfaces/token_object.js";
import jwt from "jsonwebtoken";
import { Socket } from "socket.io";
import { Mongo_controller } from "../databases/mongoDB/Mongo_controller.js";
import "dotenv/config";

export function middleware(socket: Socket, next: Function): void {
  const token = <string>socket.handshake.headers.token;

  if (token === undefined) {
    return next(new Error("Token not provided"));
  }
  try {
    const tokenInfo = <accessToken>(
      jwt.verify(token, process.env.JWT_ACCESS_SECRET)
    );
    const mongo = new Mongo_controller();
    mongo.checkAccessToken(token).then((r) => {
      if (r === false) {
        next(new Error("Invalid token"));
      }

      socket.data.userName = tokenInfo.userName;
      socket.data.userID = tokenInfo.id;
      return next();
    });
  } catch (error) {
    console.log("Middleware error: " + error.message);
    return next(error);
  }
}
