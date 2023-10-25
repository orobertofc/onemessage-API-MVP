import { accessToken } from "../interfaces/token_object.js";
import jwt from "jsonwebtoken";
import { Socket } from "socket.io";
import { Mongo_controller } from "../databases/mongoDB/Mongo_controller.js";
import "dotenv/config";

/**
 * Middleware function that verifies and extracts user information from a token attached to the socket handshake.
 *
 * @param {any} socket - The socket object representing the client connection.
 * @param {function} next - The next function to call in the middleware chain.
 * @returns {void}
 * @throws {Error} - An error is thrown if the token is not provided, invalid, or if there is an error during verification.
 */
// @ts-ignore
export default function (socket: any, next: function): void {
  const token: string = socket.handshake.headers.token;
export function middleware(socket: Socket, next: Function): void {
  const token = <string>socket.handshake.headers.token;

  if (token === undefined) {
    return next(new Error("Token not provided"));
  }
  try {
    const tokenInfo = <accessToken>(
      jwt.verify(token, process.env.JWT_ACCESS_SECRET)
    );
    checkAccessToken(token).then((r) => {
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
