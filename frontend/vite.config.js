import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const proxy = { '/api': env.API_PROXY_TARGET || 'http://localhost:3000' }
  return {
    plugins: [react()],
    build: { assetsDir: 'bundles' },
    server: { port: 5173, proxy },
    preview: { proxy },
  }
})
