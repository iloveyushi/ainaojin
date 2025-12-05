import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src') // 确保别名正确
    }
  },
  server: {
    port: 3000, // 前端端口
    open: true, // 启动后自动打开浏览器
    cors: true, // 允许跨域
    proxy: {
      // 代理所有/api开头的请求到后端
      '/api': {
        target: 'http://localhost:8080', // 后端地址
        changeOrigin: true, // 开启跨域
        rewrite: (path) => path.replace(/^\/api/, '') // 去掉/api前缀
      }
    }
  }
})
