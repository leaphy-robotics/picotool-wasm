import { defineConfig } from 'tsup'
import replace from 'esbuild-plugin-replace-regex'

export default defineConfig({
    target: 'es2020',
    format: ['cjs', 'esm'],
    splitting: false,
    sourcemap: true,
    clean: true,
    dts: true,
    esbuildOptions(options) {
        if (!options.define) options.define = {}
        options.define['import.meta'] = '{}'
    },
    esbuildPlugins: [
        replace({
            patterns: [
                [/ENVIRONMENT_IS_NODE(?!=)/g, 'false'],
            ]
        })
    ]
})
