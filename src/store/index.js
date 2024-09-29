import { defineStore } from 'pinia'
import { computed, reactive, ref } from 'vue'


export const useUserStore = defineStore('user', () => {
    const user = reactive({
        "id": 0,
        "nickName": '',
        "userName": '',
        "avatar": '',
        "email": '',
        "role": 0
    })

    const isLogin = computed(() => {
        return user.id!== 0;
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

    return {user, isLogin, resetUser, setAvatar}
})