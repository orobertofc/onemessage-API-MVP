const { PrismaClient } = require('@prisma/client')

async function user_to_db(user_name, public_id, private_id) {
  const prisma = new PrismaClient();
  try {
    await prisma.user.create({
      data: {
        user_name: user_name,
        public_id: public_id,
        private_id: private_id,
        last_seen: new Date(),
      },
    });
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
}

module.exports = user_to_db;