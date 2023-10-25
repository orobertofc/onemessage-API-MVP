import { connectPrisma } from "../../databases/prisma/connectPrisma.js";
import { userObject } from "../../interfaces/user_object.js";
import { User } from "@prisma/client";

export class Prisma_rest_controller {
  public static async isUserValid(id: string): Promise<boolean> {
    try {
      const user: User = await connectPrisma.user.findUnique({
        where: {
          id: id,
        },
      });

      return user !== null;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  /**
   * Retrieves a user object based on the provided username.
   * @returns {Promise<User>} A Promise that resolves to the user object.
   * @throws {Error} If the user object is not found.
   */
  public static async getByName(username: string): Promise<User> {
    try {
      return await connectPrisma.user.findUnique({
        where: {
          name: username,
        },
      });
    } catch (error) {
      throw new Error("User not found");
    }
  }

  /**
   * Saves user data to the database using Prisma's `user.create` method.
   *
   * @returns {Promise<void>}
   * @throws {Error} Thrown if user data cannot be saved to the database.
   */
  public static async saveToDB(userObject: userObject): Promise<void> {
    try {
      await connectPrisma.user.create({
        data: {
          name: userObject.name,
          id: userObject.id,
          password: userObject.password,
          lastSeen: new Date(),
        },
      });
    } catch (error) {
      if (error.message.includes("Unique constraint failed on the fields")) {
        throw new Error(
          "Username already taken. Please choose a different username.",
        );
      } else {
        throw new Error(`Error saving user to database`);
      }
    }
  }
}
