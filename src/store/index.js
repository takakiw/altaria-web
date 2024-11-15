import { defineStore } from 'pinia'
import { computed, reactive, ref } from 'vue'

export const useSpaceStore = defineStore('space', () => {
    const space = reactive({
        useSpace: 0, // 已使用空间
        totalSpace: 0, // 总空间
        noteCount: 0, // 笔记数量
        fileCount: 0 // 文件数量
    })
})


export const useUserStore = defineStore('user', () => {

    const roleList = reactive([
        { id: 0, name: '普通用户' },
        { id: 1, name: '管理员' }
    ])

    const user = reactive({
        "id": 0,
        "nickName": '未登录',
        "userName": '',
        "avatar": '',
        "email": '',
        "role": 0
    })

    const isLogin = computed(() => {
        return user.id > 0
    })

    const getAvatar = computed(() => {
        return user.avatar
    })

    const resetUser = () => {
        user.id = 0;
        user.nickName = '';
        user.userName = '';
        user.avatar = '';
        user.email = '';
        user.role = 0;    
    }

    const setAvatar = (avatar) => {
        user.avatar = avatar
    }

    const setUserInfo = (data) => {
        user.id = data.id
        user.nickName = data.nickName
        user.userName = data.userName
        user.email = data.email
        user.role = data.role
        user.avatar = data.avatar
    }

    const getRoleName = computed(() => {
        return user.role === 1? '管理员' : '普通用户'
    })

    return {user, isLogin,setUserInfo, getAvatar, resetUser, setAvatar, getRoleName, roleList}
})