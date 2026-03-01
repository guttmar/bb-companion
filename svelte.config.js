import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: vitePreprocess(),

	kit: {
		serviceWorker: {
			register: false
		},
		adapter: adapter({
			pages: 'build',
			assets: 'build',
			fallback: undefined
		}),

		paths: {
			base: process.env.NODE_ENV === 'production' ? '/bb-companion' : ''
		},

		prerender: {
			// allow 404s (for example links to "/" when a base path is set)
			handleHttpError: ({ status }) => {
				if (status === 404) {
					return { status }; // suppress the build-time error
				}
			}
		}
	}
};

export default config;
