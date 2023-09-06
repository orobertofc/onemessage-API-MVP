const {PrismaClient} = require("@prisma/client");

async function getUserById(id) {
  const prisma = new PrismaClient();
  try {

    const user = await prisma.user.findUnique({
      where: {
        id: id
      }
    });

    if (user === null) {
      throw new Error("User does not exist")
    } else {
      return user
    }

  } catch (error) {
    throw new Error(error.message);

  } finally {
    prisma.$disconnect();
  }
}

module.exports = getUserById;