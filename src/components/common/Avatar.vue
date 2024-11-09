<template>
    <div class="avatar">
        <div class="avatar-name avatar-item">
            <div @click="toLogin" v-if="!userStore.isLogin">登录</div>
            <div v-else>{{userStore.user.nickName}}</div>
        </div>
        <div class="avatar-icon avatar-item">
            <el-avatar v-if="!userStore.isLogin" :icon="UserFilled"/>
            <el-popover
                v-else
                placement="bottom-start"
                :width="250"
                trigger="click"
            >
                <template #reference>
                    <el-avatar v-if="!userStore.isLogin" :icon="UserFilled"/>
                    <div v-else>
                        <el-avatar
                            :icon="UserFilled"
                            :src=getAvatarUrl(userStore.getAvatar)
                        />
                    </div>
                </template>
                <div class="avatar-info">
                    <div class="container-box">
                        <el-avatar v-if="!userStore.isLogin" :icon="UserFilled"/>
                        <span>用户名:</span> {{userStore.user.userName}}
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
                        <div class="info-btn" @click="showSetup">设置</div>
                        <el-divider direction="vertical" />
                        <div class="info-btn" @click="logout">退出登录</div>
                    </div>
                </div>
            </el-popover>
        </div>
    </div>
   
        <UpSetDialog 
            :centerDialogVisible="centerDialogVisible" 
            :title="'设置'"
            @update:centerDialogVisible="closeDialog"/>
</template>

<script setup>
import { UserFilled } from '@element-plus/icons-vue'
import { useUserStore } from '../../store';
import {  useRouter } from 'vue-router';
import { onMounted, ref } from 'vue';
import UpSetDialog from './UpSetDialog.vue';
import { getAvatarUrl, getUserInfo } from '../../service/user';

const userStore = useUserStore()

const router = useRouter()

const centerDialogVisible = ref(false)

onMounted(() => {
    if (localStorage.getItem('token')){
    getUserInfo(-1).then(res => {
    if (res.code!== 200) {
        return;
    }
    userStore.setUserInfo(res.data);
    userStore.user.id = res.data.id;
    })
    }
})

const toLogin = () => {
    router.push('/login')
}

const logout = () => {
    localStorage.removeItem('token')
    userStore.resetUser()
    // 刷新页面
    window.location.reload()
}

const showSetup = () => {
    centerDialogVisible.value = true
}

const closeDialog = (flag) => {
    centerDialogVisible.value = flag
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
    white-space: nowrap;
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
    border-radius: 10px;
    display: flex;
    gap: 10px;
    align-items: center;
    width: 100%;
    padding: 10px;
    & span{ 
        font-weight: bold;
        width: 50px;
        text-align: right;
    }
}



.info-btn{
    font-weight: bold;width: 40%; 
    text-align: center;
    cursor: pointer;
}



</style>

<style>

.el-divider--horizontal{
    margin-top: 5px;
    margin-bottom: 0;
    width: 100%;
}

.el-popper.el-popper.is-light, .el-popper.is-light>.el-popper__arrow:before{
    background-color: #fcfdff;
    border-radius: 10px;
}

</style>
