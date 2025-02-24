import { hasSession } from '$lib/server/session/managment';
import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { route } from '$lib/shared/utilities/routes';

export const load = (async ({ locals }) => {
    if (hasSession(locals)) {
        throw redirect(302, route('console'));
    }
}) satisfies PageServerLoad;