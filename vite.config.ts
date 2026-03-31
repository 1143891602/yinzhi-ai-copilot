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
  server: {
    port: 3000,
    proxy: {
      '/api-proxy': {
        target: 'https://vpsairobot.com',
        changeOrigin: true,
        rewrite: (p) => p.replace(/^\/api-proxy/, ''),
        secure: false,
        configure: (proxy) => {
          proxy.on('proxyReq', (proxyReq) => {
            // Override host headers
            proxyReq.setHeader('host', 'vpsairobot.com')
            proxyReq.setHeader('origin', 'https://vpsairobot.com')
            proxyReq.setHeader('referer', 'https://vpsairobot.com/')
            proxyReq.setHeader('user-agent', 'curl/7.88.1')

            // Remove all browser-specific headers that Cloudflare WAF blocks
            const browserHeaders = [
              'sec-fetch-site',
              'sec-fetch-mode',
              'sec-fetch-dest',
              'sec-fetch-user',
              'sec-ch-ua',
              'sec-ch-ua-mobile',
              'sec-ch-ua-platform',
              'upgrade-insecure-requests',
              'cookie',
              'dnt',
            ]
            browserHeaders.forEach((h) => proxyReq.removeHeader(h))
          })
        },
      },
    },
  },
})
