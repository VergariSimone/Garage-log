import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Ogni richiesta a /api/* viene inoltrata al server Hono
      '/api': 'http://localhost:3000',
    },
  },
})
