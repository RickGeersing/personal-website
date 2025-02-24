import { revokeSession } from '$server/session/managment';
import { jsonResponse } from '$server/utilities/response';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ cookies }) => {
    await revokeSession(cookies);

    return jsonResponse({
        status: 200,
        data: null,
        success: true,
    });
};