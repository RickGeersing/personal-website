type JsonResponse = {
    status: number;
    body: unknown;
    success: boolean;
    message?: string;
}

export const jsonResponse = ({ status, body, success, message }: JsonResponse): Response => {
    return Response.json({
        body,
        success,
        message,
    }, {
        status,
    });
}

export const unauthorizedResponse = (): Response => {
    return jsonResponse({
        status: 401,
        body: null,
        success: false,
        message: 'You must be logged in to access this resource.',
    });
}

export const forbiddenResponse = (): Response => {
    return jsonResponse({
        status: 403,
        body: null,
        success: false,
        message: 'You do not have permission to access this resource.',
    });
}