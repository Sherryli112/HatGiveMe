import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  // 建立初始管理員
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@hatgiveme.com';
  const adminPassword = process.env.ADMIN_PASSWORD || 'hat1234';

  const existingAdmin = await prisma.user.findUnique({
    where: { email: adminEmail },
  });

  if (!existingAdmin) {
    const hashedPassword = await bcrypt.hash(adminPassword, 10);
    await prisma.user.create({
      data: {
        email: adminEmail,
        password: hashedPassword,
        name: '系統管理員',
        role: 'ADMIN',
        isActive: true,
      },
    });
    console.log('管理員帳號已建立:', adminEmail);
  } else {
    console.log('管理員帳號已存在:', adminEmail);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });