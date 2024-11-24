import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path, { resolve } from 'path'
import AutoImport from 'unplugin-auto-import/vite';
import DefineOptions from 'unplugin-vue-define-options/vite';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(),
  AutoImport({
    imports: ['vue', 'vue-router'],
    eslintrc: {
      enabled: true, // 生成 ESLint 配置
      filepath: './.eslintrc-auto-import.json', // ESLint 配置文件路径
    },
    dts: true, // 生成 TypeScript 声明文件
    }),
    DefineOptions(), // 添加 DefineOptions 插件
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, './src')
    }
  },
  server: {
    port: 9000,
    /* host: '0.0.0.0', */
    open: true,
    proxy: {
      "/preview/avatar":{
        target: "http://192.168.96.132:9000/avatar",
        changeOrigin: true,
        rewrite: path => path.replace(/^\/preview\/avatar/, '')
      }
    }
  }
})
