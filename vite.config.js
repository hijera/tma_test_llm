import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  // Для GitHub Pages используйте название вашего репозитория
  // Замените 'your-repo-name' на реальное название репозитория
  base: process.env.NODE_ENV === 'production' ? '/tma_test_llm/' : './',
  build: {
    outDir: 'dist',
    assetsDir: 'assets'
  },
  server: {
    port: 3000,
    host: true
  }
}) 