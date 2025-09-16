const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  // Delete all users and related data
  console.log('Deleting all users and related data...');
  
  // Delete sessions first (due to foreign key constraints)
  const deletedSessions = await prisma.session.deleteMany({});
  console.log(`Deleted ${deletedSessions.count} sessions`);
  
  // Delete accounts (due to foreign key constraints)
  const deletedAccounts = await prisma.account.deleteMany({});
  console.log(`Deleted ${deletedAccounts.count} accounts`);
  
  // Delete EPUBs (due to foreign key constraints)
  const deletedEpubs = await prisma.epub.deleteMany({});
  console.log(`Deleted ${deletedEpubs.count} EPUBs`);
  
  // Delete verification tokens
  const deletedTokens = await prisma.verificationToken.deleteMany({});
  console.log(`Deleted ${deletedTokens.count} verification tokens`);
  
  // Finally, delete users
  const deletedUsers = await prisma.user.deleteMany({});
  console.log(`Deleted ${deletedUsers.count} users`);
  
  console.log('All users and related data have been deleted.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });