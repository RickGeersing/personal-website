import type { Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
	const response = await resolve(event);
	if (
		(event.request.method === 'GET' || event.request.method === 'HEAD') &&
		event.url.pathname === '/' &&
		response.status === 200 &&
		!response.headers.has('cache-control')
	) {
		response.headers.set('cache-control', 'public, max-age=0, s-maxage=3600');
	}

	return response;
};
