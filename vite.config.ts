import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { viteSingleFile } from 'vite-plugin-singlefile'

export default defineConfig({
  plugins: [react(), viteSingleFile()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    // 单文件模式必须关闭 cssCodeSplit
    cssCodeSplit: false,
    assetsInlineLimit: 100000000,
  },
  server: {
    port: 3000,
  },
})
