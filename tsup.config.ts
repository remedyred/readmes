import {defineConfig} from 'tsup'

export default defineConfig({
	// bundle: false,
	entry: ['src/index.ts'],
	clean: true,
	splitting: false,
	format: ['esm'],
	external: [],
	outDir: './dist',
	outExtension() {
		return {js: '.js'}
	}
})
