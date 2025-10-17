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

export { };
