<template>
  <Container style="padding-top: 5px; box-shadow: var(--el-box-shadow-lighter)">
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
          <div style="width: 90%;padding-bottom: 10px;">
            <el-progress :percentage="percentage" />
          </div>
          <span>{{sizeToStandard(useSpace)}}/{{ sizeToStandard(totalSpace) }}</span>
      </div>
     </div>
     <div class="right-container">
      <div class="right-top">
        <div class="controls">
          <div class="buttons">
            <el-button plain v-if="menuIndex == 1" type="primary" round @click="addFile">上传</el-button>
            <el-button plain v-if="menuIndex == 1" type="success" round @click="addFolder">新建文件夹</el-button>
            <el-button plain v-if="menuIndex != 6" @click="moveFile" :disabled="fileItemRef == null || fileItemRef?.activeFiles?.length == 0" type="warning" round>移动</el-button>
            <el-button plain v-if="menuIndex != 6" @click="shareFile" :disabled="fileItemRef == null || fileItemRef?.activeFiles?.length == 0" type="info" round>分享</el-button>
            <el-button plain v-if="menuIndex != 6" @click="deleteFile" :disabled="fileItemRef == null || fileItemRef?.activeFiles?.length == 0" type="danger" round>移入回收站</el-button>
            <el-button plain v-if="menuIndex == 6" @click="RemoveFile" :disabled="fileItemRef == null || fileItemRef?.activeFiles?.length == 0" type="danger" round>删除</el-button>
            <el-button plain v-if="menuIndex == 6" type="primary" round @click="recoveryFile" :disabled="fileItemRef == null || fileItemRef?.activeFiles?.length == 0">还原</el-button>
          </div>
          <div class="search">
                <el-input
                    v-model="searchText"
                    style="width: 240px"
                    placeholder="search..."
                    :prefix-icon="Search"
                    @keydown.enter="searchFile"/></div>
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
        <div v-if="getFileLength != 0">
           <FileItem ref="fileItemRef"
            :menuIndex="`${menuIndex}`" 
            :files="files"
            :selectValue="selectValue"
            @update:fileChecked="updateFileChecked"
            @activeAll="activeAll"
            @cancelAll="cancelAll"
            @updateData="updateData"
            @cdDir="cdDir"
            @updateSelectValue="updateSelectValue"
            @moveFile="moveFile"
            @shareFile="shareFile"/>
        </div>
        <div v-else>
          <el-empty description="暂无文件">
          </el-empty>
        </div>
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

      <el-dialog
        v-model="moveFileShow"
        title="移动文件"
        width="100"
        :show-close="false"
        :center="true"
      >
        <template #footer>
          <MoveWindow ref="moveFileRef" style="width: 100%; height: 400px;"
          :moveFileShow="moveFileShow"
          :excludeFiles="moveFileList"/>
          <div class="move-button">
          <el-button type="primary"  @click="moveFileToTarget">确定</el-button>
          <el-button type="default"  @click="moveFileShow = false">取消</el-button>
        </div>
        </template>
      </el-dialog>
      <el-dialog
        v-model="shareFileShow"
        title="分享文件"
        width="500"
        style="height: 400px;"
        :modal="false"
        :close-on-click-modal="false"
        :destroy-on-close="true"
        :center="true"
      >
        <template #footer>
          <FileShare :files="shareList" 
          @cancelShare="cancelShare"
          @handleShare="handleShare"/>
        </template>
      </el-dialog>
      <el-dialog
      v-model="shareSuccessShow"
      title="分享成功"
      width="800"
      :center="true"
      :modal="false"
      :close-on-click-modal="false"
      >
        <template #footer>
          <div class="share-success">
            <div class="share-url">
              <div>{{ shareUrl }}</div>
            </div>
            <div>
              <el-button type="success" plain round @click="copyUrl">复制链接和密码</el-button>
            </div>
          </div>
        </template>
      </el-dialog>
  </Container>
</template>

<script setup>
import Container from '@/components/common/Container.vue'
import FileItem from '../../components/pages/File/FileItem.vue';
import MoveWindow from '../../components/pages/File/DirWindow.vue';
import FileShare from '../../components/pages/File/components/FileShare.vue';
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

import { computed, onMounted, reactive, ref, watch } from 'vue';
import { delFile, getFileList, getFilePath, getRecycleList, postCreateFolder, putMoveFile, putRestoreFile, removeFile } from '../../service/file';
import { ElMessage } from 'element-plus';
import { getSpaceInfo } from '../../service/space';
import { getShareUrl, sizeToStandard } from '../../utils/StandardData';
import { useRoute, useRouter } from 'vue-router';
import IconImageEnum, {getIconImage} from '../../enums/IconImageEnum';
import { postCreateShare } from '../../service/share';
import { useUserStore } from '../../store';

const userStore = useUserStore()
const props = defineProps({
  updateDataFlag: {
    type: Boolean,
    default: false
  }
})
let updateTask = null
watch(() => props.updateDataFlag, () => {
  if(updateTask) return
  updateTask = "ing"
  setTimeout(() => {
    handleSelect(menuIndex.value)
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
    updateTask = null
  }, 1000)
})

const router = useRouter()
const route = useRoute()


const menuIndex = ref(1)
const searchText = ref('')
const fileItemRef = ref(null) // 用于获取选中的文件
const pathList = reactive([])
if(route.query.path){
  pathList.push({
    id : route.query.path,
    fileName : "全部文件"
  })
}
const files = reactive([])

const getFileLength = computed(() => {
  return files.length
})

const useSpace = ref(0)
const totalSpace = ref(0)
const percentage = ref(0)

onMounted(async () => {
  // 等待userStore的isLogin状态
  if(localStorage.getItem('token')){
    // 获取pathList的最后一项
    const pathId = pathList.length > 0 ? pathList[pathList.length - 1].id : "0"
    getFilePath(pathId).then(res => {
      if(res.code == 200){
        pathList.splice(pathList.length - 1, 1)
        pathList.push(...res.data)
        // 获取文件列表
        setTimeout(() => { // 延迟0.1秒执行，等待pinia数据更新
          thisUpdateFileList(pathId, undefined, undefined, undefined)
        }, 100)
      }else{
        ElMessage.error(res.msg)
      }
    }).catch(err => {
      console.log(err)
    })
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
  }
})

const notLogin = () => {
  ElMessage.error("未授权，请先登录"); 
  setTimeout(() => {router.push('/login');}, 1000); 
  return
}


const addFolderShow = ref(false)
const folderName = ref('')
const createFolder = () => {
  if(!userStore.isLogin) {notLogin(); return;}
  postCreateFolder(pathList[pathList.length - 1].id, folderName.value).then(res => {
    if(res.code == 200){
      ElMessage.success('文件夹创建成功')
      handleSelect(menuIndex.value)
    }else{
      ElMessage.error(res.msg)
    }
  }).catch(err => {
    ElMessage.error('文件夹创建失败')
    console.log(err)
  })
  addFolderShow.value = false
  folderName.value = ''
}
const addFolder = () => {
  addFolderShow.value = true
}
const selectValue = ref("0")
const thisUpdateFileList = (id, type, fileName, order) =>{
  order = selectValue.value
  getFileList(id, type, fileName, order).then(res => {
      if(res.code == 200){
        files.splice(0, files.length)
        res.data.records.forEach(item => {
          files.push({...item, checked: false})
        })
      }else{
        ElMessage.error(res.msg)
      }
    }).catch(err => {
      ElMessage.error('获取文件列表失败')
      console.log(err)
    })
}

const handleSelect = (index) => {
  if(!userStore.isLogin) {notLogin(); return;}
  menuIndex.value = index
  files.splice(0)
  // 获取文件列表
  //1 所有 2 图片 3 视频 4 音频 5 文档 6 回收站
  if(index == 1){
    const pathId = route.query.path ? route.query.path : "0"
    thisUpdateFileList(pathId, undefined, undefined, undefined)
  }else if(index != 6){
    thisUpdateFileList(undefined, index - 1, undefined, undefined)
  }else{
    getRecycleList().then(res => {
      if(res.code == 200){
        files.splice(0, files.length)
        res.data.records.forEach(item => {
          files.push({...item, checked: false})
        })
      }else{
        ElMessage.error(res.msg)
      }
    }).catch(err => {
      ElMessage.error('获取回收站列表失败')
      console.log(err)
    })
  }
}

const getFileByPath = (index) => {
  if(index == pathList.length - 1) return
  const lastPath = pathList[index]
  pathList.splice(index + 1, pathList.length - index - 1)
  router.replace({
    path: '/files',
    query: {
      path: lastPath.id
    }
  })
  thisUpdateFileList(lastPath.id, undefined, undefined, undefined)
}

// 分享文件
const shareFileShow = ref(false)
const shareList = reactive([])

const shareSuccessShow = ref(false)
const shareUrl = ref('')

const shareFile = (index) => {
  if(typeof index === 'number'){
    shareList.splice(0)
    shareList.push(files[index])
  }else{
    shareList.splice(0)
    fileItemRef.value.activeFiles.forEach(item => {
      shareList.push(item)
    })
  }
  shareFileShow.value = true
}

const copyUrl = async () => {
  await navigator.clipboard.writeText(shareUrl.value)
  shareSuccessShow.value = false
}


const cancelShare = () => {
  shareFileShow.value = false
}

const handleShare = (formData) => {
  const fids = shareList.map(item => item.id)
  formData.fids = fids
  postCreateShare(formData).then(res => {
    if(res.code == 200){
      ElMessage.success('文件分享成功')
      shareFileShow.value = false
      shareSuccessShow.value = true
      shareUrl.value = getShareUrl(res.data.url, res.data.sign)
    }else{      
      ElMessage.error(res.msg)
    }
  }).catch(err => {
    ElMessage.error('文件分享失败')
    console.log(err)
  })
}


const deleteFile = () => {
  const ids = fileItemRef.value.activeFiles.map(item => item.id);
  delFile(ids).then(res => {
    if(res.code == 200){
      ElMessage.success('文件已移入回收站')
      handleSelect(menuIndex.value)
    }else{
      ElMessage.error(res.msg)
    }
  }).catch(err => {
    ElMessage.error('文件移入回收站失败')
    console.log(err)
  })
}

const recoveryFile = () => {
  const ids = fileItemRef.value.activeFiles.map(item => item.id);
  putRestoreFile(ids).then(res => {
    if(res.code == 200){
      ElMessage.success('文件已还原')
      handleSelect(menuIndex.value)
    }else{
      ElMessage.error(res.msg)
    }
  }).catch(err => {
    ElMessage.error('文件还原失败')
    console.log(err)
  })
}


let removeTask = null // 防止连续点击删除按钮时，触发多次删除请求
const RemoveFile = () => {
  removeTask = setTimeout(() => {
    const ids = fileItemRef.value.activeFiles.map(item => item.id);
    removeFile(ids).then(res => {
      if(res.code == 200){
        ElMessage.success('文件已删除')
        handleSelect(menuIndex.value)
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
      }else{
        ElMessage.error(res.msg)
      }
      removeTask = null
    }).catch(err => {
      ElMessage.error('文件删除失败')
      console.log(err)
      removeTask = null
    })
  }, 1000)
}

const emit = defineEmits(['addFile'])
const addFile = () => {
  if(!userStore.isLogin) {notLogin(); return;}
  emit('addFile', pathList[pathList.length - 1].id)
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
  handleSelect(menuIndex.value)
}


const cdDir = (index) => {
  const nextPath = files[index]
  pathList.push(nextPath)
  router.replace({
    path: '/files',
    query: {
      path: nextPath.id
    }
  })
  thisUpdateFileList(nextPath.id, undefined, undefined, undefined)
  searchText.value = ''
}

const moveFileShow = ref(false)
const moveFileRef = ref(null)
const moveFileList = reactive([])

const moveFile = (index) => {
  // 判断index类型
  if(typeof index === 'number') {
    moveFileList.splice(0)
    moveFileList.push(files[index])
  }
  else {
    moveFileList.splice(0)
    fileItemRef.value.activeFiles.forEach(item => {
      moveFileList.push(item)
    })
  }
  moveFileShow.value = true 
}

const moveFileToTarget = () => {
  const oldPid = pathList[pathList.length - 1].id
  const pid = moveFileRef.value.pathList[moveFileRef.value.pathList.length - 1].id
  const ids = moveFileList.map(item => item.id)
  putMoveFile(oldPid, pid, ids).then(res => {
    if(res.code == 200){
      ElMessage.success('文件移动成功')
      moveFileShow.value = false
      handleSelect(menuIndex.value)
    }else{
      ElMessage.error(res.msg)
    }
  }).catch(err => {
    ElMessage.error('文件移动失败')
    console.log(err)
  })
}

const updateSelectValue = (value) => {
  if(selectValue.value != value){
    selectValue.value = value
    files.splice(0)
    // 获取文件列表
    //1 所有 2 图片 3 视频 4 音频 5 文档 6 回收站
    if(menuIndex.value == 1){
      const pathId = route.query.path ? route.query.path : "0"
      thisUpdateFileList(pathId, undefined, undefined, undefined)
    }else{
      thisUpdateFileList(undefined, menuIndex.value - 1, undefined, undefined)
    }
  }
}

// 搜索文件
const searchFile = () => {
  files.splice(0)
  // 获取文件列表
  //1 所有 2 图片 3 视频 4 音频 5 文档 6 回收站
  menuIndex.value = 1
  thisUpdateFileList(undefined, undefined, searchText.value, undefined)
  pathList.splice(0, pathList.length)
  pathList.push({
    id : "0",
    fileName : "全部文件"
  })
}

</script>

<style lang="scss" scoped>

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
  box-sizing: border-box;
  border-right: 1px solid var(--el-menu-border-color);
  .el-menu {
    border-right:none;
  }
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

  .move-button{
    display: flex;
    justify-content: center;
    margin-top: 5px;
    gap: 50px;
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

.share-success{
  display: flex;
  font-family: Inter, 'Helvetica Neue', Helvetica, 'PingFang SC',
  'Hiragino Sans GB', 'Microsoft YaHei', '微软雅黑', Arial, sans-serif;
  color: #6b7785;
  justify-content: center;
  align-content: center;
  flex-direction: column;
  gap: 20px;
  .share-url{
    opacity: 1;
    background: -webkit-linear-gradient(315deg, #7155e3 25%, #00eb1f);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
}

</style>

<style>
.is-active{
    width: none;
}
</style>