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
            <el-progress :percentage="percentage" />
          </div>
          <span style="width: 100%;">{{sizeToStandard(useSpace)}}/{{ sizeToStandard(totalSpace) }}</span>
      </div>
     </div>
     <div class="right-container">
      <div class="right-top">
        <div class="controls">
          <div class="buttons">
            <el-button plain :disabled="false" type="primary" round @click="addFile">上传</el-button>
            <el-button plain :disabled="menuIndex != 1" type="success" round @click="addFolder">新建文件夹</el-button>
            <el-button plain @click="shareFile" :disabled="fileItemRef == null || fileItemRef?.activeFiles?.length == 0" type="info" round>分享</el-button>
            <el-button plain @click="recycleFile" :disabled="fileItemRef == null || fileItemRef?.activeFiles?.length == 0" type="warning" round>移入回收站</el-button>
            <el-button plain @click="RemoveFile" :disabled="fileItemRef == null || fileItemRef?.activeFiles?.length == 0" type="danger" round>删除</el-button>
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
              <div class="path-item" @click="getFileByPath(index)"> >{{item.fileName}}</div>
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
        @updateData="updateData"
        @cdDir="cdDir"/>
      </div>
     </div>
     <el-dialog
        v-model="addFolderShow"
        title="新建文件夹"
        width="200"
        :show-close="false"
        :center="true"
      >
        <template #footer>
          <div class="create-folder">
            <img :src="getIconImage(IconImageEnum[0])" alt="" style="width: 72px; height: 72px;"/>
            <el-input v-model="folderName" placeholder="请输入文件夹名称" style="width: 60%;"></el-input>
            <div class="create-folder-btn">
              <el-button type="primary"  @click="createFolder">确定</el-button>
              <el-button type="default"  @click="addFolderShow = false">取消</el-button>
            </div>
          </div>
        </template>
      </el-dialog>

     
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
  RemoveFilled,
} from '@element-plus/icons-vue'

import { onMounted, reactive, ref } from 'vue';
import IconImageEnum, { getIconImage } from '../../enums/IconImageEnum';
import { useUserStore } from '../../store';
import { getFileList, getFilePath } from '../../service/file';
import { ElMessage } from 'element-plus';
import { getSpaceInfo } from '../../service/space';
import { sizeToStandard } from '../../utils/StandardData';

const userStore = useUserStore()
const menuIndex = ref(1)
const searchText = ref('')
const fileItemRef = ref(null) // 用于获取选中的文件
const pathList = reactive([])
const files = reactive([])

const addFolderShow = ref(false)

const addFolder = () => {
  console.log("新建文件夹");
  addFolderShow.value = true
  console.log(addFolderShow.value);
}

const useSpace = ref(0)
const totalSpace = ref(0)
const percentage = ref(0)

getSpaceInfo().then(res => {
  if(res.code == 200){
    useSpace.value = res.data.useSpace
    totalSpace.value = res.data.totalSpace
    percentage.value = Number(((useSpace.value / totalSpace.value) * 100).toFixed(2))
  }else{
    ElMessage.error(res.msg)
  }
}).catch(err => {
  console.log(err);
})

const handleSelect = (index) => {
  menuIndex.value = index
  files.splice(0)
  // 获取文件列表
  //1 所有 2 图片 3 视频 4 音频 5 文档 6 回收站
  if(index == 1){
    const pathId = pathList.length > 0 ? pathList[pathList.length - 1].id : "00"
    console.log("pathId", pathId);
    getFileList(pathId, undefined, undefined, undefined).then(res => {
      if(res.code == 200){
        files.splice(0)
        res.data.records.forEach(item => {
          files.push({ ...item})
        })
      }else{
        ElMessage.error(res.msg)
      }
    }).catch(err => {
      console.log(err)
      ElMessage.error('获取文件列表失败')
    })
  }else{
    getFileList(undefined, index - 1, undefined, undefined).then(res => {
      if(res.code == 200){
        files.splice(0)
        res.data.records.forEach(item => {
          files.push({ ...item})
        })
      }else{
        ElMessage.error(res.message)
      }
    }).catch(err => {
      console.log(err)
      ElMessage.error('获取文件列表失败')
    })
  }
}


const folderName = ref('')
const createFolder = () => {
  console.log(folderName.value);
  addFolderShow.value = false
}

  if(localStorage.getItem('token')){
  // 获取pathList的最后一项
  const pathId = pathList.length > 0 ? pathList[pathList.length - 1].id : "0"
  console.log(pathId);
  console.log(pathList);
  
  
  getFilePath(pathId).then(res => {
    console.log(res);
    if(res.code == 200){
      pathList.splice(pathList.length - 1, 1)
      pathList.push(...res.data)
      // 获取文件列表
      getFileList(pathId, undefined, undefined, undefined).then(res => {
        if(res.code == 200){
          files.splice(0)
          res.data.records.forEach(item => {
            files.push({ ...item})
          })
        }else{
          ElMessage.error(res.msg)
        }
      }).catch(err => {
        console.log(err)
        ElMessage.error('获取文件列表失败')
      })
    }else{
      ElMessage.error(res.message)
    }
  }).catch(err => {
    console.log(err)
    ElMessage.error('获取文件路径失败')
  })
}


const getFileByPath = (index) => {
  console.log(index);
  console.log(pathList[index]);
}

const shareFile = () => {
  console.log("分享文件");
  console.log(fileItemRef.value.activeFiles);
  
}
const recycleFile = () => {
  console.log("移入回收站");
  console.log(fileItemRef.value.activeFiles);
}

const RemoveFile = () => {
  console.log("删除文件");
  console.log(fileItemRef.value.activeFiles);
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

const updateData = () => {
  // todo 刷新数据
  console.log("刷新数据");
  // 更改files,使子组件重新渲染
  files.splice(0, files.length)
  
}

const cdDir = (e) => {
  console.log(e);
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
    // 文字高度
    line-height: 30px;
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
  width: 100%;
  height: 90%;
}

.create-folder{
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 20px;
  .create-folder-btn{
    display: flex;
    gap: 40px;
  }
  }
</style>

<style>
.is-active{
    width: none;
}

</style>