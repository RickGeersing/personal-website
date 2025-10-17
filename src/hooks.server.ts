import { retrieveSession } from "$lib/server/session/managment";
import type { Handle } from "@sveltejs/kit";

export const handle: Handle = async ({ event, resolve }) => {
    const t0 = performance.now();
    event.locals.session = await retrieveSession(event.cookies);
    const response = await resolve(event);
    const t1 = performance.now();
    console.log(`Session retrieval took ${t1 - t0} milliseconds`);

    return response;
};