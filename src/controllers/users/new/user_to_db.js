const { PrismaClient } = require('@prisma/client')

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
