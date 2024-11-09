<template>
    <Navigation ref="navigationRef" @updateFileListAndSpace="updateFileListAndSpace"/>
      <router-view v-slot="{ Component }">
          <component :is="Component" @addFile="addFile" :updateDataFlag="updateDataFlag" />
      </router-view>
</template>

<script setup>
import Navigation from '@/components/common/Navigation.vue';
import { onMounted, ref } from 'vue';
import { useUserStore } from '../store';

const navigationRef = ref(null);

const addFile = (pid) => {
  navigationRef.value.addFile(String(pid));
}
const userStore = useUserStore();
onMounted(() => {
  console.log("layout mounted");
  
})


// 通知files更新
const updateDataFlag = ref(false);
const updateFileListAndSpace = () => {
  updateDataFlag.value =! updateDataFlag.value;
}

</script>

<style lang="scss" scoped>

</style>