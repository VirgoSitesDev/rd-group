import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom'],
          query: ['@tanstack/react-query'],
          styled: ['styled-components'],
          icons: ['react-icons'],
        },
      },
    },
  },
  server: {
    port: 3000,
    host: true,
    proxy: {
      '/api/multigestionale': {
        target: 'https://motori.multigestionale.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/multigestionale/, '/api/xml'),
        configure: (proxy, _options) => {
          proxy.on('error', (err, _req, _res) => {
          });
          proxy.on('proxyReq', (proxyReq, req, _res) => {
          });
          proxy.on('proxyRes', (proxyRes, req, _res) => {
          });
        },
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          'Accept': 'application/xml, text/xml, */*',
          'Cache-Control': 'no-cache'
        }
      }
    }
  },
  preview: {
    port: 3000,
    host: true,
  },
})