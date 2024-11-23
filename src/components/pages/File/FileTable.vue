<template>
    <div class="file-table">
      <div class="file-row" :class="{'is-active': props.checked}" 
        @mouseenter="isShow = true"
        @mouseleave="checkAlwaysShow">
        <!-- 选择框 -->
        <div class="file-cell checkbox-cell">
          <el-checkbox v-if="props.checked || isShow" @change="logCheckValues" :checked="props.checked"></el-checkbox>
        </div>
  
        <!-- 封面 -->
        <div class="file-cell cover-cell" @click="cdOrPreview">
          <el-image
            :style="{ border: '1px solid #eee', borderRadius: '5px' }"
            style="width: 50px; height: 50px"
            :src="props.file?.cover && (props.file.type == 1 || props.file.type == 2)? coverUrl : imageURL"
            fit="cover"
            @show="handleShow"
            @close="handleClose"
          />
          <div class="transform-tag" v-if="props.file.transformed != 0">
            {{ getTransformStatus(props.file.transformed) }}
          </div>
        </div>
  
        <!-- 文件名 -->
        <div class="file-cell name-cell">
          {{ props.file.fileName }}
        </div>
  
        <!-- 文件大小 -->
        <div class="file-cell size-cell">
          {{ sizeToStandard(props.file.size) }}
        </div>
  
        <!-- 更新时间 -->
        <div class="file-cell update-cell">
          <span v-if="props.file.status == 0">{{ dateToString(props.file.updateTime) }}</span>
          <span v-else>{{ getExpireTime(props.file.updateTime) }}</span>
        </div>
  
        <!-- 创建时间 -->
        <div class="file-cell create-cell">
          {{ dateToString(props.file.createTime) }}
        </div>
  
        <!-- 更多操作 -->
        <div class="file-cell more-cell">
          <img src="../../../assets/icon-image/more.png" style="width: 20px; height: 20px; cursor: pointer;" @click="showOperation" />
          <div class="file-operation-list" v-if="operationValue && !props.shareMode">
            <div v-if="props.file.type != 0" class="operation-item" @click="downloadFile">下载</div>
            <div class="operation-item" @click="deleteFile">删除</div>
            <div class="operation-item" @click="isShowRename = true">重命名</div>
            <div class="operation-item" @click="moveFile">移动</div>
            <div class="operation-item" @click="shareFile">分享</div>
          </div>
        </div>
      </div>
    </div>
  
    <!-- 重命名对话框 -->
    <el-dialog 
    v-model="isShowRename" 
    title="重命名" 
    :center="true" 
    :show-close="false" 
    :width="`200px`">
      <div class="rename">
        <img :src="props.file?.cover && props.file.type != 0? coverUrl : imageURL" alt="" style="width: 50px; height: 50px;">
        <el-input v-model="newFileName" placeholder="请输入新的文件名" style="width: 200px;"></el-input>
        <div class="rename-btn">
          <el-button type="primary" @click="renameFile">确定</el-button>
          <el-button type="default" @click="() => { isShowRename = false; newFileName = '' }">取消</el-button>
        </div>
      </div>
    </el-dialog>

    <el-dialog 
    v-model="isShowPreview" 
    :close-on-click-modal="false" 
    :close-on-press-escape="false" 
    :modal="false" :draggable="true"
    :overflow="false"
    style="background-color: rgba(39, 46, 59, 0.7);min-width: 500px;"
    :title="props.file?.fileName" 
    :width=getPreviewWidth center>
      <FilePreview :file="props.file" :coverUrl="coverUrl" :isShowPreview="isShowPreview" :shareMode="props.shareMode"/>
    </el-dialog>
  </template>
  
  <script setup>
  import FilePreview from './FilePreview.vue'
  import { computed, onMounted, ref, watch } from 'vue';
  import IconImageEnum, {getIconImage} from '../../../enums/IconImageEnum';
  import { dateTimeToStandard, sizeToStandard, getExpireTime, getTransformStatus } from '../../../utils/StandardData';
  import { delFile, getDownloadSignUrl, getFileSignUrl, putRenameFile } from '../../../service/file';
  import { ElMessage, ElMessageBox } from 'element-plus';
  import { getShareDownloadUrl, getSharePreviewUrl } from '../../../service/share';
  import { useRoute } from 'vue-router';
  const props = defineProps({
      file: {
          type: Object,
          required: true 
      },
      width: {
          type: Number,
          default: 120 
      },
      height: {
          type: Number,
          default: 150
      },
      checked: {
          type: Boolean,
          default: false // 默认不选中
      },menuIndex:{
          type: String,
          default: "1"
      },
      shareMode:{
        type: Boolean,
        required: false,
        default: false
      }
  })
  
  const route = useRoute()
  const shareId = route.params.shareId
  
  const isShowRename = ref(false) // 是否显示重命名输入框
  const newFileName = ref(props.file.name) // 重命名文件名
  
  const isShowPreview = ref(false) // 是否显示预览窗口
  
  const getPreviewWidth = computed(() => {
   //   2(video) 3(audio) 4(Pdf) 5(word) 6(excel) 7(text)
    switch (props.file.type) {
      case 2:
        return '800';
      case 3:
        return '400';
      case 7:
        return "600";
      default:
        return '900';
    }
  })
  
  
  const IconImageEnm = IconImageEnum;
  const imageURL = computed(() => {
    return getIconImage(IconImageEnm[props.file.type])
  })
  
  
  const coverUrl = ref("")
  watch(() => props.file.cover, () => {
    if(props.file.cover){
      if(props.shareMode){
        getSharePreviewUrl(shareId, props.file.id, "cover").then(res => {
          coverUrl.value = import.meta.env.VITE_BASE_HOST + res.data;
        }).catch(err => {
          console.log(err);
        });
      }else{
        getFileSignUrl(props.file.id, "cover").then(res => {
          coverUrl.value = import.meta.env.VITE_BASE_HOST + res.data;
        }).catch(err => {
          console.log(err);
        });
      }
  }
  }, {deep: true, immediate: true}) 
  
  const urlList = ref(coverUrl.value) // 预览图片地址
  
  
  const previewList = computed(() => {
    if(props.file.type == 1){
      return [urlList.value]
    }
    return []
  })
  
  
  const dateToString = (date) => {
    return dateTimeToStandard(date)
  }
  const showImage = ref(false) // 是否显示图片
  const handleShow = () => {
      if(props.file.type == 1){
        showImage.value = true
        if(props.shareMode){
          getSharePreviewUrl(shareId, props.file.id, "file").then(res => {
            urlList.value = import.meta.env.VITE_BASE_HOST + res.data;
          }).catch(err => {
            console.log(err);
          });
        }else{
          getFileSignUrl(props.file.id).then(res => {
            urlList.value = import.meta.env.VITE_BASE_HOST + res.data;
          }).catch(err => {
            console.log(err);
          });
        }
    }
  }
  
  const handleClose = () => {
    showImage.value = false
  }
  
  
  
  const isShow = ref(false) // 是否显示操作按钮
  
  watch(() => props.checked, (newVal) => {
    isShow.value = newVal
  })
  
   const operationValue = ref(false) // 操作按钮显示隐藏
    const showOperation = () => {
      operationValue.value = !operationValue.value
    }
  
  const checkAlwaysShow = () => {
    if(!props.checked){
      isShow.value = false
    }
    operationValue.value = false
  }
  const logCheckValues = (e) => {
     if(e){
        emit("addActiveFile") 
     }else{
        emit("removeActiveFile")
     }
   }
   
   const cdOrPreview = () => {
    console.log("cdOrPreview");
    if(isShowRename.value 
    || isShowPreview.value 
    || props.file.type >= 8 
    || props.file.type == 1 
    || props.menuIndex == "6"
    || props.file.transformed !== 0 ){
      return
    }
     if(props.file.type == 0){ // 文件夹
      emit("cdDir")
     }else{ // 文件
      isShowPreview.value = true
     }
   }
  
  
  
    const downloadFile= () => {
      if(props.shareMode){
        getShareDownloadUrl(shareId, props.file.id).then(res => {
          if(res.code == 200){
            window.open(import.meta.env.VITE_BASE_HOST + res.data)
          }else{
            ElMessage.error(res.msg)
          }
        }).catch(err => {
          ElMessage.error("下载失败")
        });
      }else{
        getDownloadSignUrl(props.file.id).then(res => {
          if(res.code == 200){
            window.open(import.meta.env.VITE_BASE_HOST + res.data)
          }else{
            ElMessage.error(res.msg)
          }
        }).catch(err => {
          ElMessage.error("下载失败")
        });
      }
    }
  
    const deleteFile = () => {
      ElMessageBox.confirm(
        '确认删除该文件吗？',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          customStyle: {
                top: '-20%',
                bottom: 'auto',
            }
        }
    ).then(() => {
        delFile(props.file.id).then(res => {
        if(res.code == 200){
          emit("updateData")
        }else{
          ElMessage.error(data.msg)
        }
      }).catch(err => {
        ElMessage.error("移入回收站失败");
      });
    }).catch(() => {
      
    });
    }
    const renameFile = () => {
      putRenameFile(props.file.id, newFileName.value).then(res => {
      if(res.code == 200){
        ElMessage.success("重命名成功")
        emit("updateData")
      }else{
        ElMessage.error(res.msg)
      }
      }).catch(err => {
        ElMessage.error("重命名失败")
      });
      isShowRename.value = false
      newFileName.value = ""
    }
  
    const moveFile = () => {
      // 通知父组件唤醒文件移动弹窗，并传递当前文件信息，选择目标文件夹后移动文件， 使用接口实现
      emit("moveFile")
      isShow.value = false
    }
    const shareFile = () => {
      emit("shareFile")
    }
  
  const emit = defineEmits(['addActiveFile','removeActiveFile', "updateData", "cdDir", "moveFile", "shareFile"])
  
  
  </script>
  
  <style scoped lang="scss">
  .file-table {
    display: table;
    width: 100%;
    border-spacing: 0;
    &:hover {
      background-color: #f5f5f5;
    }
  }
  
  .file-row {
    display: table-row;
    padding: 10px 0;
    border-bottom: 1px solid #ddd;
    transition: background-color 0.3s;
  }
  
  .file-row.is-active {
    background-color: #f0f9ff;
  }
  
  .file-cell {
    display: table-cell;
    padding: 10px;
    vertical-align: middle;
    &:hover {
      cursor: default;
    }
  }
  
  .checkbox-cell {
    width: 10px;
  }
  
  .cover-cell {
    position: relative;
    width: 60px;
    height: 60px;
    &:hover {
      cursor: pointer;
    }
  }

  .transform-tag{
    position: absolute;
    top: 40%;
    right: 0;
    padding: 2px 4px;
    font-size: 12px;
    color: #fff;
    background-color: #f56c6c;
    border-radius: 4px;
  }
  
  .name-cell {
    width: 120px;
    font-family: Inter, 'Helvetica Neue', Helvetica, 'PingFang SC',
    'Hiragino Sans GB', 'Microsoft YaHei', '微软雅黑', Arial, sans-serif;
    color: #23262a;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  
  .size-cell, .update-cell, .create-cell {
    width: 100px;
    color: #666;
    text-align: center;
  }
  
  .more-cell {
    width: 50px;
    text-align: center;
    position: relative;
  }
  
  .file-operation-list {
    position: absolute;
    right: 0;
    background: white;
    border: 1px solid #ddd;
    padding: 5px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
    border-radius: 4px;
    z-index: 10;
  }
  
  .operation-item {
    padding: 5px;
    cursor: pointer;
  }
  
  .operation-item:hover {
    background-color: #f5f5f5;
  }

  .rename {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
}

.rename img {
  width: 50px;
  height: 50px;
  border-radius: 4px;
  margin-bottom: 10px;
}

.rename .el-input {
  width: 200px;
  margin-bottom: 10px;
}

.rename-btn {
  display: flex;
  justify-content: center;
  width: 100%;
  gap: 50px;
}

.rename-btn .el-button {
  width: 80px;
}

  </style>
  <style>
  .el-dialog__title{
    margin-left: 32px;
  }
  </style>