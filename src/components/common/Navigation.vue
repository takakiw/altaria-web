<template>
    <div class="navigation">
    <div class="container" :style="{width: `${props.width}%`}">
        <div class="logo">
            <img src="/public/cloud.png" alt="logo">
            <span style="display: inline-block;">Altaria</span>
        </div>
        <div class="menu">
            <div>
                <router-link to="#" class="menu-item">文件</router-link>
                <router-link to="#" class="menu-item">笔记</router-link>
                <router-link to="#" class="menu-item">消息</router-link>
                <router-link to="#" class="menu-item">回收站</router-link>
                <router-link to="#" class="menu-item">GPT</router-link>
                <router-link to="#" class="menu-item">工具</router-link>
            </div>
            <div class="search">
                <el-input
                    v-model="searchText"
                    style="width: 240px"
                    placeholder="search..."
                    :prefix-icon="Search"
                    />
            </div>
        </div>
        <div class="avatar">
            <Avatar />
        </div>
    </div>
    </div>
</template>

<script setup>
import Avatar from './Avatar.vue';
import { defineProps, ref } from 'vue';
import { Search } from '@element-plus/icons-vue';


const props = defineProps({
    width:{
        type: Number,
        default: 90
    }
})

const searchText = ref('');

</script>

<style lang="scss" scoped>

$nav-height: 60px;


.navigation {
    min-width: 1300px;
    display: flex;
    justify-content: center;
    height: $nav-height;
}

.container {
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

.menu-item{
    text-decoration: none;
    padding: 5px 25px;
    transition: all 0.3s ease;
    cursor: pointer;
}

.menu-item:hover{
    background-color: #f2f2f2;
    border-radius: 25px;
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