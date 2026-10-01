import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      // Local stand-in for the Render rewrite rule: /s/<token> -> backend /api/s/<token>
      '^/s/[A-Za-z0-9_-]+$': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/s\//, '/api/s/'),
      },
    },
  }
})