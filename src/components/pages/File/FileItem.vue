<template>
      <div class="file-item-top">
        <div class="top-left" v-if="props.files.length > 0">
          <el-checkbox @change="checkChange" 
          v-model="checkAll"
          :indeterminate="activeFiles.length > 0 && activeFiles.length < props.files.length">
          </el-checkbox>
          <span style="margin-left: 10px; line-height: 30px;">{{ activeFiles.length == 0 ? "共" + props.files.length + "个文件"  : "已选中" + activeFiles.length + "个文件" }}</span>
        </div>
        <div class="top-right" v-if="!shareMode && props.menuIndex !== '6'">
            <!-- 显示模式 -->
              <div type="link" size="small" @click="viewItemType = viewItemType ^ 1" style="cursor: pointer;"> 
                <el-tooltip content="列表视图" placement="top">
                  <el-icon v-if="viewItemType == 0"><Grid /></el-icon>
                  <el-icon v-else><Expand /></el-icon>
                </el-tooltip>
              </div>

            <!-- 排序方式 -->
          <el-select
            v-model="selectValue"
            placeholder="Select"
            size="small"
            :fit-input-width="true"
            style="width: 160px;"
            @change="sortFile"
          >
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
          </div>
      </div>
      <div class="file-item-content">
        <el-scrollbar class="infinite-list" v-if="props.files.length > 0">
          <div v-if="viewItemType == 0" class="list-view">
            <div  v-for="(file, index) in props.files" :file="file" :key="index" style="padding: 10px;">
                <FileSquareTable :file="file" 
                  :menuIndex="`${props.menuIndex}`" 
                  :checked="file.checked" 
                  :shareMode="props.shareMode"
                  @addActiveFile="addActiveFile(index)" 
                  @removeActiveFile="removeActiveFile(index)"
                  @updateData="updateData(index)"
                  @cdDir="cdDir(index)"
                  @moveFile="moveFile(index)"
                  @shareFile="shareFile(index)"
                  >
              </FileSquareTable>            
            </div>
          </div>
          <div v-if="viewItemType == 1" class="list-view" style="gap: 3px;">
            <div  v-for="(file, index) in props.files" :file="file" :key="index" style="width: 100%;">
                <FileTable :file="file" 
                  :menuIndex="`${props.menuIndex}`" 
                  :checked="file.checked" 
                  :shareMode="props.shareMode"
                  @addActiveFile="addActiveFile(index)" 
                  @removeActiveFile="removeActiveFile(index)"
                  @updateData="updateData(index)"
                  @cdDir="cdDir(index)"
                  @moveFile="moveFile(index)"
                  @shareFile="shareFile(index)"
                  >
              </FileTable>            
            </div>
          </div>
            
        </el-scrollbar>
        <div v-else>
          <el-empty description="暂无文件">
          </el-empty>
        </div>
      </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import FileSquareTable from "./FileSquareTable.vue"
import FileTable from "./FileTable.vue"
import { Expand, Grid } from '@element-plus/icons-vue'

const viewItemType = ref(0)

const props = defineProps({
  files: {
    type: Array,
    required: true
  },
  selectValue: {
    type: String,
    required: false,
    default: "0"
  }, menuIndex: {
    type: String,
    required: false,
    default: "1"
  },
  shareMode: {
    type: Boolean,
    required: false,
    default: false
  }
})

const activeFiles = ref([])
const checkAll = ref(false)

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

watch(() => props.files, () => {
  activeFiles.value = props.files.filter(file => file.checked)
  checkAll.value = activeFiles.value.length == props.files.length
}, { deep: true })

const activeAll = () => {
  emit("activeAll")
  checkAll.value = true
  activeFiles.value = props.files.filter(file => file.checked)
}

const cancelAll = () => {
  emit("cancelAll")
  checkAll.value = false
  activeFiles.value = props.files.filter(file => file.checked)
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
  
}

const cdDir = (index) => {
  cancelAll()
  emit("cdDir", index)
}

const moveFile = (index) => {
  emit("moveFile", index)
}

const selectValue = ref(props.selectValue)

const options = [
  /* 更新时间 */
  { value: "0", label: "按更新时间排序" },
  { value: "1", label: "按更新时间倒序" },
  /* 大小 */
  { value: "2", label: "按大小排序" },
  { value: "3", label: "按大小倒序" },
  /* name */
  { value: "4", label: "按名称排序" },
  { value: "5", label: "按名称倒序" },
]

const sortFile = (value) => {
  emit("updateSelectValue", value)
}

const shareFile = (index) => {
  emit("shareFile", index)
}


const emit = defineEmits(['update:fileChecked', "activeAll", "cancelAll", "updateData", "cdDir", "updateSelectValue", "moveFile", "shareFile"])
defineExpose({activeFiles})
</script>

<style lang="scss" scoped>

.file-item-top{
  width: 100%;
  height: 40px;
  box-sizing: border-box;
  display: flex;
  padding-left: 13px;
  align-items: center;
  justify-content: space-between;
}
.top-left{
  display: flex;
  align-items: center;
  font-size: 14px;
  color: #4e5969;
}
.top-right{
  display: flex;
  align-items: center;
  font-size: 14px;
  gap: 15px;
}

.file-item-content{
  width: 100%;
  height: 710px;
  padding: 0;
  margin: 0;
}

.infinite-list{
  width: 100%;
  height: 100%;
  padding: 0;
  margin: 0;
  overflow: hidden;
  border-bottom: 1px solid #e6e6e6;
}

.file-list-tag{
  width: 100%;
  box-sizing: border-box;
  display: flex;
  font-size: 12px;
  border-bottom: 1px solid #f4f1f1;
  padding-bottom: 4px;
}

.list-view{
  display: flex; 
  flex-wrap: wrap;
  overflow: hidden; 
  width: 100%;
  height: 100%;
  gap: 15px;
}


</style>

<style>

.el-scrollbar__view{
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  padding: 0px;
  margin: 0;
}
.el-scrollbar{
  padding: 0;
  margin: 0;
}
</style>