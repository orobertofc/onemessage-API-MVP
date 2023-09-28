import prismaClient from "../../../prisma/prismaClient.js";

/**
 * Checks if a user with the given ID exists in the database.
 *
 * @param {string} id - The ID of the user to check.
 * @throws {Error} If the user does not exist or an error occurs during the process.
 * @returns {Promise<boolean>} Returns true if the user exists, otherwise throws an error.
 */
async function checkUserExists(id: string): Promise<boolean> {
  try {
    const user = await prismaClient.user.findUnique({
      where: {
        id,
      },
    });

    if (user === null) {
      throw new Error("User does not exist");
    } else {
      return true;
    }
  } catch (error) {
    throw new Error(error.message);
  }
}

export default checkUserExists;
