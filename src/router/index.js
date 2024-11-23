import component from "element-plus/es/components/tree-select/src/tree-select-option.mjs";
import { createRouter, createWebHistory } from "vue-router"

export const routes = [
    {
        path: "/",
        component: () => import("@/layout/index.vue"),
        children: [
            {
                path: "",
                component: () => import("@/views/home/home.vue")
            }
        ]
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
                component: () => import("@/views/note/note.vue")
            }
        ]
    },{
        path: "/note/edit",
        component: () => import("@/views/note/NoteEditor.vue")  
    },{
        path: "/note/edit/:noteId",
        component: () => import("@/views/note/NoteEditor.vue")
    },{
        path: "/note/:noteId", 
        component: () => import("@/views/note/NoteDetail.vue")
    },
    {
        path: "/share",
        component: () => import("@/layout/index.vue"),
        children: [
            {
                path: "",
                component: () => import("@/views/share/Share.vue")
            }
        ]
    },
    {
        path: "/login",
        component: () => import("@/views/login/Login.vue") 
    },
    {
        path: "/shareDetail/:shareId",
        component: () => import("@/views/share/ShareDetail.vue")
    },
    {
        
    },
    {
        path: '/:pathMatch(.*)',
        component: () => import("@/views/NotFound.vue")
    }
]
const router = createRouter({
    routes,
    history: createWebHistory()
})

router.beforeEach((to, from, next) => {
    if (to.path === "/login"){
        localStorage.setItem('redirectPath', from.path); // 记录跳转前的页面
    }
    if (to.path === "/login" && localStorage.getItem("redirectPath") === "/login"){
        localStorage.removeItem("redirectPath");
    }
    next();
});

export default router