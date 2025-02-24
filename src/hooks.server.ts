import { retrieveSession } from "$lib/server/session/managment";
import type { Handle } from "@sveltejs/kit";

export const handle: Handle = async ({ event, resolve }) => {
    event.locals.session = await retrieveSession(event.cookies);
    const response = await resolve(event);

    return response;
};