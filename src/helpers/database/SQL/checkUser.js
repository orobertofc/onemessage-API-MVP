const { PrismaClient } = require('@prisma/client');

async function checkUserValid(ID) {
  const prisma = new PrismaClient();

  try {
    const user = await prisma.user.findUnique({
      where: {
        id: ID
      }
    });

    if (user === null) {
      throw new Error("User does not exist")
    }

    return true;

  } catch (error) {
    throw new Error(error.message);
  } finally {
    prisma.$disconnect();
  }
}

module.exports = checkUserValid;