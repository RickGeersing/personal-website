import type { RequestHandler } from './$types';
import { z } from 'zod';

const schema = z.object({
    name: z.string(),
    email: z.string().email(),
    message: z.string(),
});

export const POST: RequestHandler = async ({ request }) => {
    const body = schema.parse(request.body);

    return new Response();
};