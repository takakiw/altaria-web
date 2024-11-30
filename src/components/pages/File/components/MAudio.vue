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
import { getSharePreviewUrl } from '../../../../service/share';
import { useRoute } from 'vue-router';
const props = defineProps({
  file: {
      type: Object,
      required: true
  },
  shareMode: {
      type: Boolean,
      default: false
  }
})

const audioUrl = ref("")
const audioUrlComputed = computed(() => {
    return audioUrl.value
})

const route = useRoute()
const shareId = route.params.shareId

if(props.shareMode){
  getSharePreviewUrl(shareId, props.file.id).then(res => {
      audioUrl.value = import.meta.env.VITE_BASE_HOST + import.meta.env.VITE_API_URI + res.data
  }).catch(err => {
      console.log(err)
  })
}else{
  getFileSignUrl(props.file.id).then(res => {
      audioUrl.value = import.meta.env.VITE_BASE_HOST + import.meta.env.VITE_API_URI + res.data
  }).catch(err => {
      console.log(err)
  })
}



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