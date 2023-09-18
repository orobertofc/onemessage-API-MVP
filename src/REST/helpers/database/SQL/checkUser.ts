import { PrismaClient } from "@prisma/client";

/**
 * This async function checks the validity of a user based on the given ID by fetching the user from a Prisma database.
 *
 * @async
 * @function
 * @param {string} ID - The unique identifier of the user.
 * @returns {Promise<boolean>} A promise that resolves with true if the user exists. Otherwise rejects with an Error "User does not exist".
 *
 * @throws {Error} If it encounters any errors while executing the function, will throw an Error with the original error message.
 * Afterwards, it ensures the Prisma Client disconnects from the database once operation is complete.
 * Ensure to handle the possible exceptions while using this function, as it doesn't perform any error handling of its own.
 *
 * @example
 * checkUserValid('unique-user-id').then((valid) => {
 *   if(valid){
 *     console.log('User exists');
 *   }
 * }).catch((error) => {
 *   console.error(error.message);
 * });
 */
async function checkUserValid(ID: string): Promise<boolean> {
  const prisma = new PrismaClient();

  try {
    const user = await prisma.user.findUnique({
      where: {
        id: ID,
      },
    });

    if (user === null) {
      throw new Error("User does not exist");
    }

    return true;
  } catch (error) {
    throw new Error(error.message);
  } finally {
    prisma.$disconnect();
  }
}

export default checkUserValid;
