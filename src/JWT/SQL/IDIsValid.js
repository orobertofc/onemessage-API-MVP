const { PrismaClient } = require('@prisma/client');

async function checkUserExists(privateId) {
  const prisma = new PrismaClient();
  try {

    const user = await prisma.user.findUnique({
      where: {
        private_id: privateId
      }
    });

    if (user === null) {
      throw new Error
    } else {
      return true;
    }

  } catch (error) {
    throw new Error("User does not exist");

  } finally {
    prisma.$disconnect();
  }
}

module.exports = checkUserExists;