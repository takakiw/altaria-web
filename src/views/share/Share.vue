<template>
    <Container style="min-width: 1242px;">
       <div class="left-container">
        <div class="left-top">
        <el-menu
          :default-active="`${menuIndex}`"
          class="menu-vertical"
          @select="handleSelect"
        >
          <el-menu-item index="1">
            <el-icon><Files /></el-icon>
            <span>文件</span>
          </el-menu-item>
          <el-menu-item index="2">
            <el-icon><Notebook /></el-icon>
            <span>笔记</span>
          </el-menu-item>
          
        </el-menu>
        </div>
       </div>
       <div class="right-container" v-if="menuIndex == '1'">
        <div class="right-top">
          <div class="controls">
            <div class="buttons">
              <el-button plain type="primary" :disabled="shareTableRef ? shareTableRef.activeRow.length == 0 : true" @click="cancelShareBatch">取消分享</el-button>
            </div>
          </div>
          <div class="file-path">
            <span >全部分享</span>
          </div>
        </div>
        <el-divider></el-divider>
        <div class="right-content">
          <div>
            <ShareTable ref="shareTableRef" 
            :shareList="shareList"
            @cancelShareList="cancelShareList" />
          </div>
        </div>
       </div>
       <!-- 公开的笔记 -->
       <div class="right-container" v-if="menuIndex == '2'">
        <div class="right-content">
          <div>
            <ShareNoteTable
              :noteList="noteList"
              @updateNoteList="updateNoteList"
            />
          </div>
        </div>
       </div>
    </Container>
</template>

  
<script setup>
import Container from '@/components/common/Container.vue'
import ShareTable from '../../components/pages/share/ShareTable.vue';
import ShareNoteTable from '../../components/pages/share/ShareNoteTable.vue';

import {
  Files, Notebook
} from '@element-plus/icons-vue'
import { reactive, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { delCancelShare, getShareList } from '../../service/share';
import { ElMessage, ElMessageBox } from 'element-plus';
import { getPublicNoteInfoList } from '../../service/note';
import { useUserStore } from '../../store';

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()

const shareTableRef = ref(null) // activeRow-选中的行
const shareList = reactive([])
const noteList = reactive([])

const menuIndex = ref(1)
const handleSelect = (index) => {
  if(!userStore.isLogin) return 
  menuIndex.value = index
  if(index == "1"){
    getShareList().then(res => {
      if(res.code === 200){
        shareList.splice(0, shareList.length)
        shareList.push(...res.data.records)
      }else{
        ElMessage.error(res.msg)
      }
    }).catch(err => {
        ElMessage.error('获取分享列表失败')
    })
  }
  else if(index == "2"){
    getPublicNoteInfoList().then(res => {
      console.log(res);
      if(res.code === 200){
        noteList.splice(0, noteList.length)
        noteList.push(...res.data)
      }else{
        ElMessage.error(res.msg)
      }
    }).catch(err => {
        ElMessage.error('获取公开笔记列表失败')
    })
  }
}

if(localStorage.getItem('token')){
    getShareList().then(res => {
      if(res.code === 200){
        shareList.push(...res.data.records)
      }else{
        ElMessage.error(res.msg)
      }
    }).catch(err => {
        ElMessage.error('获取分享列表失败')
    })
}

const cancelShareList = (ids) => {
  const newList = shareList.filter(item => !ids.includes(item.id))
  shareList.splice(0, shareList.length)
  shareList.push(...newList)
}

const cancelShareBatch = () => {
  ElMessageBox.confirm(
    '确定要取消分享吗?',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
      roundButton: true,
      showClose: false,
      customStyle: {
        top: '-20%',
        bottom: 'auto',
      }
    }
  ).then(() => {
    const ids = shareTableRef.value.activeRow.map(item => item.id)
    delCancelShare(ids).then(res => {
      if(res.code == 200){
        cancelShareList(ids)
        ElMessage.success('取消分享成功')
      }else{
        ElMessage.error(res.msg)
      }
    }).catch(err => {
      ElMessage.error('取消分享失败' + err)
    })
  }).catch(() => {

  })
}

const updateNoteList = () => {
  
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
    border-right: none;
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
}

.right-content{
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 90%;
}
</style>

<style>

</style>