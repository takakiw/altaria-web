<template>
    <div class="navigation">
    <div class="container">
        <div class="logo" @click="$router.push('/files')">
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
            <el-menu-item index="0">
                <router-link to="/" class="menu-item">首页</router-link>
            </el-menu-item>
            <el-menu-item index="1">
                <router-link to="/files" class="menu-item">文件</router-link>
            </el-menu-item>
            <el-menu-item index="2">
                <router-link to="/notes" class="menu-item" >笔记</router-link>
            </el-menu-item>
            <el-menu-item index="3">
                <router-link to="/share" class="menu-item" >分享</router-link>
            </el-menu-item>
            </el-menu>
        </div>
        <div style="display: none;"><UploadFile ref="uploadFileRef" 
            :currentPid="currentPid" 
            @updateFileListAndSpace="updateFileListAndSpace" /></div>
        <div style="display: flex;align-items: center;gap: 10px;">
            <div v-if="userStore.isLogin" style="margin-top: 5px; cursor: pointer;">
                <el-popover
                placement="left-end"
                :width="600"
                trigger="click">
                    <template #reference>
                        <el-icon size="30px"><UploadFilled /></el-icon>
                    </template>
                    <div style="width: 100%; height: 300px; background-color: #f9f9f9; text-align: center;">
                        <span>上传任务</span>
                        <el-divider  />
                        <div style=" height: 90%;margin-top: 10px;">
                            <div class="upload-list">
                                <el-scrollbar class="infinite-list">
                                <div v-for="item in uploadFileRef?.uploadFileList" :key="item.uid" class="item">
                                    <div class="item-left">
                                    <div class="item-left-top">
                                        <div>{{ item.filename }}</div>
                                        <div v-if="item.status === STATUS.fail.value" style="color: red;">{{ item.errorMsg }}</div>
                                    </div>
                                    <el-progress :status="statusComponent(item.status)" :text-inside="true" :stroke-width="12" style="font-size: 11px;" :percentage="item.status !== STATUS.init.value? item.progress : 0" />
                                    </div>
                                    <div class="item-right">
                                    <div v-if="item.status === STATUS.fail.value" @click="retryUpload(item.uid)"> <!-- 上传失败，显示重试按钮 -->
                                        <el-icon class="item-icon"><Refresh class="item-icon"/></el-icon>
                                    </div>
                                    <div v-else-if="item.status === STATUS.init.value"> <!-- 计算md5，显示md5进度条 -->
                                        <el-progress :percentage="item.progress" :status="item.status == STATUS.fail.value? 'exception' : ''" :width="25" :stroke-width="2" type="circle" :show-text="false" />
                                    </div>
                                    <div v-else-if="item.status === STATUS.uploading.value && !item.pause" @click="pauseUpload(item.uid)"> <!-- 上传中，显示暂停按钮 -->
                                        <img src="@/assets/icon-image/stop.png" 
                                        alt="" 
                                        class="item-icon">
                                    </div>
                                    <div v-else-if="item.status === STATUS.uploading.value &&  item.pause" @click="continueUpload(item.uid)"> <!-- 暂停上传，显示继续按钮 -->
                                        <el-icon class="item-icon"><CaretRight class="item-icon"/></el-icon>
                                    </div>
                                    <div>
                                        <el-icon class="item-icon"><Close class="item-icon" @click="delList(item.uid)"/></el-icon>
                                    </div>
                                </div>
                            </div>
                            </el-scrollbar>
                        </div>
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
import {  ref, watch } from 'vue';
import {UploadFilled, CaretRight, Refresh, Close} from "@element-plus/icons-vue"
import UploadFile from '../pages/File/UploadFile.vue';
import { useUserStore } from '@/store';
import { useRoute } from 'vue-router';

const userStore = useUserStore();
const route = useRoute();
const activeIndex = ref("1");
watch(() => route.path, () => {
    // 包含首页
    if(route.path === '/'){
        activeIndex.value = "0";
    }
    // 包含files
    else if(route.path.includes('/files')){
        activeIndex.value = "1";
    }
    // 包含notes
    else if(route.path.includes('/notes')){
        activeIndex.value = "2";
    }
    // 包含share
    else if(route.path.includes('/share')){
        activeIndex.value = "3";
    }
    else{
        activeIndex.value = "-1";
    }
}, { immediate: true })

const uploadFileRef = ref(null); // submitSelect-选择文件, uploadFileList-上传文件列表, pauseUpload-暂停上传, continueUpload-继续上传, cancelUpload-取消上传, retryUpload-重试上传

const currentPid = ref("0");

const addFile = (pid) => {
    currentPid.value = String(pid);
    uploadFileRef.value.submitSelect();
}

const STATUS = {
  init: { value: 0, text: '计算md5' },
  uploading: { value: 1, text: '上传中' },
  success: { value: 2, text: '上传成功' },
  fail: { value: 3, text: '上传失败' },
  cancel: { value: 4, text: '取消上传' }
}

const statusComponent = (status) => {
  switch (status) {
    case STATUS.success.value:
      return'success'
    case STATUS.fail.value:
      return 'exception'
    default:
      return '' 
  }
}



// 暴露addFile方法
defineExpose({ addFile })

const props = defineProps({
    activeIndex:{
        type: Number,
        default: 1
    }
})
const handleSelect = (key, keyPath) => {
  console.log(key, keyPath)
}

const emit = defineEmits(['updateFileListAndSpace'])

const updateFileListAndSpace = () => {
  emit('updateFileListAndSpace')
}

// 暂停上传
const pauseUpload = (uid) => {
  uploadFileRef.value.pauseUpload(uid)
}

// 继续上传
const continueUpload = (uid) => {
  uploadFileRef.value.continueUpload(uid)
}

// 取消上传
const delList = (uid) => {
    uploadFileRef.value.cancelUpload(uid)
}

// 重试上传
const retryUpload = (uid) => {
  uploadFileRef.value.retryUpload(uid)
}


</script>

<style lang="scss" scoped>

$nav-height: 60px;


.navigation {
    min-width: 700px;
    display: flex;
    justify-content: center;
    height: $nav-height;
    margin-bottom: 10px;
    background-color: #ffffff;
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
        user-select: none; // 防止图片选中
        user-drag: none;
        -webkit-user-drag: none;
        -moz-user-select: none;
        -webkit-user-select: none;
        -ms-user-select: none;
    }
    span{
        opacity: 1;
        background: -webkit-linear-gradient(315deg, #00c8ff 25%, #0000ff);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
    }
    &:hover{
        cursor: pointer;
    }
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
  width: 25px;
  height: 25px;
  background-color: rgba(239, 239, 239, 0.4);
  border-radius: 50%;
  &:hover{
    cursor: pointer;
  }
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