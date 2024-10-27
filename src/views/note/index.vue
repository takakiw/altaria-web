<template>
    <div>
        <el-button type="primary" @click="allActive">全选</el-button>
        <el-button type="primary" @click="cancelAll">取消全选</el-button>
        <ul :v-infinite-scroll-disabled="true" class="infinite-list" style="overflow: auto">
            <div v-for="(file, index) in files" :file="file" :key="index" style="padding: 20px;">
                <FileSquareTable :file="file" :checked="file.checked" @addFile="addFile(index)" @removeFile="removeFile(index)"></FileSquareTable>
            </div>
        </ul>
    </div>
</template>

<script setup>
import { reactive, ref } from 'vue';
import FileSquareTable from '../../components/pages/File/FileSquareTable.vue';

const files = reactive([])

for (let i = 0; i < 100; i++) {
    files.push({
        name: `文件${i}`,
        size: `${Math.floor(Math.random() * 10000) / 100}KB`,
        type: i % 9,
        checked: false
    })
}

const activeFiles = ref([])

const addFile = (index) => {
    files[index].checked = true
    activeFiles.value.push(files[index])
}

const removeFile = (index) => {
    files[index].checked = false
    activeFiles.value.splice(activeFiles.value.indexOf(files[index]), 1)
}

const allActive = () => {
    files.forEach(file => {
        if (!file.checked) {
            file.checked = true
            activeFiles.value.push(file)
        }
    })
}

const cancelAll = () => {
    files.forEach(file => {
        if (file.checked) {
            file.checked = false
            activeFiles.value.splice(activeFiles.value.indexOf(file), 1)
        }
    })
}


</script>

<style lang="scss" scoped>

</style>

<style>
.infinite-list {
  height: 80vh;
  padding: 0;
  margin: 0;
  list-style: none;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
}
.infinite-list .infinite-list-item {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 50px;
  background: var(--el-color-primary-light-9);
  margin: 10px;
  color: var(--el-color-primary);
}
.infinite-list .infinite-list-item + .list-item {
  margin-top: 10px;
}
</style>