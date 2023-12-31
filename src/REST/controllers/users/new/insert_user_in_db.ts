import {PrismaClient} from '@prisma/client';

/**
 * Saves a user object to the database.
 *
 * @param {object} user - The user object to be saved.
 * @param {string} user.name - The name of the user.
 * @param {string} user.id - The user's ID.
 * @param {string} user.password - The user's password.
 * @throws {Error} If there is an error saving the user to the database.
 * @returns {Promise<void>} A Promise that resolves once the user has been saved to the database or rejects with an error.
 */
async function saveUserToDb(user: { name: string; id: string, password: string }): Promise<void> {
  const prisma = new PrismaClient();
  try {
    await prisma.user.create({
      data: {
        name: user.name,
        id: user.id,
        password: user.password,
        lastSeen: new Date(),
      },
    });

  } catch (error) {
    if(error.message.includes('Unique constraint failed on the fields')) {
      throw new Error("Username already taken. Please choose a different username.")

    } else {
      throw new Error("Error saving user to database.")
    }

  } finally {
    prisma.$disconnect();
  }
}

export default saveUserToDb;