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
import { useUserStore } from '../store';

const userStore = useUserStore();

onMounted(() => {
  if (localStorage.getItem('token')){
      getUserInfo(-1).then(res => {
      if (res.code!== 200) {
        return;
      }
      userStore.setUserInfo(res.data);
    })
  }
  
})

</script>

<style lang="scss" scoped>

</style>

<style>

</style>