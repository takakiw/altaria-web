<template>
    <img style="height: 200px; width: 200px;" :src="avatarUrl" class="avatar" />
      <el-upload
        ref="uploadRef"
        class="avatar-uploader"
        id="file"
        :show-file-list="false"
        @change="updateFile"
        :auto-upload="false"
      >
        <img v-if="imageUrl" :src="imageUrl" class="avatar" />
        <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
      </el-upload><a :href="imageUrl" id="download" v-show="false"></a> 
      <br>
      <el-button type="primary" @click="submitSelect">Select</el-button>
      <el-button type="primary" @click="submitUpload">Upload</el-button>    
      
    </template>
    
    <script setup>
    import { ref } from 'vue'
    import { ElMessage } from 'element-plus'
    import { Plus } from '@element-plus/icons-vue'
    import axios from 'axios';
    
    const imageUrl = ref('')
    const avatarUrl = ref('')
    const uploadRef = ref()
    const upFile = ref()
  
    // 选择文件
    function submitSelect(){
      document.getElementsByClassName("el-upload--text")[0]?.click()
    }
  
    const updateFile = (file, fileList) => {
      fileList.splice(0)
      if (file.raw.type.indexOf('image') === -1) {
        ElMessage.error('只能上传图片文件')
        return
      }
      if (file.size > 1024 * 1024 * 2) {
        ElMessage.error('文件大小不能超过2M')
        return
      }
      upFile.value = file.raw
      imageUrl.value = URL.createObjectURL(file.raw)
    }
  
    // 上传文件
    const submitUpload = () => {
      if (upFile.value) {
        const formData = new FormData()
        formData.append('file', upFile.value)
        formData.append("uId", upFile.value.uid)
        axios.post('/api/upload', formData).then(res => {
          ElMessage.success('上传成功')
=          imageUrl.value = ''
          avatarUrl.value = "/api/download"
          upFile.value = null
        }).catch(err => {
          ElMessage.error('上传失败')
        })
      } else {
        ElMessage.error('请先选择文件')
      }
    }
    </script>
    
    <style scoped>
    
    </style>
    
    <style>
    .avatar-uploader .el-upload {
      border: 1px dashed var(--el-border-color);
      border-radius: 6px;
      cursor: pointer;
      position: relative;
      overflow: hidden;
      transition: var(--el-transition-duration-fast);
    }
    
    .avatar-uploader .el-upload:hover {
      border-color: var(--el-color-primary);
    }
    
    .el-icon.avatar-uploader-icon {
      font-size: 28px;
      color: #8c939d;
      width: 178px;
      height: 178px;
      text-align: center;
    }
    </style>