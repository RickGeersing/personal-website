import { hasSession } from '$src/lib/server/session/managment';
import { jsonResponse, unauthorizedResponse } from '$src/lib/server/utilities/response';
import { prismaClient } from "$server/prisma/client";
import type { RequestHandler } from './$types';
import type { ResponseData } from '$src/lib/shared/types/response';
import {
    getMostTrainedMuscle as getMostTrainedMuscleQuery,
    getPopulairExercisesStats as getPopulairExercisesStatsQuery
} from '@prisma/client/sql';
import { getCache, setCache } from '$src/lib/server/redis/client';

export type GymDashboardResponse = ResponseData<{
    sessions: {
        current: number;
        last: number;
        difference: number;
    },
    weightLifted: {
        current: number;
        last: number;
        difference: number;
    },
    mostTrainedMuscle: {
        name: string;
        count: number;
    },
    strongestExercise: {
        name: string;
        weight: number;
    }
    populairExercises: getPopulairExercisesStatsQuery.Result[];
}>;

export const GET: RequestHandler = async ({ locals }) => {
    if (!hasSession(locals) || !locals.session) {
        return unauthorizedResponse();
    }

    const cache = await getCache(`gym:dashboard:${locals.session.id}`);
    if (cache) {
        return jsonResponse({
            success: true,
            status: 200,
            body: JSON.parse(cache)
        });
    }

    const stats = await Promise.all([
        getWeightLifted(locals.session.id),
        getSessions(locals.session.id),
        getMostTrainedMuscle(locals.session.id),
        getStrongestExercise(locals.session.id),
        getPopulairExercisesStats(locals.session.id)
    ]).then(([weightLifted, sessions, mostTrainedMuscle, strongestExercise, populairExercises]) => ({
        weightLifted,
        sessions,
        mostTrainedMuscle,
        strongestExercise,
        populairExercises
    }));

    setCache(`gym:dashboard:${locals.session.id}`, JSON.stringify(stats));

    return jsonResponse({
        success: true,
        status: 200,
        body: stats,
    })
};

const getWeightLifted = async (userId: string) => {
    const [current, last] = await Promise.all([
        prismaClient.gymSet.aggregate({
            _sum: {
                weight: true
            },
            where: {
                session: {
                    userId,
                    startDate: {
                        gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
                        lt: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1)
                    }
                }
            }
        }),
        prismaClient.gymSet.aggregate({
            _sum: {
                weight: true
            },
            where: {
                session: {
                    userId,
                    startDate: {
                        gte: new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1),
                        lt: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
                    }
                }
            }
        })
    ]);

    return {
        current: current._sum?.weight || 0,
        last: last._sum?.weight || 0,
        difference: (current._sum?.weight || 0) - (last._sum?.weight || 0)
    }
}

const getSessions = async (userId: string) => {
    const [current, last] = await Promise.all([
        prismaClient.gymSession.count({
            where: {
                userId,
                startDate: {
                    gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
                    lt: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1)
                }
            }
        }),
        prismaClient.gymSession.count({
            where: {
                userId,
                startDate: {
                    gte: new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1),
                    lt: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
                }
            }
        })
    ]);

    return {
        current,
        last,
        difference: current - last
    }
}

const getMostTrainedMuscle = async (userId: string) => {
    const result = await prismaClient.$queryRawTyped(
        getMostTrainedMuscleQuery(
            userId,
            new Date(new Date().getFullYear(), new Date().getMonth(), 1),
            new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1)
        )
    );

    return {
        ...result.at(0),
        count: Number(result.at(0)?.count || 0)
    }
}

const getStrongestExercise = async (userId: string) => {
    const result = await prismaClient.gymSet.findFirst({
        select: {
            weight: true,
            exercise: {
                select: {
                    name: true
                }
            }
        },
        where: {
            session: {
                userId,
            },
        },
        orderBy: {
            weight: 'desc'
        },
    });

    return {
        name: result?.exercise.name || 'None',
        weight: result?.weight || 0
    }
}

const getPopulairExercisesStats = async (userId: string) => {
    const result = await prismaClient.$queryRawTyped(
        getPopulairExercisesStatsQuery(userId)
    )

    return result;
}