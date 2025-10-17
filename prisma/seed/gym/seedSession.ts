import { GymSet, PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

function randomInt(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomDate(start: Date, end: Date): Date {
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

async function main() {
    const user = await prisma.user.findUnique({
        where: {
            email: 'rickgeersing@mac.com',
        }
    })

    if (!user) {
        throw new Error('No user found. Please seed at least one user first.');
    }

    const exercises = await prisma.gymExercise.findMany();
    if (exercises.length === 0) {
        throw new Error('No exercises found. Please seed exercises first.');
    }

    const now = new Date();
    const twoMonthsAgo = new Date();
    twoMonthsAgo.setMonth(now.getMonth() - 2);

    const sessionCount = 10;

    for (let i = 0; i < sessionCount; i++) {
        const sessionStart = randomDate(twoMonthsAgo, now);
        const sessionEnd = new Date(sessionStart.getTime() + 60 * 60 * 1000);

        const exerciseCount = randomInt(4, 6);
        const shuffledExercises = [...exercises].sort(() => 0.5 - Math.random());
        const sessionExercises = shuffledExercises.slice(0, exerciseCount);

        const setsData = sessionExercises.flatMap(exercise => {
            const setsForExercise: Pick<GymSet, "exerciseId" | "reps" | "weight">[] = [];
            const setCount = randomInt(2, 3);
            for (let j = 0; j < setCount; j++) {
                setsForExercise.push({
                    exerciseId: exercise.id,
                    reps: randomInt(5, 15),
                    weight: randomInt(20, 200),
                });
            }
            return setsForExercise;
        });

        await prisma.gymSession.create({
            data: {
                userId: user.id,
                startDate: sessionStart,
                endDate: sessionEnd,
                exercises: {
                    create: sessionExercises.map(exercise => ({
                        exerciseId: exercise.id,
                    })),
                },
                sets: {
                    create: setsData,
                },
            },
        });
    }

    console.log('Session seeding complete!');
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });