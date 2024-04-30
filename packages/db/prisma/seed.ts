import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  const alice = await prisma.user.upsert({
    where: { number: "8262893590" },
    update: {},
    create: {
      number: "8262893590",
      password: "$2b$10$tp/QGPt.SG7OlLofqlfrheofBQr6LB.TtEzhO22RNOejEhrnvC8rW", //123456
      name: "alice",
      OnRampTransaction: {
        create: {
          startTime: new Date(),
          status: "Success",
          amount: 20000,
          token: "122",
          provider: "HDFC Bank",
        },
      },
      Balance: {
        create: {
          amount: 2000,
          locked: 0,
        },
      },
    },
  });
  const bob = await prisma.user.upsert({
    where: { number: "8262893599" },
    update: {},
    create: {
      number: "8262893599",
      password: "$2b$10$Q0.tVPmCrtej1CKytkfw2ueQkmAUjImvb6Ey23TPGw4LbfqiPzbm6", // 123456
      name: "bob",
      OnRampTransaction: {
        create: {
          startTime: new Date(),
          status: "Failure",
          amount: 2000,
          token: "123",
          provider: "HDFC Bank",
        },
      },
      Balance: {
        create: {
          amount: 2000,
          locked: 0,
        },
      },
    },
  });
  console.log({ alice, bob });
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
