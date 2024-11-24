// vite.config.js
import { defineConfig } from "file:///D:/VueProject/CloudDisks/node_modules/vite/dist/node/index.js";
import vue from "file:///D:/VueProject/CloudDisks/node_modules/@vitejs/plugin-vue/dist/index.mjs";
import path, { resolve } from "path";
import AutoImport from "file:///D:/VueProject/CloudDisks/node_modules/unplugin-auto-import/dist/vite.js";
import DefineOptions from "file:///D:/VueProject/CloudDisks/node_modules/unplugin-vue-define-options/dist/vite.js";
var __vite_injected_original_dirname = "D:\\VueProject\\CloudDisks";
var vite_config_default = defineConfig({
  plugins: [
    vue(),
    AutoImport({
      imports: ["vue", "vue-router"],
      eslintrc: {
        enabled: true,
        // 生成 ESLint 配置
        filepath: "./.eslintrc-auto-import.json"
        // ESLint 配置文件路径
      },
      dts: true
      // 生成 TypeScript 声明文件
    }),
    DefineOptions()
    // 添加 DefineOptions 插件
  ],
  resolve: {
    alias: {
      "@": resolve(__vite_injected_original_dirname, "./src")
    }
  },
  server: {
    port: 9e3,
    /* host: '0.0.0.0', */
    open: true,
    proxy: {
      "/preview/avatar": {
        target: "http://192.168.96.132:9000/avatar",
        changeOrigin: true,
        rewrite: (path2) => path2.replace(/^\/preview\/avatar/, "")
      }
    }
  }
});
export {
  vite_config_default as default
};