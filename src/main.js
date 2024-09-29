import { createApp } from 'vue'
import App from './App.vue'
import router from '@/router'
import { createPinia } from 'pinia'
import "@/assets/scss/reset.scss"
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import 'element-plus/theme-chalk/dark/css-vars.css'
import "@arco-iconbox/vue-mars"
const app = createApp(App)


app.use(router)
app.use(createPinia())
app.use(ElementPlus)


app.mount('#app')
