<template>
  <Navigation />
  <el-divider />
  <Container>
    
  </Container>
</template>

<script setup>

import Container from '@/components/common/Container.vue'
import Navigation from '../components/common/Navigation.vue';
import { getUserInfo } from '../service/user';
import { onMounted } from 'vue';
import { el } from 'element-plus/es/locales.mjs';
import { ElMessage } from 'element-plus';

onMounted(() => {
  getUserInfo(1).then(res => {
    if (res.code === 200) {
      console.log(res.data);
    }
    else{
      ElMessage.error(res);
    }
  });
})

</script>

<style lang="scss" scoped>

</style>

<style>
.el-divider--horizontal{
margin-top: 0;;
}
</style>