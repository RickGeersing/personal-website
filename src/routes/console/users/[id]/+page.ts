import { redirect } from '@sveltejs/kit';
import { route } from '$shared/utilities/routes';
import type { PageLoad } from './$types';
import type { User } from '@prisma/client';
import type { FindUniqueResponse } from '$shared/types/response';

export const load = (async ({ fetch, params }) => {
    const response = await fetch(`/api/users/${params.id}`);

    if (response.status === 401) {
        throw redirect(302, route('login'));
    }

    if (response.status === 403) {
        throw redirect(302, route('console'));
    }

    const data: FindUniqueResponse<User> = await response.json();

    return {
        user: data.body,
    };
}) satisfies PageLoad;