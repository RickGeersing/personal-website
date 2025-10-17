type JsonResponse = {
    status: number;
    body: unknown;
    success: boolean;
    message?: string;
    code?: string;
}

export const jsonResponse = ({ status, body, success, message, code }: JsonResponse): Response => {
    return Response.json({
        body,
        success,
        message,
        code,
    }, {
        status,
    });
}

export const invalidRequestResponse = (): Response => {
    return jsonResponse({
        status: 400,
        body: null,
        success: false,
        message: 'Invalid request.',
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

export const notFoundResponse = (): Response => {
    return jsonResponse({
        status: 404,
        body: null,
        success: false,
        message: 'Resource not found.',
    });
}

export const internalServerErrorResponse = (): Response => {
    return jsonResponse({
        status: 500,
        body: null,
        success: false,
        message: 'An internal server error occurred.',
    });
}