import { prismaClient } from "./client";
import { hash } from "argon2";

async function seed() {
    const count = await prismaClient.user.count();

    if (count !== 0) return;

    const passwordHash = await hash('Test@123');
    await prismaClient.user.create({
        data: {
            email: 'rickgeersing@mac.com',
            password: passwordHash,
            role: 'ADMIN',
        }
    });

    console.log('Seeded user');
}

await seed();