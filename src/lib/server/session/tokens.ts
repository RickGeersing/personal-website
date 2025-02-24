import { ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET } from "$env/static/private";
import { prismaClient } from "$server/prisma/client";
import { SignJWT, jwtVerify, type JWTPayload } from "jose";
import crypto from 'crypto';
import { JWTInvalid } from "jose/errors";
import type { Role } from "@prisma/client";

export type UserPayload = { id: string, role: Role };
export type TokenPayload = JWTPayload & UserPayload;

export const ACCESS_TOKEN_DURATION = 15 * 60 * 1000; // 15 minutes
export const REFRESH_TOKEN_DURATION = 7 * 24 * 60 * 60 * 1000; // 7 days

const generateToken = async (user: UserPayload, secret: string, expiresIn: Date): Promise<string> => {
    const encodedSecret = new TextEncoder().encode(secret);
    const token = await new SignJWT({ id: user.id, role: user.role })
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime(expiresIn)
        .sign(encodedSecret);

    return token;
}

const verifyToken = async (token: string, secret: string): Promise<TokenPayload> => {
    const encodedSecret = new TextEncoder().encode(secret);
    const { payload } = await jwtVerify(token, encodedSecret, { algorithms: ['HS256'] });
    return payload as TokenPayload;
}

export const generateAccessToken = async (user: UserPayload): Promise<string> => {
    const expiresAt = new Date(Date.now() + ACCESS_TOKEN_DURATION);
    return generateToken(user, ACCESS_TOKEN_SECRET, expiresAt);
}

export const generateAndStoreRefreshToken = async (user: UserPayload): Promise<string> => {
    const expiresAt = new Date(Date.now() + REFRESH_TOKEN_DURATION);
    const refreshToken = await generateToken(user, REFRESH_TOKEN_SECRET, expiresAt);
    const hashedToken = crypto.createHash('sha256').update(refreshToken).digest('hex');

    await prismaClient.refreshToken.create({
        data: {
            token: hashedToken,
            expiresAt: new Date(Date.now() + REFRESH_TOKEN_DURATION),
            userId: user.id
        }
    });

    return refreshToken;
}

export const deleteRefreshToken = async (token: string): Promise<void> => {
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
    await prismaClient.refreshToken.deleteMany({
        where: {
            token: hashedToken
        }
    });
}

export const verifyAccessToken = async (token: string): Promise<TokenPayload> => {
    return verifyToken(token, ACCESS_TOKEN_SECRET);
}

export const verifyRefreshToken = async (token: string): Promise<TokenPayload> => {
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
    const refreshToken = await prismaClient.refreshToken.findFirst({
        where: {
            token: hashedToken
        }
    });

    if (!refreshToken) {
        throw new JWTInvalid('Invalid refresh token');
    }

    return verifyToken(token, REFRESH_TOKEN_SECRET);
}