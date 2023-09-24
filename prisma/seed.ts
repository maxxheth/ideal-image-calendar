import { PrismaClient, Status, ChannelType } from '@prisma/client';
import { faker } from '@faker-js/faker';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  for (let i = 0; i < 10; i++) {
    const user = await prisma.user.create({
      data: {
        name: `${faker.person.firstName()} ${faker.person.lastName()}`,
        email: faker.internet.email(),
        emailVerified: faker.date.past(),
        image: faker.image.avatar(),
      },
    });

    console.log({ user: user });

    const calendar = await prisma.calendar.create({
      data: {
        userId: user.id,
        url: faker.internet.url(),
      },
    });

    for (let j = 0; j < 5; j++) {

      const item = await prisma.item.create({
        data: {
          calendarId: calendar.id,
          channelId: faker.string.uuid(),  // Updated this line
          title: faker.lorem.words(),
          status: Object.values(Status)[Math.floor(Math.random() * Object.values(Status).length)] as Status,
          color: faker.internet.color(),
          channelType: Object.values(ChannelType)[Math.floor(Math.random() * Object.values(ChannelType).length)] as ChannelType,
          leadForecast: faker.number.int({ min: 0, max: 10000 }),
          leadActual: faker.number.int({ min: 0, max: 10000 }),
          date: faker.date.future(),
        },
      });

      // Create reports for each item
      for (let k = 0; k < 3; k++) {
        await prisma.report.create({
          data: {
            itemId: item.id,
            content: faker.lorem.paragraph(),
          },
        });
      }
    }
  }
}

main()
  .then((result) => {
    console.log(result);
  })
  .catch((e) => {
    throw e;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

