import { z } from 'zod';
import type { RequestHandler } from './$types';
import { prismaClient } from '$lib/prisma/client';
import { verify } from 'argon2';
import { ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET } from '$env/static/private';
import { SignJWT } from 'jose';

const loginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
});

export const POST: RequestHandler = async ({ request, cookies }) => {
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

        const accessToken = await createAccessToken(user.id);
        const refreshToken = await createRefreshToken(user.id);

        cookies.set('accessToken', accessToken, {
            httpOnly: true,
            secure: true,
            sameSite: 'strict',
            path: '/',
        });

        cookies.set('refreshToken', refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: 'strict',
            path: '/',
        });

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

function createAccessToken(userId: string) {
    const accessTokenSecret = new TextEncoder().encode(ACCESS_TOKEN_SECRET);
    return new SignJWT({ id: userId })
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime('30m')
        .sign(accessTokenSecret);
}

function createRefreshToken(userId: string) {
    const refreshTokenSecret = new TextEncoder().encode(REFRESH_TOKEN_SECRET);
    return new SignJWT({ id: userId })
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime('7d')
        .sign(refreshTokenSecret);
}