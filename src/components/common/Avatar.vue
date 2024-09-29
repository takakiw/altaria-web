<template>
    <div class="avatar">
        <div class="avatar-name avatar-item">
            <div @click="toLogin" v-if="!userStore.isLogin">登录</div>
            <div v-else>{{userStore.user.userName}}</div>
        </div>
        <div class="avatar-icon avatar-item">
<!--             <el-avatar v-if="!userStore.isLogin" :icon="UserFilled"/>
 -->            <el-popover
                placement="bottom-start"
                :width="250"
                trigger="click"
            >
                <template #reference>
                    <el-avatar v-if="!userStore.isLogin" :icon="UserFilled"/>
                </template>
                <div class="avatar-info">
                    <div class="container-box">
                        <el-avatar v-if="!userStore.isLogin" :icon="UserFilled"/>
                        <div><span>用户名:</span> {{userStore.user.userName}}</div>
                    </div>
                    <div class="container-box">
                       <span>昵称: </span>{{ userStore.user.nickName }}
                    </div>
                    <div class="container-box">
                        <span>邮箱: </span> {{ userStore.user.email }}
                    </div>
                    <div class="container-box">
                        <span>角色: </span>{{ userStore.getRoleName }}
                    </div>
                    <el-divider />
                    <div class="container-box" style="justify-content: space-around; margin-bottom: 0;">
                        <div style="font-weight: bold;width: 40%; text-align: center;">设置</div>
                        <el-divider direction="vertical" />
                        <div style="font-weight: bold; width: 40%;text-align: center;">退出登录</div>
                    </div>
                </div>
            </el-popover>
            
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

.avatar-info{
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    padding: 0 15px;
    gap: 5px;
}
.avatar-info .container-box{
    border: 1px solid #dfdcdc;
    border-radius: 4px;
    display: flex;
    gap: 10px;
    align-items: center;
    width: 100%;
    padding: 10px;
    & span{ 
        font-weight: bold;
    }
}

.el-divider--horizontal{
    margin-top: 5px;
    margin-bottom: 0;
    width: 100%;
}

</style>
