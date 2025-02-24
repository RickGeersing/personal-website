import { prismaClient } from '$server/prisma/client';
import { hasSession } from '$server/session/managment';
import { forbiddenResponse, jsonResponse, unauthorizedResponse } from '$server/utilities/response';
import { Role, type Prisma } from '@prisma/client';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ locals, url }) => {
    if (!hasSession(locals)) {
        return unauthorizedResponse();
    }

    if (locals.session?.role !== Role.ADMIN) {
        return forbiddenResponse();
    }

    const limit = Number(url.searchParams.get('limit')) || 10;
    const page = Number(url.searchParams.get('page')) || 1;
    const where: Prisma.UserWhereInput = {
        email: {
            contains: url.searchParams.get('search') || undefined,
        }
    }

    const total = await prismaClient.user.count({ where });
    const users = await prismaClient.user.findMany({
        select: {
            id: true,
            email: true,
            role: true,
        },
        take: limit,
        skip: (page - 1) * limit,
        where,
    });


    return jsonResponse({
        status: 200,
        body: {
            results: users,
            limit,
            page,
            total,
            hasNext: total > page * limit,
            hasPrevious: page > 1,
        },
        success: true,
    });
};