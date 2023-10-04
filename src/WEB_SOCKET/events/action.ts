export const performAction = async (
  socket: any,
  action: Function,
  successEvent: string,
  errorEvent: string,
) => {
  try {
    await action();
    socket.emit(successEvent);
  } catch (error) {
    console.log(error.message);
    socket.emit(errorEvent, error.message);
  }
};