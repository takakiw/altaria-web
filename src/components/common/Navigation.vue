<template>
    <div class="navigation">
    <div class="container">
        <div class="logo">
            <img src="/public/cloud.png" alt="logo">
            <span style="display: inline-block;">Altaria</span>
        </div>
        <div class="menu">
            <el-menu
                :default-active="`${props.activeIndex}`"
                class="el-menu-demo"
                mode="horizontal"
                :ellipsis="false"
                @select="handleSelect"
            >
            <el-menu-item index="1">
                <router-link to="/files" class="menu-item">文件</router-link>
            </el-menu-item>
            <el-menu-item index="2">
                <router-link to="/notes" class="menu-item" >笔记</router-link>
            </el-menu-item>
            <el-menu-item index="3">
                <router-link to="#" class="menu-item" >分享</router-link>
            </el-menu-item>
            <el-menu-item index="4">
                <router-link to="#" class="menu-item" >消息</router-link>
            </el-menu-item>
            <el-menu-item index="5">
                <router-link to="#" class="menu-item">GPT</router-link>
            </el-menu-item>
            <el-menu-item index="6">
                <router-link to="#" class="menu-item">工具</router-link>
            </el-menu-item>
            </el-menu>
            <div class="search">
                <el-input
                    v-model="searchText"
                    style="width: 240px"
                    placeholder="search..."
                    :prefix-icon="Search"
                    />
            </div>
        </div>
        <div style="display: flex;align-items: center;gap: 10px;">
            <div v-if="userStore.isLogin" style="margin-top: 5px; cursor: pointer;">
                <el-popover
                placement="left-end"
                :width="600"
                trigger="click"
            >
                <template #reference>
                    <el-icon size="30px"><UploadFilled /></el-icon>
                </template>
                <div style="width: 100%; height: 300px; background-color: #f9f9f9; text-align: center;">
                    <span>上传任务</span>
                    <div style=" height: 90%;margin-top: 10px;">
                        <span v-for="(item, index) in uploadList" :key="index">
                            {{item}}
                        </span>
                    </div>
                </div>
            </el-popover>
            </div>
            <div>
                <Avatar />
            </div>
            
        </div>
    </div>
    </div>
    <el-divider style="margin-top: -10px;" />
</template>

<script setup>
import Avatar from './Avatar.vue';
import {  defineProps, ref } from 'vue';
import { Search, UploadFilled } from '@element-plus/icons-vue';
import { onMounted } from 'vue';
import { useUserStore } from '@/store';

const userStore = useUserStore();

const uploadList = ref([]);

onMounted(() => {  
    console.log('onMounted to Navigation.vue');
})

const add = (file) => {
  uploadList.value.push(file);
}

// 暴露add方法
defineExpose({ add })

const props = defineProps({
    activeIndex:{
        type: Number,
        default: 1
    }
})
const searchText = ref('');
const handleSelect = (key, keyPath) => {
  console.log(key, keyPath)
}


</script>

<style lang="scss" scoped>

$nav-height: 60px;


.navigation {
    min-width: 1300px;
    display: flex;
    justify-content: center;
    height: $nav-height;
    margin-bottom: 10px;
}

.container {
    width: 80%;
    min-width: 800px;
    display: flex;
    justify-content: space-between;
}

.logo{
    align-items: center;
    display: flex;
    font-size: 30px;
    img{
        height: $nav-height;
    }
    span{
        opacity: 1;
        background: -webkit-linear-gradient(315deg, #2608a0 25%, #14e22f);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
    }
    cursor: pointer;
}

.menu{
    margin: 20px 40px;
    flex: 1;
    display: flex;
    align-items: center;
}




.search{
    margin-left: 40px;
    margin-top: 5px;
    input{
        padding: 5px;
        border-radius: 25px;
        border-color: aliceblue;
        font-size: 18px;
        width: 200px;
        margin-top: 5px;
    }
}

</style>

<style>
.is-active{
    width: none;
}

.el-menu--horizontal {
  --el-menu-horizontal-height: 60px;
}
.el-divider--horizontal{
    margin-top: 0;
}
</style>