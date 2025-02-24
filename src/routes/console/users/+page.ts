import { redirect } from '@sveltejs/kit';
import { route } from '$shared/utilities/routes';
import type { PageLoad } from './$types';
import type { User } from '@prisma/client';
import type { FindManyResponse } from '../../../app';

export const load = (async ({ fetch, url }) => {
    const searchParams = new URLSearchParams(url.search);
    const response = await fetch(`/api/users?${searchParams.toString()}`);

    if (response.status === 401) {
        throw redirect(302, route('login'));
    }

    const data: FindManyResponse<User> = await response.json();

    return {
        users: data.body,
    };
}) satisfies PageLoad;