<!-- 用于显示文件信息， 如文件名、大小、创建时间、修改时间等， 以及文件操作按钮， 如下载、删除等, 图标显示文件类型 -->
<template>
  <div :class="['file-item', {'is-active': props.checked}]" 
    @mouseenter="isShow = true"
    @mouseleave="checkAlwaysShow"
    :style="{ width: props.width + 'px', height: props.height + 'px', padding:20, boxSizing: 'border-box' }">
    <div class="file-top">
      <div v-show="isShow || props.checked" :class="['file-operation']">
        <div class="file-checkbox">
          <el-checkbox v-if="props.checked || isShow" @change="logCheckValues" style="width: 16px; height: 16px; margin-top: 0;" :checked="props.checked"></el-checkbox>
        </div>
        <div v-if="props.menuIndex !== '6' && (!shareMode || props.file.type != 0)" class="file-operation-btn" @click="showOperation">
          <img src="../../../assets/icon-image/more.png" style="width: 25px; height: 25px;"/>
          <div class="file-operation-list" v-if="operationValue && !props.shareMode">
            <div v-if="props.file.type != 0" class="operation-item" @click="downloadFile">下载</div>
            <div class="operation-item" @click="deleteFile">删除</div>
            <div class="operation-item" @click="isShowRename = true">重命名</div>
            <div class="operation-item" @click="moveFile">移动</div>
            <div class="operation-item" @click="shareFile">分享</div>
          </div>
          <div class="file-operation-list" v-if="operationValue && props.shareMode">
            <div class="operation-item" @click="downloadFile">下载</div>
          </div>
        </div>
      </div>
    </div>
    <div class="file-info" @click="cdOrPreview">
      <div class="demo-image__preview image">
        <el-tooltip placement="top" :offset="-20" :show-after="1000" :hide-after="0" :show-arrow="false" :disabled="isShowPreview || showImage">
          <template #content> type: {{ IconImageEnm[props.file.type] }}<br> size: {{ sizeToStandard(props.file.size) }}<br>{{ dateToString(props.file.createTime) }}</template>
          <el-image
          :style="{ border: '1px solid #eee', borderRadius: '10px' }"
            style="width: 72px; height: 72px"
            :src="props.file?.cover && (props.file.type == 1 || props.file.type == 2)? coverUrl : imageURL"
            :zoom-rate="1.2"
            :max-scale="7"
            :min-scale="0.2"
            :z-index="1"
            :preview-src-list="previewList"
            :initial-index="0"
            fit="cover"
            @show="handleShow"
            @close="handleClose"
            />
        </el-tooltip>
        <div v-if="props.file.transformed !== 0" class="transformed-info">
          {{ getTransformStatus(props.file.transformed) }}
        </div>
      </div>
      <div class="file-name">
        <span >{{ props.file.fileName }}</span>
      </div>
      <div class="date">
        <span v-if="props.file.status == 0">{{ dateToString(props.file.updateTime) }}</span>
        <span v-else>{{ getExpireTime(props.file.updateTime) }}</span>
      </div>
    </div>
    <el-dialog v-model="isShowRename" title="重命名" 
      :v-model="isShowRename"
      :center="true"
      :show-close="false"
      :width="`200px`">
      <div class="rename">
        <img :src="props.file?.cover && props.file.type != 0? coverUrl : imageURL" alt="" style="width: 72px; height: 72px;">
        <el-input v-model="newFileName" placeholder="请输入新的文件名" style="width: 300px;"></el-input>
        <div class="rename-btn">
          <el-button type="primary" @click="renameFile">确定</el-button>
          <el-button type="default" @click="()=>{isShowRename = false, newFileName = ''}">取消</el-button>
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
    <a href="#" class="download-btn" style="display: none;">下载</a>
  </div>
</template>

<script setup>
import FilePreview from './FilePreview.vue'
import { computed, onMounted, ref, watch } from 'vue';
import IconImageEnum, {getIconImage} from '../../../enums/IconImageEnum';
import { dateTimeToStandard, sizeToStandard, getExpireTime, getTransformStatus } from '../../../utils/StandardData';
import { delFile, getDownloadSignUrl, getFileSignUrl, putRenameFile } from '../../../service/file';
import { ElMessage } from 'element-plus';
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
  if(isShowRename.value 
  || isShowPreview.value 
  || props.file.type == 8 
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
    delFile(props.file.id).then(res => {
      if(res.code == 200){
        emit("updateData")
      }else{
        ElMessage.error(data.msg)
      }
    }).catch(err => {
      ElMessage.error("移入回收站失败");
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

<style lang="scss" scoped>

.file-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-direction: column;
  font-family: Inter, 'Helvetica Neue', Helvetica, 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', '微软雅黑', Arial, sans-serif;
  color: #6b7785;
  padding: 1px 3px;
  cursor: pointer;

  .file-top {
    width: 100%;
    height: 17%;

    .file-operation {
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
  }

  .file-info {
    display: flex;
    flex-direction: column;
    align-items: center;
    height: 80%;
    width: 100%;
    gap: 2px;

    &:hover {
      color: rgb(0, 132, 255);
      
      .file-name {
        span {
          color: rgb(0, 132, 255);
        }
      }
    }

    .image {
      position: relative;
      width: 72px; 
      height: 72px;

      img {
        -webkit-user-drag: none; /* Safari */
        user-drag: none; /* Firefox */
      }

      .transformed-info {
        position: absolute;
        top: 0%;
        right: 0;
        padding: 2px 4px;
        font-size: 12px;
        color: #fff;
        background-color: #f56c6c;
        border-radius: 4px;
      }
    }

    .file-name {
      overflow: hidden; // 将 overflow: hidden; 放到这里
      span {
        word-break: break-all; 
        text-align: center; 
        align-items: center;
        display: flex;
        justify-content: center;
        font-size: 13px;
        color: #130e0e;
        line-height: 1;
      }
    }

    .date {
      font-size: 10px;
    }
  }
}
.file-operation-btn{
  // 相对定位
  position: relative;
  height: 25px;
  border-radius: 5px;
  &:hover{
    background-color: #ffffff;
  }
}
.file-operation-list{
  position: absolute;
  top: 25px;
  left: -30px;
  width: 65px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: white;
  border: 1px solid #ddd;
  padding: 5px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  border-radius: 4px;
  z-index: 10;
  .operation-item{
    text-align: center;
    width: 100%;
    padding: 5px;
    cursor: pointer;
  }
}
.operation-item:hover {
    background-color: #f5f5f5;
}


.is-active{
  background-color: #f5f5f5;
}

.file-item:hover{
  background-color: #f5f5f5;
}

.rename{
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  .rename-btn{
    display: flex;
    justify-content: center;
    width: 80%;
    gap: 50px;
    margin-top: 10px;
  }
}




.demo-image__error .image-slot {
  font-size: 30px;
}
.demo-image__error .image-slot .el-icon {
  font-size: 30px;
}
.demo-image__error .el-image {
  width: 100%;
  height: 200px;
}

</style>

<style>
.el-dialog__title{
  margin-left: 32px;
}
</style>