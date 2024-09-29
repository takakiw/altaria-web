import { createRouter, createWebHashHistory } from "vue-router"

export const routes = [
    {
        path: "/",
        redirect: "/home"
    },
    {
        path: "/home",
        component: () => import("@/views/Home.vue")
    },
    {
        path: "/login",
        component: () => import("@/views/Login.vue")
    }
]

const router = createRouter({
    routes,
    history: createWebHashHistory(),
})

export default router