import { userObject } from "../../../interfaces/user_object.js";
import prismaClient from "../../../prisma/prismaClient.js";

/**
 * Retrieves a user from the database based on their ID.
 *
 * @param {string} id - The ID of the user to retrieve.
 * @return {Promise<Object>} - The user object if found.
 * @throws {Error} - If the user does not exist or an error occurs during the retrieval process.
 */
async function getUserById(id: string): Promise<userObject> {
  try {
    const user = await prismaClient.user.findUnique({
      where: {
        id,
      },
    });

    if (user === null) {
      throw new Error("User does not exist");
    } else {
      return user;
    }
  } catch (error) {
    throw new Error(error.message);
  }
}

export default getUserById;
