import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import { nodePolyfills } from 'vite-plugin-node-polyfills';

export default defineConfig({
	plugins: [
		sveltekit(),
		nodePolyfills({
			// Whether to polyfill `node:` protocol imports.
			protocolImports: true,
			// Whether to polyfill specific globals.
			globals: {
				Buffer: true,
				global: true,
				process: true,
			},
		})
	],
	optimizeDeps: {
		include: ['@solana/web3.js', '@solana/spl-token', 'axios'],
		esbuildOptions: {
			target: 'esnext',
			// Node.js global to browser globalThis
			define: {
				global: 'globalThis'
			}
		}
	},
	build: {
		target: 'esnext',
		commonjsOptions: {
			transformMixedEsModules: true
		}
	}
});
