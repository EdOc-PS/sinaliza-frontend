import { defineConfig } from 'vite'
import { fileURLToPath, URL } from 'node:url'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(),],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      '@components': fileURLToPath(new URL('./src/components', import.meta.url)),
      '@routes': fileURLToPath(new URL('./src/config/api/apiRoutes', import.meta.url)),
      '@requests': fileURLToPath(new URL('./src/config/api/requests', import.meta.url)),
      '@context': fileURLToPath(new URL('./src/config/context', import.meta.url)),
      '@interfaces': fileURLToPath(new URL('./src/lib/interfaces/genericInterfaces.ts', import.meta.url)),
      '@pages': fileURLToPath(new URL('./src/pages', import.meta.url)),
      '@api': fileURLToPath(new URL('./src/config/api', import.meta.url)),
    },
  },
})
