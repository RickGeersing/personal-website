import DOMPurify from 'isomorphic-dompurify';
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { CF_SECRET_KEY, RESEND_API_KEY } from '$env/static/private';
import { z } from 'zod';
import { Resend } from 'resend';

interface TokenValidateResponse {
    'error-codes': string[];
    success: boolean;
    action: string;
    cdata: string;
}

const schema = z.object({
    name: z.string()
        .min(2, 'Name must be at least 2 characters long')
        .max(50, 'Name must be at most 50 characters long'),
    email: z.string()
        .email('Invalid email address')
        .max(50, 'Email must be at most 50 characters long'),
    message: z.string()
        .min(10, 'Message must be at least 10 characters long')
        .max(500, 'Message must be at most 500 characters long'),
    token: z.string({ message: 'Please verify ' }),
});

const resend = new Resend(RESEND_API_KEY);

export const POST: RequestHandler = async ({ request }) => {
    try {
        const formData = await request.formData();

        const { name, email, message, token } = schema.parse({
            name: formData.get('name')?.toString(),
            email: formData.get('email')?.toString(),
            message: formData.get('mes  sage')?.toString(),
            token: formData.get('cf-turnstile-response')?.toString()
        });

        const valid = await validateToken(token);
        if (!valid) {
            return json({
                success: false,
                message: 'Token validation failed',
            }, { status: 400 });
        }

        const { error } = await resend.emails.send({
            from: 'Rick Geersing <info@rickgeersing.com>',
            to: ['rickgeersing@mac.com'],
            subject: 'New message from your website',
            text: `
                Name: ${DOMPurify.sanitize(name)}
                Email: ${DOMPurify.sanitize(email)}
                Message: ${DOMPurify.sanitize(message)}
            `,
        })

        if (error) {
            return json({
                success: false,
                message: 'Failed to send message',
                errors: {
                    unknown: 'An unknown error occurred'
                }
            }, { status: 500 });
        }


        return json({
            success: true,
            message: 'Message sent',
            errors: undefined,
        });

    } catch (error) {
        if (error instanceof z.ZodError) {
            console.log(error.flatten().fieldErrors);
            return json({
                success: false,
                message: 'Validation failed',
                errors: error.flatten().fieldErrors,
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

async function validateToken(token: string): Promise<boolean> {
    const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ response: token, secret: CF_SECRET_KEY }),
    })

    const data: TokenValidateResponse = await response.json();

    return data.success;
}