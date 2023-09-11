import checkAccessToken from "../REST/helpers/database/mongoDB/check_token.js";
import jwt from "jsonwebtoken";

/**
 * Verifies the token provided in the socket handshake and disconnects the socket if the token is invalid or not provided.
 *
 * @param {object} socket - The socket object received from the socket.io library.
 * @param {function} next - The callback function to be called after the token verification.
 * @returns {void} - This method does not return a value.
 */
// @ts-ignore
export default function (socket, next: function): void {
  const token: string = socket.handshake.token;

  if (!token) {
    next(new Error("Token not provided"));
  }
  try {

    jwt.verify(token, process.env.JWT_ACCESS_SECRET);
    checkAccessToken(token).then(r => {
      if (r === false) {
        next(new Error("Invalid token"));
      }
      next();
    });

  } catch (error) {
    next(new Error("An error occurred while verifying the token."))
    }
};


