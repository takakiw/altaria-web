<template>
    <Navigation ref="ncomponent" />
    <router-view v-slot="{ Component }">
        <component ref="viewComponent" :is="Component" @add="add"/>
    </router-view>
</template>

<script setup>
import Navigation from '@/components/common/Navigation.vue';
import { onMounted, ref } from 'vue';
import { getUserInfo } from '../service/user';
import { useUserStore } from '../store';
const userStore = useUserStore();
const ncomponent = ref(null);

const add = (file) => {
    ncomponent.value.add(file);
}

onMounted(() => {
  console.log('onMounted Layout');
    if (localStorage.getItem('token')){
      getUserInfo(-1).then(res => {
      if (res.code!== 200) {
        return;
      }
      userStore.setUserInfo(res.data);
    })
  }
});

</script>

<style lang="scss" scoped>

</style>