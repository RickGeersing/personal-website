import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { unknown, z } from 'zod';

const schema = z.object({
    name: z.string().min(2),
    email: z.string().email(),
    message: z.string().min(10),
});

export const POST: RequestHandler = async ({ request }) => {
    try {
        const formData = await request.formData();
        const { name, email, message } = schema.parse(Object.fromEntries(formData));

        return json({ 
            success: true, 
            message: 'Message sent',
            errors: undefined,
        });

    } catch (error) {
        if (error instanceof z.ZodError) {
            console.log(error.issues);
            return json({ 
                success: false,
                message: 'Validation failed',
                errors: error.errors 
            }, { status: 400 });
        }

        return json({
            success: false,
            message: 'Something went wrong',
            errors: {
                unknown: 'An unknown error occurred'
            }
        }, { status: 500 });
    }
};