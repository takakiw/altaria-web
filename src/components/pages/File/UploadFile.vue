<template>
  <div>
    <el-upload
      ref="uploadRef"
      class="avatar-uploader"
      id="file"
      :multiple="true"
      :auto-upload="false"
      :show-file-list="false"
      @change="handleFileChange"
    >
    </el-upload>
  </div>
    

  </template>
  
<script setup>
  import { reactive, ref } from 'vue'
  import SparkMD5 from 'spark-md5';
  import { delUploadFile, postUploadFile } from '../../../service/file';
  import { ElMessage } from 'element-plus';

  const STATUS = {
    init: { value: 0, text: '计算md5' },
    uploading: { value: 1, text: '上传中' },
    success: { value: 2, text: '上传成功' },
    fail: { value: 3, text: '上传失败' },
    cancel: { value: 4, text: '取消上传' }
  }

  const props = defineProps({
    currentPid: {
      type: String,
      default: "0"
    }
  })

  const uploadRef = ref()
  const uploadFileList = reactive([])


  // 选择文件
  function submitSelect(){
    document.getElementsByClassName("el-upload--text")[0]?.click()
  }

  const handleFileChange = async (file, fileList) => {
    fileList.splice(0)
    const fileItem = {
      file: file.raw, // 文件对象
      uid: file.uid,  // 文件uid
      md5: null,  // 文件md5
      filename: file.name,  // 文件名
      status: STATUS.init.value,  // 上传状态
      uploadSize: 0,  // 已上传大小
      totalSize: file.size,  // 文件总大小
      progress: 0,  // md5计算进度
      pause: false,  // 是否暂停
      cancel: false,  // 是否取消
      chunkIndex: 0,  // 分片索引
      pid: props.currentPid,  // 文件pid
      errorMsg: null  // 错误信息
    }
    uploadFileList.unshift(fileItem) 
    let result = await computeMD5(fileItem)
    if(!result) return
    // 分片上传
    fileUpload(result)
  }

  
const getFileByUid = (uid) => {
  return uploadFileList.find(item => item.uid === uid); // 使用严格相等
};

const chunkSize = 1024 * 1024 * 5; // 分片大小4MB

// 计算文件进度
async function computeMD5(fileItem) {
    let file = fileItem.file; // 文件对象
    let chunks = Math.ceil(file.size / chunkSize);  // 计算分片数
    let blobSlice = File.prototype.slice || File.prototype.mozSlice || File.prototype.webkitSlice; // 兼容各种浏览器
    let currentChunk = 0;  // 当前分片
    let spark = new SparkMD5.ArrayBuffer(); // md5计算器
    let fileReader = new FileReader(); // 文件读取器
    const loadNext = () => {  // 读取下一块
    let start = currentChunk * chunkSize;  // 开始位置
    let end = Math.min(start + chunkSize, file.size); // 结束位置，避免越界
    fileReader.readAsArrayBuffer(blobSlice.call(file, start, end));  // 读取分片数据
    };
    loadNext(); // 开始读取第一块
    return new Promise((resolve, reject) => { // 返回promise
        let resultFile = getFileByUid(file.uid); // 获取文件对象
        resultFile.status = STATUS.init.value;  // 状态初始化

        fileReader.onload = (e) => {  // 文件读取成功
            spark.append(e.target.result);  // 追加分片数据
            currentChunk++; // 当前分片+1

            if (currentChunk < chunks) {  // 还有分片未读取
                let percent = Math.floor((currentChunk / chunks) * 100);  // 计算进度
                resultFile.progress = percent; // 更新进度
                loadNext();  // 读取下一块
            } else {
                let md5 = spark.end();  // 计算md5
                spark.destroy(); // 销毁计算器
                resultFile.progress = 100;  // 进度100%
                resultFile.md5 = md5;  // 保存md5
                resultFile.progress = 0;  // 进度重置
                resultFile.status = STATUS.uploading.value;  // 状态上传中
                resolve(fileItem.uid);   // 计算完成，返回uid
            }
        };

        // 文件读取失败
        fileReader.onerror = (error) => {
            resultFile.progress = -1; // 进度异常
            resultFile.status = STATUS.fail.value; // 状态失败
            console.error('File reading error:', error); // 打印错误
            resolve(fileItem.uid); // 计算失败，返回uid
        };
    });
}

const delList = ref([])

const emit = defineEmits(['updateFileListAndSpace'])

const fileUpload = async (uid, chunkIndex) => {
  chunkIndex = chunkIndex ? chunkIndex : 0
  // 分片上传
  let currentFile = getFileByUid(uid)
  const file = currentFile.file
  const fileSize = currentFile.totalSize
  const chunks = Math.ceil(fileSize / chunkSize)
  currentFile.status = STATUS.uploading.value
  for (let i = chunkIndex; i < chunks; i++) {
    let delIndex = delList.value.indexOf(uid) 
    if (delIndex != -1) {
      // 取消上传后，通知服务器删除临时文件
      delUploadFile(uid).then(() => {
        delList.value.splice(delIndex, 1)
      })
      break
    }
    currentFile = getFileByUid(uid) // 重新获取文件对象, 防止其他地方修改, 如暂停上传， 取消上传等
    if (currentFile.pause) {
      break
    }
    if (currentFile.cancel) {
      break
    }
    let start = i * chunkSize
    let end = start + chunkSize >= fileSize ? fileSize : start + chunkSize
    let chunkFile = file.slice(start, end)
    try {
      let result = await postUploadFile(currentFile.uid, currentFile.pid, chunkFile, currentFile.filename, file.type, currentFile.md5, i, chunks)
      if(result.code === 100){
        ElMessage.success('文件上传成功(秒传)～')
        currentFile.status = STATUS.success.value
        currentFile.progress = 100
        currentFile.chunkIndex = chunks - 1
        currentFile.uploadSize = fileSize
        emit("updateFileListAndSpace")
        break
      }
      else if(result.code === 200 && i === chunks - 1){
        currentFile.status = STATUS.success.value
        ElMessage.success('文件上传成功～')
        currentFile.progress = 100
        emit("updateFileListAndSpace")
      }else if(result.code !== 200){
        currentFile.status = STATUS.fail.value
        ElMessage.error(result.msg)
        currentFile.errorMsg = result.msg
        break
      }
      currentFile.chunkIndex = i
      currentFile.uploadSize = end
      currentFile.progress = Math.floor((end / fileSize) * 100)
    } catch (error) {
      console.log(error)
      currentFile.status = STATUS.fail.value
      ElMessage.error('文件上传失败，请重试')
      currentFile.errorMsg = error.message
      break
    }
  }
}

// 暂停上传
function pauseUpload(uid) {
  getFileByUid(uid).pause = true
}
// 继续上传
function continueUpload(uid) {
  const currentFile = getFileByUid(uid)
  currentFile.pause = false
  fileUpload(currentFile.uid, currentFile.chunkIndex + 1)
}

// 取消上传
function cancelUpload(uid) {
  let currentFile = getFileByUid(uid)
  if(currentFile.status !== STATUS.uploading.value){
    uploadFileList.splice(uploadFileList.findIndex(item => item.uid === uid), 1)
    return
  }
  currentFile.cancel = true
  delList.value.push(uid)
  uploadFileList.splice(uploadFileList.findIndex(item => item.uid === uid), 1)
}

// 重试
function retryUpload(uid) {
  const currentFile = getFileByUid(uid)
  currentFile.cancel = false
  fileUpload(currentFile.uid)
}

defineExpose({submitSelect, uploadFileList, delList, pauseUpload, continueUpload, cancelUpload, retryUpload})

  </script>
  
  <style scoped lang="scss">
  .avatar-uploader .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
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