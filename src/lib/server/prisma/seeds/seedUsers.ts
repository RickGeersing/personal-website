import { prismaClient } from "$server/prisma/client";
import { faker } from '@faker-js/faker';
import { hash } from "argon2";

async function seedUsers() {
    for (let i = 0; i < 250; i++) {
        const passwordHash = await hash('Test@123');
        await prismaClient.user.create({
            data: {
                email: faker.internet.email(),
                password: passwordHash,
                role: 'USER',
            }
        });
    }

    console.log('Seeded users');
}

await seedUsers();