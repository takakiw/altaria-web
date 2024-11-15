<template>
    <div class="navigation">
    <div class="container">
        <div class="logo" @click="$router.push('/')">
            <img src="@/assets/cloud.png" alt="logo">
            <span style="display: inline-block;">Altaria</span>
        </div>
        <div class="menu">
            <el-menu
                :default-active="activeIndex"
                class="el-menu-demo"
                mode="horizontal"
                :ellipsis="false"
                @select="handleSelect"
            >
            <el-menu-item index="1">
                <router-link to="/files" class="menu-item">首页</router-link>
            </el-menu-item>
            <el-menu-item index="2">
                分享信息
            </el-menu-item>
            </el-menu>
        </div>        
        <div>
            <Avatar />
        </div>
    </div>
    </div>
    <el-divider style="margin-top: -10px;" />
</template>

<script setup>
import Avatar from '@/components/common/Avatar.vue';
import { onMounted, ref } from 'vue';

const activeIndex = ref("2");


const handleSelect = (key, keyPath) => {
  console.log(key, keyPath)
}

</script>

<style lang="scss" scoped>

$nav-height: 60px;


.navigation {
    min-width: 60%;
    display: flex;
    justify-content: center;
    height: $nav-height;
    margin-bottom: 10px;
}

.container {
    width: 60%;
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


.upload-list{
  width: 100%;
  height: 100%;
  font-family: Inter, 'Helvetica Neue', Helvetica, 'PingFang SC',
  'Hiragino Sans GB', 'Microsoft YaHei', '微软雅黑', Arial, sans-serif;
  color: #6b7785;
  font-size: 14px;
}

.infinite-list{
  height: 100%;
  width: 100%;
  justify-content: center;
  align-items: center;
  display: flex;
  flex-direction: column;
}

.item{
  width: 100%; 
  display: flex;
  align-items: center;
  margin-bottom: 10px;
  padding: 10px;
  margin: 0 15px;
  gap: 15px;
  border-bottom: 1px solid #d6d3d3;
  background-color: #ffffff;
  border-radius: 15px;
}
.item-left{
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.item-left-top{
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.item-right{
  display: flex;
  align-items: center;
  gap: 20px;
}
.item-icon{
  cursor: pointer; 
  width: 25px;
  height: 25px;
  background-color: rgba(239, 239, 239, 0.4);
  border-radius: 50%;
}

.item-left .el-progress--line {
  margin-bottom: 15px;
  width: 400px;
  background-color: #ffffff;
}

.infinite-list .el-scrollbar__wrap--hidden-default{
    width: 100%;
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
.el-scrollbar__wrap{
    width: 100%;
  }
</style>