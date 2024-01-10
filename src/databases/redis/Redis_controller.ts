import { connectRedis } from "./connectRedis.js";

/**
 * Class representing a RedisController.
 */
export class RedisController {
  private readonly socketID: string;
  private readonly userId: string;

  constructor(socketID: string, userId: string) {
    this.socketID = socketID;
    this.userId = userId;
  }

  /**
   * Sets the socket for the client.
   *
   * @returns {Promise<void>} A promise that resolves when the socket is successfully set.
   * @throws {Error} If there is an error setting the socket.
   */
  public async setSocket(): Promise<void> {
    try {
      console.log("Setting socket", this.userId, this.socketID);
      await connectRedis.set(this.userId, this.socketID);
      console.log("Socket set");
    } catch (error) {
      throw new Error(error.message);
    }
  }

  /**
   * Deletes the socket associated with the user.
   *
   * @returns {Promise<void>} A Promise that resolves when the socket is successfully deleted.
   * @throws {Error} If there is an error in deleting the socket.
   */
  public async deleteSocket(): Promise<void> {
    try {
      // @ts-ignore User id info was appended by the middleware
      await connectRedis.del(this.userId);
    } catch (error) {
      throw new Error(error.message);
    }
  }

  /**
   * Retrieves the socket object by ID.
   *
   * @param {string} id - The ID of the socket to retrieve.
   * @returns {Promise<string>} A promise that resolves to the socket object associated with the given ID.
   * @throws {Error} If an error occurs while retrieving the socket object.
   */
  public async getSocketByID(id: string): Promise<string> {
    try {
      console.log("Getting socket", id);
      const result: string = await connectRedis.get(id);
      console.log("Result", result);
      return result;
    } catch (error) {
      throw new Error(error.message);
    }
  }
}
