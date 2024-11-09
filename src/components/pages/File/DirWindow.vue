<template>
    <div class="move-window">
        <div v-if="pathList.length != 0" class="path-list">
          <div v-for="(item, index) in pathList" :key="index" class="path-item" @click="getFileByPath(index)">
             >{{item.name}}
          </div>
        </div>
        <span v-else class="path-list">全部文件</span>
        <div class="file-list">
            <el-scrollbar class="infinite-list" v-if="fileList.length != 0">
                <div v-for="(file, index) in fileList" :key="index" class="file-item" @click="handleClick(file)">
                    <div class="file-icon">
                        <img :src="getIconImage(IconImageEnum[0])" style="width: 40px; height: 40px;"/>
                    </div>
                    <div class="file-name">
                        {{ file.fileName }}
                    </div>
                    <hr/>
                </div>
            </el-scrollbar>
            <div v-else class="no-file">
                <el-empty description="该目录下没有文件夹" />
            </div>
        </div>
    </div>
</template>

<script setup>
import { reactive, ref, watch } from 'vue';
import { getFileList } from '../../../service/file';
import IconImageEnum, { getIconImage } from "../../../enums/IconImageEnum";

const props = defineProps({
    excludeFiles: {
        type: Array,
        default: () => []
    },
    moveFileShow: {
        type: Boolean,
        default: false
    }
    
})


const pathList = reactive([{ id: "0", name: "全部文件" }])
const fileList = reactive([])

let currentPath = pathList.length > 0? pathList[pathList.length - 1].id : "0"
getFileList(currentPath, 0, undefined, undefined).then(res => {
    if (res.code === 200) {
        const excludeFileIds = props.excludeFiles.map(file => file.id)
        fileList.splice(0)
        fileList.push(...res.data.records.filter(file => !excludeFileIds.includes(file.id)))
    }
}).catch(err => {
    console.log(err);
})

const updateFileList = () => {
    currentPath = pathList.length > 0? pathList[pathList.length - 1].id : "0"
    getFileList(currentPath, 0, undefined, undefined).then(res => {
            if (res.code === 200) {
                const excludeFileIds = props.excludeFiles.map(file => file.id)
                fileList.splice(0)
                fileList.push(...res.data.records.filter(file => !excludeFileIds.includes(file.id)))
            }
        }).catch(err => {
            console.log(err);
        })
}

const handleClick = (file) => {
    if (file.type == 0) {
        pathList.push({ id: file.id, name: file.fileName })
        updateFileList()
    }
}

const getFileByPath = (index) => {
    if(index == pathList.length - 1) return
    pathList.splice(index + 1, pathList.length - index - 1)
    updateFileList()
}

defineExpose({pathList})

watch(() => props.moveFileShow, (newVal) => {
    if (newVal) {
        pathList.splice(0)
        pathList.push({ id: "0", name: "全部文件" })
        updateFileList()
    }
})

</script>

<style lang="scss" scoped>

.move-window {
    height: 100%;
    width: 100%;
    display: flex;
    flex-direction: column;
}

.path-list {
    width: 100%;
    height: 40px;
    display: flex;
    align-items: center;
    gap: 10px;
    background-color: #f5f5f5;
    border-bottom: 1px solid #e5e5e5;
    color: #409eff;
}

.path-item {
    cursor: pointer;
}


.file-list {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    overflow: hidden;
}
.file-item {
    width: 100%;
    display: flex;
    align-items: center;
    cursor: pointer;
    transition: background-color 0.3s ease;
}
.file-item:hover {
    background-color: #f5f5f5;
}
.file-icon {
    width: 40px;
    height: 40px;
    margin-right: 10px;
}

.file-name {
    
    
    
}

</style>

<style>
.infinite-list {
  width: 100%;
  height: 100%;
  padding: 0;
  margin: 0;
  list-style: none;
  display: flex;
  flex-wrap: wrap;
  flex-direction: row;
}
.el-scrollbar__view{
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
}
</style>