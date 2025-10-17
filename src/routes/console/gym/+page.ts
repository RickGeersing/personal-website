import type { GymDashboardResponse } from '$src/routes/api/gym/dashboard/+server';
import type { PageLoad } from './$types';

export const load = (async ({ fetch }) => {
    const response = await fetch(`/api/gym/dashboard`);

    const data: GymDashboardResponse = await response.json();

    console.log(data);

    return {
        stats: data.body,
    }
}) satisfies PageLoad;