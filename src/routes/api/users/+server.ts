import { prismaClient } from '$server/prisma/client';
import { hasSession } from '$server/session/managment';
import { forbiddenResponse, jsonResponse, unauthorizedResponse } from '$server/utilities/response';
import { Role, type Prisma } from '@prisma/client';
import type { RequestHandler } from './$types';
import { validateJsonData } from '$src/lib/shared/utilities/formData';
import { userSchema } from '$src/lib/shared/schemas/userSchema';
import { hash } from 'argon2';

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

export const POST: RequestHandler = async ({ locals, request }) => {
    if (!hasSession(locals)) {
        return unauthorizedResponse();
    }

    if (locals.session?.role !== Role.ADMIN) {
        return forbiddenResponse();
    }

    try {
        const data = await validateJsonData(request, userSchema);

        const userExists = await prismaClient.user.findFirst({
            where: {
                email: data.email,
            }
        });

        if (userExists) {
            return jsonResponse({
                status: 400,
                body: {
                    message: 'User already exists',
                },
                code: 'USER_EXISTS',
                success: false,
            });
        }

        const hashedPassword = await hash(data.password);
        const user = await prismaClient.user.create({
            data: {
                email: data.email,
                password: hashedPassword,
                role: data.role,
            },
            select: {
                id: true,
                email: true,
                role: true,
            }
        });

        return jsonResponse({
            status: 201,
            body: user,
            success: true,
            code: 'USER_CREATED',
        });
    } catch {
        return jsonResponse({
            status: 400,
            body: {
                message: 'Invalid data',
            },
            code: 'INVALID_DATA',
            success: false,
        });
    }
}