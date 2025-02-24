// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces

import type { TokenPayload } from '$server/session/tokens';

declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			session?: TokenPayload;
		}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
}

export type ResponseData<T> = {
	message?: string;
	body: T;
	success: boolean;
};

export type FindManyResponse<T> = ResponseData<PaginatedResults<T>>;

export type PaginatedResults<T> = {
	results: T[];
	total: number;
	page: number;
	limit: number;
	hasNext: boolean;
	hasPrevious: boolean;
};

export { };
