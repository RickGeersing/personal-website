import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
	plugins: [sveltekit()],
	css: {
		preprocessorOptions: {
			scss: {
				api: 'modern-compiler',
			}
		}
	},
	resolve: {
		alias: {
			'@scss': path.resolve('./src/lib/scss'),
			".prisma/client/index-browser": "./node_modules/.prisma/client/index-browser.js",
		}
	},
});
