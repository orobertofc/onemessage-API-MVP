import { Socket } from "socket.io";

export const performAction = async (
  socket: Socket,
  action: Function,
  successEvent: string,
  errorEvent: string,
): Promise<void> => {
  action()
    .then(() => {
      socket.emit(successEvent);
    })
    .catch((error: Error) => {
      console.log(error.stack);
      socket.emit(errorEvent, error.message);
    });
};
