import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import pageTypes from 'vite-plugin-page-types'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), pageTypes({ include: ['src/pages/history/index.tsx', 'src/pages/profile/index.tsx'], exclude: ['**/components/**'] })],
})
