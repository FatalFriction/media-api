// prisma/seed.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Clear data
  await prisma.media.deleteMany();
  await prisma.content.deleteMany();
  await prisma.user.deleteMany();
  await prisma.category.deleteMany();

  // Seed Categories
  const tech = await prisma.category.create({ data: { name: 'Tech' } });
  const design = await prisma.category.create({ data: { name: 'Design' } });

  // Seed Users
  const admin = await prisma.user.create({
    data: {
      email: 'admin@example.com',
      password: 'hashed123', // In real app: use bcrypt
      name: 'Admin User',
      role: 'admin',
    },
  });

  const user = await prisma.user.create({
    data: {
      email: 'user@example.com',
      password: 'hashed456',
      name: 'Regular User',
    },
  });

  // Seed Content
  await prisma.content.createMany({
    data: [
      {
        title: 'NestJS Guide',
        slug: 'nestjs-guide',
        body: 'Learn NestJS with Prisma...',
        userId: admin.id,
        categoryId: tech.id,
      },
      {
        title: 'UI Tips',
        slug: 'ui-tips',
        body: 'Best practices for clean UI...',
        userId: user.id,
        categoryId: design.id,
      },
    ],
  });

  // Seed Media (optional)
  const content = await prisma.content.findFirst();
  if (content) {
    await prisma.media.create({
      data: {
        url: 'https://i0.wp.com/picjumbo.com/wp-content/uploads/beautiful-golden-retriever-happy-about-fall-season-free-image.jpg',
        type: 'image',
        contentId: content.id,
      },
    });
  }

  console.log('🌱 Seed completed!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });