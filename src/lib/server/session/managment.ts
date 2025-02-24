import type { Cookies } from "@sveltejs/kit";
import {
    ACCESS_TOKEN_DURATION,
    deleteRefreshToken,
    generateAccessToken,
    generateAndStoreRefreshToken,
    REFRESH_TOKEN_DURATION,
    verifyAccessToken,
    verifyRefreshToken,
    type TokenPayload,
    type UserPayload
} from "./tokens";
import { JWSInvalid, JWTExpired } from "jose/errors";

export const hasSession = (locals: App.Locals): boolean => {
    return locals.session !== undefined;
}

export const createSession = async (user: UserPayload, cookies: Cookies):
    Promise<{ accessToken: string, refreshToken: string } | undefined> => {
    try {
        const refreshToken = cookies.get('refresh') || '';
        await deleteRefreshToken(refreshToken);

        const accessToken = await generateAccessToken(user);
        const newRefreshToken = await generateAndStoreRefreshToken(user);

        cookies.set('access', accessToken, {
            httpOnly: true,
            secure: true,
            sameSite: 'strict',
            path: '/',
            expires: new Date(Date.now() + ACCESS_TOKEN_DURATION),
        });

        cookies.set('refresh', newRefreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: 'strict',
            path: '/',
            expires: new Date(Date.now() + REFRESH_TOKEN_DURATION),
        });

        return { accessToken, refreshToken: newRefreshToken };
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (e) {

        return undefined;
    }
}

export const revokeSession = async (cookies: Cookies): Promise<void> => {
    const refreshToken = cookies.get('refresh');

    await deleteRefreshToken(refreshToken || '');

    cookies.delete('access', { path: '/' });
    cookies.delete('refresh', { path: '/' });
}


export const retrieveAndRenewSession = async (cookies: Cookies): Promise<TokenPayload | undefined> => {
    const refreshToken = cookies.get('refresh');

    if (!refreshToken) {
        return undefined;
    }

    try {
        const refreshPayload = await verifyRefreshToken(refreshToken);
        await createSession(refreshPayload, cookies);

        const accessToken = cookies.get('access');

        if (!accessToken) {
            return undefined;
        }

        const payload = await verifyAccessToken(accessToken);
        return payload;
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (e) {
        await revokeSession(cookies);

        return undefined;
    }
}

export const retrieveSession = async (cookies: Cookies, retries: number = 1): Promise<TokenPayload | undefined> => {
    const accessToken = cookies.get('access');
    const refreshToken = cookies.get('refresh');

    if (retries === -1 || (!accessToken && !refreshToken)) {
        return undefined;
    }

    try {
        const payload = await verifyAccessToken(accessToken || '');
        return payload;
    } catch (e) {
        if (e instanceof JWTExpired || e instanceof JWSInvalid) {
            const payload = await retrieveAndRenewSession(cookies);
            return payload;
        }

        return undefined;
    }
}