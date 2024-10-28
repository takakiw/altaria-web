<template>
      <div class="file-item-top">
        <el-checkbox @change="checkChange" 
        v-model="checkAll"
        :indeterminate="activeFiles.length > 0 && activeFiles.length < props.files.length">
        </el-checkbox>
        {{ activeFiles.length == 0 ? "共" + props.files.length + "个文件"  : "已选中" + activeFiles.length + "个文件" }}
      </div>
      <el-scrollbar class="infinite-list">
          <div v-for="(file, index) in props.files" :file="file" :key="index" style="padding: 10px;">
              <FileSquareTable :file="file" 
              :checked="file.checked" 
              @addActiveFile="addActiveFile(index)" 
              @removeActiveFile="removeActiveFile(index)"
              @updateData="updateData"
              @cdDir="cdDir(index)"
              >
            </FileSquareTable>
          </div>
      </el-scrollbar>
</template>

<script setup>
import { ref } from 'vue';
import FileSquareTable from "./FileSquareTable.vue"


const props = defineProps({
  files: {
    type: Array,
    required: true
  }
})


const activeFiles = ref([])
const checkAll = ref(false)
defineExpose({activeFiles})

const addActiveFile = (index) => {
  emit("update:fileChecked", index, true)
  activeFiles.value.push(props.files[index])
  checkAll.value = activeFiles.value.length == props.files.length
}

const removeActiveFile = (index) => {
  emit("update:fileChecked", index, false)
  activeFiles.value.splice(activeFiles.value.indexOf(props.files[index]), 1)
  checkAll.value = activeFiles.value.length == props.files.length
}

const activeAll = () => {
  emit("activeAll")
  checkAll.value = true
  activeFiles.value = props.files.filter(file => file.checked)
}

const cancelAll = () => {
  emit("cancelAll")
  checkAll.value = false
  activeFiles.value = []
}

const checkChange = (e) => {
  if(e){
    activeAll()
  }else{
    cancelAll()
  }
}

const updateData = () => {
  emit("updateData")
  activeFiles.value = props.files.filter(file => file.checked)
  checkAll.value = false
  console.log(activeFiles.value, checkAll);
  
}

const cdDir = (index) => {
  console.log(props.files[index]);
  
  emit("cdDir", props.files[index].name)
}

const emit = defineEmits(['update:fileChecked', "activeAll", "cancelAll", "updateData", "cdDir"])
</script>

<style lang="scss" scoped>

.file-item-top{
  width: 100%;
  box-sizing: border-box;
  display: flex;
  padding-left: 13px;
  align-items: center;
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