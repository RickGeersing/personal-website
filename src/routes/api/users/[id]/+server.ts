import { hasSession } from '$src/lib/server/session/managment';
import { forbiddenResponse, internalServerErrorResponse, invalidRequestResponse, jsonResponse, notFoundResponse, unauthorizedResponse } from '$src/lib/server/utilities/response';
import { Role } from '@prisma/client';
import type { RequestHandler } from './$types';
import { prismaClient } from '$src/lib/server/prisma/client';
import { validateJsonData } from '$src/lib/shared/utilities/formData';
import { userUpdateSchema } from '$src/lib/shared/schemas/userSchema';
import { hash } from 'argon2';

export const GET: RequestHandler = async ({ locals, params }) => {
    try {
        if (!hasSession(locals)) {
            return unauthorizedResponse();
        }

        if (locals.session?.role !== Role.ADMIN) {
            return forbiddenResponse();
        }

        const user = await prismaClient.user.findUnique({
            where: {
                id: params.id
            }
        });

        if (!user) {
            return notFoundResponse();
        }

        return jsonResponse({
            status: 200,
            body: user,
            success: true
        });
    } catch {
        return internalServerErrorResponse();
    }
};

export const PUT: RequestHandler = async ({ locals, params, request }) => {
    try {
        if (!hasSession(locals)) {
            return unauthorizedResponse();
        }

        if (locals.session?.role !== Role.ADMIN) {
            return forbiddenResponse();
        }

        const user = await prismaClient.user.findUnique({
            where: {
                id: params.id
            }
        });

        if (!user) {
            return jsonResponse({
                status: 404,
                body: {
                    message: 'User not found'
                },
                success: false
            });
        }

        const data = await validateJsonData(request, userUpdateSchema);
        const hashedPassword = data.password ? await hash(data.password) : undefined;
        const updatedUser = await prismaClient.user.update({
            where: {
                id: params.id
            },
            data: {
                email: data.email,
                role: data.role,
                password: hashedPassword
            }
        });

        return jsonResponse({
            status: 200,
            body: updatedUser,
            success: true
        });
    } catch (e) {
        if (e instanceof Error) {
            return invalidRequestResponse();
        }

        return internalServerErrorResponse();
    }
}