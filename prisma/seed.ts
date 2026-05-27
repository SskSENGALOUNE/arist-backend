import { PrismaClient, UserRole } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash('Admin@1234', 10);

  const admin = await prisma.user.upsert({
    where: { username: 'admin' },
    update: {},
    create: {
      email: 'admin@arist.com',
      username: 'admin',
      password: passwordHash,
      role: UserRole.ADMIN,
      firstName: 'System',
      lastName: 'Admin',
      isActive: true,
      mustChangePassword: false,
    },
  });

  console.log('Seeded admin user:', admin.username);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
