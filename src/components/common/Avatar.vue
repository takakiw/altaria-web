<template>
    <div class="avatar">
        <div class="avatar-name avatar-item">
            <div @click="toLogin">{{ userStore.user.name ? userStore.user.name : "登录" }}</div>
        </div>
        <div class="avatar-icon avatar-item">
            <el-avatar v-if="userStore.user.avatar === ''" :icon="UserFilled"/>
            <el-avatar v-else :src=userStore.user.avatar />
        </div>
    </div>
</template>

<script setup>
import { UserFilled } from '@element-plus/icons-vue'
import { useUserStore } from '../../store';
import { useRoute, useRouter } from 'vue-router';

const userStore = useUserStore()

const route = useRoute()
const router = useRouter()

const toLogin = () => {
    router.push('/login')
}


</script>

<style lang="scss" scoped>

.avatar{
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
}
.avatar-item{
    padding: 10px;
    cursor: pointer;
}

.avatar-name{
    
}
</style>