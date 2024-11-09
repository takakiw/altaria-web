<template>
  <!-- 2(video) 3(audio) 4(Pdf) 5(word) 6(excel) 7(text) -->
  <div class="file-preview">
      <div v-if="file.type === 2 && isShowPreview"><!-- 视频 -->
        <MVideo :file="file" :shareMode="props.shareMode"/>
      </div>
      <div v-else-if="props.file.type === 3 && isShowPreview"> <!-- 音频 -->
        <MAudio :file="file" :shareMode="props.shareMode"/>
      </div>
      <div v-else-if="props.file.type === 4">
        <MPdf :file="file" :shareMode="props.shareMode"/>
      </div>
      <div v-else-if="props.file.type === 5">
        <MDocx :file="file" :shareMode="props.shareMode"/>
      </div>
      <div v-else-if="props.file.type === 6">
        <MXlsx :file="file" :shareMode="props.shareMode"/>
      </div>
      <div v-else-if="props.file.type === 7">
        <MText :file="file" :shareMode="props.shareMode"/>
      </div>
  </div>
</template>

<script setup>
import {reactive, ref } from "vue";
import MVideo from "./components/MVideo.vue";
import MAudio from "./components/MAudio.vue";
import MPdf from "./components/MPdf.vue";
import MDocx from "./components/MDocx.vue";
import MXlsx from './components/MXlsx.vue'
import MText from "./components/MText.vue";
const props = defineProps({
  file: {
      type: Object,
      required: true
  },
  isShowPreview:{
      type: Boolean,
      default: false
  },shareMode:{
      type: Boolean,
      default: false
  }
})
</script>

<style lang="scss" scoped>

.file-preview {
  display: flex;
  justify-content: center;
  align-items: center;
}

</style>