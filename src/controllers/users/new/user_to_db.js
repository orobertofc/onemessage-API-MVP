const { PrismaClient } = require('@prisma/client')

/**
 * Saves a user object to the database.
 *
 * @param {object} user - The user object to be saved.
 * @param {string} user.name - The name of the user.
 * @param {number} user.id - The user's ID.
 * @throws {Error} If there is an error saving the user to the database.
 * @returns {Promise<void>} A Promise that resolves once the user has been saved to the database or rejects with an error.
 */
async function saveUserToDb(user) {
  const prisma = new PrismaClient();
  try {
    await prisma.user.create({
      data: {
        name: user.name,
        id: user.id,
        lastSeen: new Date(),
      },
    });

  } catch (error) {
    throw new Error(error.message);
  } finally {
    prisma.$disconnect()
  }
}

module.exports = saveUserToDb;
