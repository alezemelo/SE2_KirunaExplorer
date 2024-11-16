import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  server: process.env.RUNNING_ON_DOCKER ?{
    host: '0.0.0.0',
    port: 5173,
  } : undefined,
  plugins: [react()],
})
