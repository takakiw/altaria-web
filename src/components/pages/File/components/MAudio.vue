<template>
    <div>
        <vue-audio-player
          ref="audioPlayer"
          :audio-list="audioList"
          :show-play-loading="false"
        >
        </vue-audio-player>
    </div>
</template>

<script setup>
import VueAudioPlayer from '@liripeng/vue-audio-player'
import {computed, reactive, ref } from "vue";
import { getFileSignUrl } from '../../../../service/file';
const props = defineProps({
  file: {
      type: Object,
      required: true
  }
})

const audioUrl = ref("")
const audioUrlComputed = computed(() => {
    return audioUrl.value
})

getFileSignUrl(props.file.id).then(res => {
    audioUrl.value = import.meta.env.VITE_BASE_HOST + res.data
}).catch(err => {
    console.log(err)
})



// 音频播放器
const audioList =  reactive([
{
  src: audioUrlComputed, // Required
  title: props.file.fileName, // 音频名称
},
]);
</script>

<style lang="scss" scoped>

</style>