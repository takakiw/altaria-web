import { createApp } from 'vue'
import App from './App.vue'
import router from '@/router'
import { createPinia } from 'pinia'

// 引入element-plus
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import "@/assets/scss/reset.scss"

// 视频组件
import { videoPlay } from "vue3-video-play/dist/index.mjs"; // 引入组件 
import 'vue3-video-play/dist/style.css' // 引入css 

// 音频组件
// 全局引入


const app = createApp(App)

app.use(router)
app.use(createPinia())
app.use(ElementPlus)
app.use(videoPlay)

app.mount('#app')
