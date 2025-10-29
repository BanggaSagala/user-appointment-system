import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const users = [
    { name: 'Bangga Sagala', username: 'bangga', preferredTimezone: 'Asia/Jakarta' },
    { name: 'Alya',          username: 'alya',   preferredTimezone: 'Pacific/Auckland' },
    { name: 'Rafi',          username: 'rafi',   preferredTimezone: 'Europe/Berlin' },
  ];

  for (const u of users) {
    await prisma.user.upsert({
      where: { username: u.username },
      update: {},
      create: u,
    });
  }
  console.log('✅ Users ensured: bangga, alya, rafi');
}

main().finally(() => prisma.$disconnect());
