<template>
  <div class="share-window">
    <div class="share-window-header">
      <el-scrollbar class="infinite-list">
        <div v-for="(file, index) in props.files" :key="index" >
        <div style="color: #114BA3;">{{file.fileName}}</div>
      </div>
      </el-scrollbar>
    </div>
    <div class="share-window-body">
      <!-- 选择分享密码（随机， 自定义）， 选择分享过期时间（1天， 7天， 1月） -->
      <div style="display: flex; align-items: center; gap: 40px; width: 100%;">
        <div>分享密码:</div>
        <el-radio-group v-model="radio">
          <el-radio value="1" size="large">随机密码</el-radio>
          <div style="display: flex; align-items: center;">
            <el-radio value="2" size="large">自定义密码</el-radio>
            <el-input v-model="password" :disabled="radio != 2 " size="small" :placeholder="radio == '1'? '' : '4位数的密码'"
            style="width: 80px;height: 25px;margin-left: -20px;" ></el-input>
          </div>
        </el-radio-group>
      </div>
      <div style="display: flex; align-items: center; gap: 50px; width: 100%;">
        <div>分享过期时间:</div>
        <el-radio-group v-model="expireRadio">
          <el-radio value="1" size="large">1天</el-radio>
          <el-radio value="2" size="large">7天</el-radio>
          <el-radio value="3" size="large">1月</el-radio>
        </el-radio-group>
      </div>
    </div>
    <div class="share-window-bottom">
        <el-button type="primary" size="large" @click="handleShare">分享</el-button>
        <el-button type="default" size="large" @click="handleCancel">取消</el-button>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import { getShareExpireTime } from '../../../../utils/StandardData';


const props = defineProps({
  files: {
    type: Array,
    default: () => []
  }
})

const password = ref('')
const radio = ref('1')
watch(radio, (newVal) => {
  if (newVal === '1') {
    password.value = ''
  }
})
const expireRadio = ref('1')

const handleCancel = () => {
    emit('cancelShare')
}

const handleShare = () => {
  emit('handleShare', {
    sign: password.value,
    expire: getShareExpireTime(expireRadio.value)
  })
}

const emit = defineEmits(['cancelShare', "handleShare"])

</script>

<style lang="scss" scoped>
.share-window {
  width: 100%;
  height: 300px;
  display: flex;
  flex-direction: column;
  align-items: center;
  font-family: Inter, 'Helvetica Neue', Helvetica, 'PingFang SC',
  'Hiragino Sans GB', 'Microsoft YaHei', '微软雅黑', Arial, sans-serif;
  color: #6b7785;
  font-size: 14px;
  gap: 30px;
}
.share-window-header {
  width: 100%;
  max-height: 120px;
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
  border: 1px solid #e4e4e4;
  border-radius: 4px;
}
.infinite-list{
  width: 100%;
  display: flex;
  flex-wrap: wrap;
}
.share-window-body {
  width:100%;
  max-height: calc(100% - 120px);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
}
.share-window-bottom {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 80px;
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