const { PrismaClient } = require('@prisma/client')

async function userToDb(user) {
  const prisma = new PrismaClient();
  try {
    await prisma.user.create({
      data: {
        user_name: user.user_name,
        public_id: user.public_id,
        private_id: user.private_id,
        last_seen: new Date(),
      },
    });

  } catch (error) {
    throw new Error(error.message);
  }
}

module.exports = userToDb;