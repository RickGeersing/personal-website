import { hasSession } from '$lib/server/session/managment';
import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { route } from '$lib/shared/utilities/routes';
import { Role } from '@prisma/client';

export const load = (async ({ locals }) => {
    if (!hasSession(locals)) {
        throw redirect(302, route('login'));
    }

    if (locals.session?.role !== Role.ADMIN) {
        throw redirect(302, route('console'));
    }
}) satisfies PageServerLoad;