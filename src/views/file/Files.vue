<template>
  <Container style="margin-top: 10px;">
    <!-- <el-empty description="description" /> -->
     <div class="left-container">
      <div class="left-top">
      <el-menu
        :default-active="`${menuIndex}`"
        class="menu-vertical"
        @select="handleSelect"
      >
        <el-menu-item index="1">
          <el-icon><icon-menu /></el-icon>
          <span>全部</span>
        </el-menu-item>
        <el-menu-item index="2">
          <el-icon><Picture /></el-icon>
          <span>图片</span>
        </el-menu-item>
        <el-menu-item index="3">
          <el-icon><VideoPlay /></el-icon>
          <span>视频</span>
        </el-menu-item>
        <el-menu-item index="4">
          <el-icon><Headset /></el-icon>
          <span>音频</span>
        </el-menu-item>
        <el-menu-item index="5">
          <el-icon><Document /></el-icon>
          <span>文档</span>
        </el-menu-item>
        <el-menu-item index="6">
          <el-icon><Delete /></el-icon>
          <span>回收站</span>
        </el-menu-item>
        
      </el-menu>
      </div>
      <div class="left-bottom">
          <div style="width: 100%; padding: 10px;">
            <el-progress :percentage="50" />
          </div>
          <span style="width: 100%;">100MB/200MB</span>
      </div>
     </div>
     <div class="right-container">
      <div class="right-top">
        <div class="controls">
          <div class="buttons">
            <el-button plain :disabled="false" type="primary" round @click="addFile">上传</el-button>
            <el-button plain :disabled="menuIndex != 1" type="success" round>新建文件夹</el-button>
            <el-button plain :disabled="fileItemRef?.activeFiles.length == 0" type="info" round>分享</el-button>
            <el-button plain :disabled="fileItemRef?.activeFiles.length == 0" type="warning" round>移入回收站</el-button>
            <el-button plain :disabled="fileItemRef?.activeFiles.length == 0" type="danger" round>删除</el-button>
          </div>
          <div class="search">
                <el-input
                    v-model="searchText"
                    style="width: 240px"
                    placeholder="search..."
                    :prefix-icon="Search"/></div>
        </div>
        <div class="file-path">
          <div v-if="menuIndex == 1 && pathList.length != 0" class="file-path">
            <div v-for="(item, index) in pathList" :key="index">
              <div class="path-item" @click="getFileByPath(index)"> >{{item}}</div>
            </div>
          </div>
          <span v-else>全部文件</span>
        </div>
      </div>
      <el-divider></el-divider>
      <div class="right-content">
        <div v-if="files.length === 0">
          <el-empty description="暂无文件">

          </el-empty>
        </div>
        <FileItem v-else ref="fileItemRef" 
        :files="files"
        @update:fileChecked="updateFileChecked"
        @activeAll="activeAll"
        @cancelAll="cancelAll"
        @removeFile="removeFile"/>
      </div>
     </div>
  </Container>
</template>

<script setup>
import Container from '@/components/common/Container.vue'
import FileItem from '../../components/pages/File/FileItem.vue';
import {
  Menu as IconMenu,
  Picture,
  Share,
  Delete,
  VideoPlay,
  Headset,
  Document,
  Search,
} from '@element-plus/icons-vue'

import { reactive, ref } from 'vue';

const menuIndex = ref(1)
const searchText = ref('')

const handleSelect = (index) => {
  menuIndex.value = index
  console.log(menuIndex.value);
}

const fileItemRef = ref(null) // 用于获取选中的文件
const pathList = reactive(["全部文件", "我的文档", "我的图片", "我的视频", "我的音乐"])
const files = reactive([])
for (let i = 0; i < 100; i++) {
  files.push({
      name: `文件${i}` + `.${Math.random(100000000000000000000000)}` + `.txt`,
      size: `${Math.floor(Math.random() * 10000) / 100}KB`,
      type: i % 9,
      checked: false,
      createTime: '2022/01/01 12:00:00',
      cover: i %10 == 0 ? "https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png" : undefined,
  })
}


const getFileByPath = (index) => {
  console.log(index);
  console.log(pathList[index]);
}

const emit = defineEmits(['add'])

const addFile = () => {
  emit('add', 1)
}


const updateFileChecked = (index, flag) => {
  files[index].checked = flag  
}

const activeAll = () => {
  for (let i = 0; i < files.length; i++) {
    files[i].checked = true
  }
}

const cancelAll = () => {
  for (let i = 0; i < files.length; i++) {
    files[i].checked = false
  }
}

const removeFile = (index) => {
  files.splice(index, 1)
}

</script>

<style lang="scss" scoped>

.scrollbar-demo-item {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 50px;
  margin: 10px;
  text-align: center;
  border-radius: 4px;
  background: var(--el-color-primary-light-9);
  color: var(--el-color-primary);
}

.left-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  height: 100%;
  width: 180px;
}

.left-top{
  display: flex;
  flex-direction: column;
  height: 60%;
  width: 100%;
  gap: 10px;
  min-height: 360px;
}

.menu-vertical{
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  .el-menu-item{
    width: 80%;
  }
}

.left-bottom{
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-direction: column;
  justify-content: center;
  height: 70px;
  width: 100%;
  font-family: Inter, 'Helvetica Neue', Helvetica, 'PingFang SC',
  'Hiragino Sans GB', 'Microsoft YaHei', '微软雅黑', Arial, sans-serif;
  color: #6b7785;
  font-size: 14px;
  padding: 0 5px;
}

.right-container{
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100%;
}

.right-top{
  font-family: Inter, 'Helvetica Neue', Helvetica, 'PingFang SC',
  'Hiragino Sans GB', 'Microsoft YaHei', '微软雅黑', Arial, sans-serif;
  color: #6b7785;
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 70px;
  gap: 10px;
  .controls{
    padding-left: 10px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: calc(100% - 10px);
    height: 30px;
    gap: 20px;
    .buttons{
      display: flex;
      gap: 10px;
      .el-button{
        width: 100px;
        height: 30px;
      }
    }
    
  }

  .file-path{
    display: flex;
    padding-left: 10px;
    width: calc(100% - 10px);
    height: 30px;
    gap: 10px;
  }
  .path-item{
    color: #409eff;
    font-size: 16px;
    cursor: pointer;
  }
}




.right-content{
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 90%;
}

</style>

<style>
.is-active{
    width: none;
}

</style>