<template>
  <div class="share-window">
    <div class="share-window-header">
      <el-scrollbar class="infinite-list">
        <div v-for="(file, index) in files" :key="index" >
        <div>{{file.fileName}}</div>
      </div>
      </el-scrollbar>
    </div>
    <div class="share-window-body">
      <!-- 选择分享密码（随机， 自定义）， 选择分享过期时间（1天， 7天， 1月） -->
      <div style="display: flex; align-items: center; gap: 80px; width: 100%;">
        <div>设置分享密码:</div>
        <el-radio-group v-model="radio">
          <el-radio value="1" size="large">随机密码</el-radio>
          <div style="display: flex; align-items: center;">
            <el-radio value="2" size="large">自定义密码</el-radio>
            <el-input v-model="password" :disabled="radio != 2 " size="mini" placeholder="请输入自定义密码"
            style="width: 150px;height: 25px;margin-left: -20px;" ></el-input>
          </div>
        </el-radio-group>
      </div>
      <div style="display: flex; align-items: center; gap: 100px; width: 100%;">
        <div>设置分享过期时间:</div>
        <el-radio-group v-model="expireRadio">
          <el-radio value="1" size="large">1天</el-radio>
          <el-radio value="2" size="large">7天</el-radio>
          <el-radio value="3" size="large">1月</el-radio>
        </el-radio-group>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';


const files = ref([])
for (let i = 0; i < 100; i++) {
  files.value.push({
    fileName: `文件${i}`,
    size: `${Math.floor(Math.random() * 10000) / 100}KB`,
    date: new Date().toLocaleString(),
    type: '文件'
  })  
}

const password = ref('')

const radio = ref('1')
const expireRadio = ref('1')

</script>

<style lang="scss" scoped>
.share-window {
  padding: 20px;
  width: 600px;
  height: 800px;
  display: flex;
  flex-direction: column;
  align-items: center;
  font-family: Inter, 'Helvetica Neue', Helvetica, 'PingFang SC',
  'Hiragino Sans GB', 'Microsoft YaHei', '微软雅黑', Arial, sans-serif;
  color: #6b7785;
  font-size: 14px;
  gap: 20px;
}
.share-window-header {
  width: 600px;
  max-height: 120px;
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}
.infinite-list{
  width: 100%;
  display: flex;
  flex-wrap: wrap;
}
.share-window-body {
  width: 600px;
  height: 600px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
}

</style>

<style>
.el-scrollbar__view{
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 20px;
  align-content: center;
}
</style>