import typescript from '@rollup/plugin-typescript'
import { defineConfig } from 'rollup'

export default defineConfig({
  input: './src/index.ts',
  output: [
    {
      format: 'esm',
      file: './dist/index.mjs',
    },
    {
      format: 'cjs',
      file: './dist/index.js',
    },
  ],
  plugins: [typescript(
    {
      compilerOptions: {
        declaration: false,
        declarationDir: undefined,
      },
    },
  )],
})
