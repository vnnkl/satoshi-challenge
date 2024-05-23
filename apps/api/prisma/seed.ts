import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Create users
  await prisma.user.createMany({
    data: [{ balance: 1000 }, { balance: 500 }],
  });

  // Fetch the created users
  const users = await prisma.user.findMany();
  const alice = users[0];
  const bob = users[1];

  // Create transfers
  await prisma.transfer.create({
    data: {
      amount: 200,
      senderId: alice.id,
      receiverId: bob.id,
    },
  });

  await prisma.transfer.create({
    data: {
      amount: 100,
      senderId: bob.id,
      receiverId: alice.id,
    },
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
