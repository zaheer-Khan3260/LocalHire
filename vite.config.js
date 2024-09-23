import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    proxy: {
      '/api': {
        target: 'https://free-ap-south-1.cosmocloud.io/development', 
        changeOrigin: true,
       },
    },
  },
  plugins: [react()]
})
