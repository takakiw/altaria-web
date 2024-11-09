<template>
    <div class="files-container">
        <div v-if="pathList.length > 1" class="path-container">
            <div v-for="(item, index) in pathList" :key="index" class="path-item" @click="handlePathClick(index)">
                >{{ item.fileName }}
            </div>
        </div>
        <div v-else class="path-container">
            <div class="path-item">
                全部文件
            </div>
        </div>
        <div class="content">
            <FileItem
            ref="fileItemRef"
            :files="shareFiles"
            :shareMode="true"
            @activeAll="activeAll"
            @cancelAll="cancelAll"
            @update:fileChecked="updateFileChecked"
            @cdDir="cdDir"
            />
        </div>
    </div>
</template>

<script setup>
import FileItem from '../File/FileItem.vue';
import { onMounted, reactive, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { getShareFileList, getSharePathInfo } from '../../../service/share';
import { ElMessage } from 'element-plus';

const fileItemRef = ref(null) // activeFiles
const route = useRoute()
const router = useRouter()
const shareId = route.params.shareId
const shareFiles  = reactive([]) // 保存分享文件信息
const pathList = reactive([{id: '', fileName: "全部文件"}])

defineExpose({fileItemRef})
if(route.query.path){
    pathList[0].id = route.query.path
}

const updateFileList = (shareId, pathId) => {
    getShareFileList(shareId, pathId).then(res => {
        if(res.code === 200){
            shareFiles.splice(0)
            res.data.forEach(item => {
                shareFiles.push({...item, checked: false})
            })
        }else{
            ElMessage.error(res.msg)
            if(res.code == 500){
                emit("toCheck")
            }
        }
    })
}

const handlePathClick = (index) => {
    if(index == pathList.length - 1) return
    const currentPath = pathList[index].id
    pathList.splice(index + 1, pathList.length - index - 1)
    updateFileList(shareId, currentPath)
}

const cdDir = (index) => {
    const nextPath = shareFiles[index].id
    pathList.push(shareFiles[index])
    updateFileList(shareId, nextPath)
}

const activeAll = () => {
    console.log("activeAll");
    for (let i = 0; i < shareFiles.length; i++) {
        shareFiles[i].checked = true
    }
}
const cancelAll = () => {
    console.log("cancelAll");
    for (let i = 0; i < shareFiles.length; i++) {
        shareFiles[i].checked = false
    }
}

const updateFileChecked = (index, flag) => {
    shareFiles[index].checked = flag
}

// 初始化
onMounted(() => {
    const currentPath = pathList[pathList.length - 1].id
    if(currentPath){
        getSharePathInfo(shareId, currentPath).then(res => {
            if(res.code === 200){
                pathList.splice(0)
                pathList.push(...res.data)
                updateFileList(shareId, currentPath)
            }else{
                ElMessage.error(res.msg)
                pathList.splice(0)
            }
        })
    }
    else{
        updateFileList(shareId, currentPath)
    }
})

const emit = defineEmits(["toCheck"])

</script>

<style lang="scss" scoped>
.files-container {
    width: 100%;
    height: 100%;
}
.path-container {
    display: flex;
    align-items: center;
    height: 40px;
    padding: 0 20px;
    background-color: #f5f5f5;
    border-bottom: 1px solid #e5e5e5;
}
.path-item {
    cursor: pointer;
    margin-right: 10px;
    font-size: 16px;
    color: #409eff;
}




</style>