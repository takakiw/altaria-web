import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path, { resolve } from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue({
    template: {
      compilerOptions: {
        // 将 'a-link' 排除为自定义元素
        isCustomElement: tag => tag === 'a-link'
      }
    }
  })
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, './src')
    }
  },
  server: {
    port: 9000,
    host: '0.0.0.0',
    open: true,
    proxy: {
      '/api/v1': {
        target: 'http://localhost:8082',
        changeOrigin: true,
        rewrite: path => path.replace(/^\/api\/v1/, '')
      },
      "/preview/avatar":{
        target: "http://192.168.96.132:9000/avatar",
        changeOrigin: true,
        rewrite: path => path.replace(/^\/preview\/avatar/, '')
      }
    }
  }
})
