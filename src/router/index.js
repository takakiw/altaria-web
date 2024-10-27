import component from "element-plus/es/components/tree-select/src/tree-select-option.mjs"
import { createRouter, createWebHashHistory } from "vue-router"

export const routes = [
    {
        path: "/",
        redirect: "/files"
    },
    {
        path: "/files",
        component: () => import("@/layout/index.vue"),
        children: [
            {
                path: "",
                component: () => import("@/views/file/Files.vue")
            }
        ]
    },
    {
        path: "/notes",
        component: () => import("@/layout/index.vue"),
        children: [
            {
                path: "",
                component: () => import("@/views/note/index.vue")
            }
        ]
    },
    {
        path: "/login",
        component: () => import("@/views/login/Login.vue")
    }
]

const router = createRouter({
    routes,
    history: createWebHashHistory(),
})

export default router