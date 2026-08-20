import { prisma } from "./db";

async function main() {
  const tasks = await prisma.section.findMany({
    include: {
      tasks: true,
    },
  });
  console.log(tasks);
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
