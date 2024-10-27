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
        <div class="file-operation-btn" @click="showOperation">
          <img src="../../../assets/icon-image/more.png" style="width: 25px; height: 25px;"/>
          <div class="file-operation-list" v-if="operationValue">
            <div v-if="props.file.type != 0" class="operation-item" @click="downloadFile">下载</div>
            <div class="operation-item" @click="deleteFile">删除</div>
            <div class="operation-item" @click="renameFile">重命名</div>
            <div class="operation-item" @click="moveFile">移动</div>
            <div class="operation-item" @click="shareFile">分享</div>
          </div>
        </div>
      </div>
    </div>
    <div class="file-info" @click="cdOrPreview">
      <div class="image">
        <el-tooltip placement="bottom" :offset="-10" :show-after="600" >
          <template #content> {{ file.type }}<br>{{ file.size }}<br>{{ file.createTime }} </template>
          <img :src="props.file?.cover ? props?.file.cover : imageURL" alt="" style="width: 72px; height: 72px;">
        </el-tooltip>
      </div>
      <div class="file-name">
        <span>{{ props.file.name }}</span>
      </div>
      <div class="date">
        <span>{{ props.file.createTime }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import IconImageEnum, {getIconImage} from '../../../enums/IconImageEnum';
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
    }
})

const IconImageEnm = IconImageEnum;
const imageURL = ref(getIconImage(IconImageEnm[props.file.type]))
const isShow = ref(false) // 是否显示操作按钮

watch(() => props.checked, (newVal) => {
  isShow.value = newVal
})

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
 }

 const operationValue = ref(false) // 操作按钮显示隐藏
  const showOperation = () => {
    operationValue.value = !operationValue.value
  }

  const downloadFile= () => {
    // todo get 使用接口下载文件
    console.log("downloadFile");
  }

  const deleteFile = () => {
    // todo delete 使用接口删除文件
    console.log("deleteFile");
    // 并通知父组件刷新数据
    emit("updateData")
  }
  const renameFile = () => {
    // todo rename
    console.log("renameFile");
    
  }

  const moveFile = () => {
    // todo move
    console.log("moveFile");
  }
  const shareFile = () => {
    // todo copy
    console.log("copyFile");
  }

const emit = defineEmits(['addActiveFile','removeActiveFile', "updateData"])
</script>

<style lang="scss" scoped>

.file-item{
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-direction: column;
  font-family: Inter, 'Helvetica Neue', Helvetica, 'PingFang SC',
  'Hiragino Sans GB', 'Microsoft YaHei', '微软雅黑', Arial, sans-serif;
  color: #6b7785;
  padding: 1px 3px;
  cursor: pointer;
  .file-top{
    width: 100%;
    height: 17%;
    .file-operation{
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
  }
  .file-info{
    display: flex;
    flex-direction: column;
    align-items: center;
    height: 80%;
    width: 100%;
    .image{
      width: 72px; 
      height: 72px;
      img{
        -webkit-user-drag: none; /* Safari */
        user-drag: none; /* Firefox */
      }
    }
    
    .file-name{
      span{
        text-align: justify;
        word-break: break-all;
        text-align: center;
        align-items: center;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 13px;
        color: #130e0e;
      }
      overflow: hidden;
    }
    .date{
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
  width: 55px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.1);
  border-radius: 5px;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
  z-index: 10;
  gap: 3px;
  .operation-item{
    width: 100%;
    height: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    padding: 2px 0;
    border: 1px solid #e3e3e3;
    border-radius: 5px;
    background-color: #ffffff;
    color: rgb(0, 132, 255);
  }
}


.is-active{
  background-color: #f5f5f5;
}

.file-item:hover{
  background-color: #f5f5f5;
}
</style>