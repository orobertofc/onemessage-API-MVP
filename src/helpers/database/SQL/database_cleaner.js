const { PrismaClient } = require('@prisma/client');
const cron = require('node-cron');

const prisma = new PrismaClient();

async function deleteInactiveAccounts() {
  try {
    const currentDate = new Date();
    const twentyFourHoursAgo = new Date(currentDate - 24 * 60 * 60 * 1000);

    const inactiveAccounts = await prisma.user.findMany({
      where: {
        last_seen: { lte: twentyFourHoursAgo },
      },
    });

    if (inactiveAccounts.length === 0) {
      console.log('No inactive accounts found.');
      return;
    }

    // Run deletions concurrently
    await Promise.all(inactiveAccounts.map((account) => deleteAccount(account.user_id)));

    console.log('Account deletions completed.');
  } catch (error) {
    console.error('Error while deleting accounts:', error);
  }
}

async function deleteAccount(userId) {
  try {

    // all deletions are wrapped in one transaction to ensure that it either completes fully or not at all
    await prisma.$transaction([
      prisma.message.deleteMany({
        where: {
          conversation: {
            OR: [{ user1_id: userId }, { user2_id: userId }],
          },
        },
      }),
      prisma.conversation.deleteMany({
        where: {
          OR: [{ user1_id: userId }, { user2_id: userId }],
        },
      }),
      prisma.user.delete({
        where: {
          user_id: userId,
        },
      }),
    ]);

    console.log(`Deleted user with id ${userId}, its messages, and its conversations.`);
  } catch (error) {
    console.error('Error while deleting user, messages, and conversations:', error);
  }
}

// Run the script initially to delete inactive accounts
await deleteInactiveAccounts();

// Schedule the script to run every hour
cron.schedule('0 * * * *', async () => {
  console.log('Running account deletion script...');
  await deleteInactiveAccounts();
});
