// vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  envDir: "./",  // .env file ko location
  server: {
    port: 5173,
  },
  define: {
    'process.env.VITE_BACKEND_URL': JSON.stringify(process.env.VITE_BACKEND_URL)
  }
})