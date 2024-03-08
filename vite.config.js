import { defineConfig } from 'vite'
import preact from '@preact/preset-vite'
import browserslistToEsbuild from 'browserslist-to-esbuild'
import path from 'path'
import { ViteMinifyPlugin } from 'vite-plugin-minify'
import { VitePWA } from 'vite-plugin-pwa'


// https://vitejs.dev/config/
export default defineConfig({
	plugins: [
		preact(),
		ViteMinifyPlugin({}),
		VitePWA({
			registerType: 'autoUpdate',
			injectRegister: 'inline',
			workbox: {
				sourcemap: true,
			},
			manifest: {
				name: 'Annona',
				short_name: 'Annona',
				description: 'Grocery shopping. Simplified.',
				theme_color: '#FFFF99',
				icons: [
					{
						src: 'pwa-64x64.png',
						sizes: '64x64',
						type: 'image/png',
					},
					{
						src: 'pwa-192x192.png',
						sizes: '192x192',
						type: 'image/png',
					},
					{
						src: 'pwa-512x512.png',
						sizes: '512x512',
						type: 'image/png',
					},
					{
						src: 'pwa-512x512.png',
						sizes: '512x512',
						type: 'image/png',
						purpose: 'maskable',
					},
				],
			},
		})
	],
	build: {
		target: browserslistToEsbuild(),
	},
	resolve: {
		alias: {
			'@': path.resolve( __dirname, 'src' ),
		},
	},
})
