import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface ExerciseSeed {
    name: string;
    muscleGroups: string[];
}

async function main() {
    const muscleGroupsData = [
        { name: 'Chest' },
        { name: 'Shoulders' },
        { name: 'Triceps' },
        { name: 'Back' },
        { name: 'Biceps' },
        { name: 'Glutes' },
        { name: 'Legs' },
        { name: 'Quadriceps' },
        { name: 'Hamstrings' },
        { name: 'Calves' },
        { name: 'Abs' },
        { name: 'Obliques' },
        { name: 'Traps' },
        { name: 'Forearms' },
        { name: 'Grip' },
    ];

    const createdMuscleGroups = await Promise.all(
        muscleGroupsData.map(group =>
            prisma.gymMuscleGroup.create({ data: group })
        )
    );

    const muscleGroupMap = createdMuscleGroups.reduce((map, group) => {
        map[group.name] = group.id;
        return map;
    }, {} as Record<string, string>);

    const exercisesData: ExerciseSeed[] = [
        { name: 'Bench Press', muscleGroups: ['Chest', 'Shoulders', 'Triceps'] },
        { name: 'Incline Bench Press', muscleGroups: ['Chest', 'Shoulders', 'Triceps'] },
        { name: 'Decline Bench Press', muscleGroups: ['Chest', 'Triceps'] },
        { name: 'Dumbbell Flyes', muscleGroups: ['Chest'] },
        { name: 'Cable Crossovers', muscleGroups: ['Chest'] },
        { name: 'Push Up', muscleGroups: ['Chest', 'Shoulders', 'Triceps'] },
        { name: 'Chest Press', muscleGroups: ['Chest', 'Triceps', 'Shoulders'] },
        { name: 'Dumbbell Pullover', muscleGroups: ['Chest', 'Back'] },
        { name: 'Barbell Row', muscleGroups: ['Back', 'Biceps'] },
        { name: 'Dumbbell Row', muscleGroups: ['Back', 'Biceps'] },
        { name: 'Pull Up', muscleGroups: ['Back', 'Biceps'] },
        { name: 'Chin Up', muscleGroups: ['Back', 'Biceps'] },
        { name: 'Lat Pulldown', muscleGroups: ['Back', 'Biceps'] },
        { name: 'Seated Cable Row', muscleGroups: ['Back', 'Biceps'] },
        { name: 'Deadlift', muscleGroups: ['Back', 'Legs', 'Glutes', 'Hamstrings'] },
        { name: 'T-Bar Row', muscleGroups: ['Back', 'Biceps'] },
        { name: 'Face Pull', muscleGroups: ['Shoulders', 'Back'] },
        { name: 'Overhead Press', muscleGroups: ['Shoulders', 'Triceps'] },
        { name: 'Dumbbell Shoulder Press', muscleGroups: ['Shoulders', 'Triceps'] },
        { name: 'Lateral Raise', muscleGroups: ['Shoulders'] },
        { name: 'Front Raise', muscleGroups: ['Shoulders'] },
        { name: 'Rear Delt Fly', muscleGroups: ['Shoulders'] },
        { name: 'Upright Row', muscleGroups: ['Shoulders', 'Traps'] },
        { name: 'Shrug', muscleGroups: ['Traps'] },
        { name: 'Bicep Curl', muscleGroups: ['Biceps'] },
        { name: 'Hammer Curl', muscleGroups: ['Biceps'] },
        { name: 'Preacher Curl', muscleGroups: ['Biceps'] },
        { name: 'Concentration Curl', muscleGroups: ['Biceps'] },
        { name: 'Triceps Pushdown', muscleGroups: ['Triceps'] },
        { name: 'Overhead Triceps Extension', muscleGroups: ['Triceps'] },
        { name: 'Dip', muscleGroups: ['Chest', 'Triceps'] },
        { name: 'Skull Crusher', muscleGroups: ['Triceps'] },
        { name: 'Leg Press', muscleGroups: ['Legs', 'Quadriceps'] },
        { name: 'Squat', muscleGroups: ['Legs', 'Quadriceps', 'Glutes', 'Hamstrings'] },
        { name: 'Front Squat', muscleGroups: ['Legs', 'Quadriceps', 'Glutes'] },
        { name: 'Lunge', muscleGroups: ['Legs', 'Glutes', 'Quadriceps', 'Hamstrings'] },
        { name: 'Bulgarian Split Squat', muscleGroups: ['Legs', 'Glutes', 'Quadriceps', 'Hamstrings'] },
        { name: 'Leg Extension', muscleGroups: ['Quadriceps'] },
        { name: 'Leg Curl', muscleGroups: ['Hamstrings'] },
        { name: 'Calf Raise', muscleGroups: ['Calves'] },
        { name: 'Seated Calf Raise', muscleGroups: ['Calves'] },
        { name: 'Hip Thrust', muscleGroups: ['Glutes', 'Hamstrings'] },
        { name: 'Glute Bridge', muscleGroups: ['Glutes'] },
        { name: 'Ab Crunch', muscleGroups: ['Abs'] },
        { name: 'Sit Up', muscleGroups: ['Abs'] },
        { name: 'Plank', muscleGroups: ['Abs'] },
        { name: 'Russian Twist', muscleGroups: ['Abs', 'Obliques'] },
        { name: 'Leg Raise', muscleGroups: ['Abs'] },
        { name: 'Cable Woodchop', muscleGroups: ['Abs', 'Obliques'] },
        { name: 'Oblique Crunch', muscleGroups: ['Obliques'] },
        { name: "Farmer's Walk", muscleGroups: ['Forearms', 'Grip'] },
        { name: 'Wrist Curl', muscleGroups: ['Forearms'] },
        { name: 'Reverse Wrist Curl', muscleGroups: ['Forearms'] },
        { name: 'Sumo Deadlift', muscleGroups: ['Legs', 'Glutes', 'Hamstrings', 'Back'] },
    ];

    for (const exerciseData of exercisesData) {
        const exercise = await prisma.gymExercise.create({
            data: {
                name: exerciseData.name,
            },
        });

        for (const groupName of exerciseData.muscleGroups) {
            const muscleGroupId = muscleGroupMap[groupName];
            if (!muscleGroupId) {
                console.warn(`Muscle group "${groupName}" not found for exercise "${exerciseData.name}"`);
                continue;
            }
            await prisma.gymExerciseOnGymMuscleGroup.create({
                data: {
                    exerciseId: exercise.id,
                    muscleGroupId,
                },
            });
        }
    }

    console.log('Seeded exercises and muscle groups');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });