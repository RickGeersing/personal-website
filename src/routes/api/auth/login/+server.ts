import { z } from 'zod';
import type { RequestHandler } from './$types';
import { prismaClient } from '$server/prisma/client';
import { verify } from 'argon2';
import { createSession } from '$lib/server/session/managment';

const loginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
});

export const POST: RequestHandler = async ({ request, cookies, }) => {
    const { email, password } = await request.json();

    try {
        loginSchema.parse({ email, password });

        const user = await prismaClient.user.findUnique({
            where: {
                email,
            },
        });

        if (!user) {
            return Response.json({
                success: false,
                message: 'Invalid email or password',
                data: null,
            }, {
                status: 400,
            });
        }

        const passwordMatch = await verify(user.password, password);
        if (!passwordMatch) {
            return Response.json({
                success: false,
                message: 'Invalid email or password',
                data: null,
            }, {
                status: 400,
            });
        }

        await createSession(user, cookies);

        return Response.json({
            success: true,
            message: 'Logged in',
        }, {
            status: 200,
        });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return Response.json({
                succes: false,
                message: 'Invalid email or password',
                data: null,
            }, {
                status: 400,
            });
        }

        return Response.json({
            success: false,
            message: 'An unexpected error occurred',
            data: null,
        }, {
            status: 500,
        });
    }
}