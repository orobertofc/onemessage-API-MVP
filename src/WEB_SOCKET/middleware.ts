import checkAccessToken from "../REST/helpers/database/mongoDB/check_token.js";
import jwt from "jsonwebtoken";
import { accessToken } from "../interfaces/token_object.js";

/**
 * Verifies the token provided in the socket handshake and disconnects the socket if the token is invalid or not provided.
 *
 * @param {object} socket - The socket object received from the socket.io library.
 * @param {function} next - The callback function to be called after the token verification.
 * @returns {void} - This method does not return a value.
 */
// @ts-ignore
export default function (socket, next: function): void {
  const token: string = socket.handshake.headers.token;

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
    console.log(error);
    return next(new Error("An error occurred while verifying the token."));
  }
}
