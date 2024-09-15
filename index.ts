import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const user = await prisma.user.update({
    where: {
      email: "test@gmail.com",
    },
    data: {
      sections: {
        create: {
          name: "Others",
        },
      },
    },
    include: {
      sections: {
        include: {
          tasks: true,
        },
      },
    },
  });

  console.log(user);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
