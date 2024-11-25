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
		}
	},
	server: {
		port: 5174,
	}
});
