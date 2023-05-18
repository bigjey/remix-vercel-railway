const { PrismaClient } = require("@prisma/client");

async function main() {
  const prisma = new PrismaClient();
  await prisma.$connect();
  console.log(await prisma.category.findMany());
  await prisma.$disconnect();
  console.log("end :wave:");
}

main();
