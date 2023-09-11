import prisma from '@prisma/client';
import {userObject} from "../../../../types/user_object.js";

/**
 * Retrieves a user object from the database based on the given username.
 *
 * @param {string} userName - The username of the user to retrieve from the database.
 * @return {Promise<object>} - A promise that resolves with the user object if found, otherwise rejects with an error.
 * @throws {Error} - User not found error if the user object is not found in the database.
 */
async function userFromDb(userName: string): Promise<userObject>{
  let client: prisma.PrismaClient
  try {
    client = new prisma.PrismaClient()

    return await client.user.findUnique({
      where: {
        name: userName
      }
    })

  } catch (error) {
    throw new Error("User not found")
  }
  finally {
    await client.$disconnect()
  }
}

export default userFromDb;