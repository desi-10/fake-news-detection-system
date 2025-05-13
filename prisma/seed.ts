import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
async function main() {
  await prisma.feedback.create({
    data: {
      content: "Fake news is fake news",
      rating: 5,
      userId: "cmagnoer90000l504381ifbxw",
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
