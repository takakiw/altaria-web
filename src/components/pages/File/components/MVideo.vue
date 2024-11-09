<template>
    <div>
        <vue3VideoPlay ref="videoPlayerRef"
          v-bind="options"
          @play="onPlay"
        />
    </div>
</template>

<script setup>
import {  getFileSignUrl } from "@/service/file";
import { computed, reactive, ref } from 'vue';
import { getSharePreviewUrl } from "../../../../service/share";
import { useRoute } from "vue-router";

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

const route = useRoute();
const shareId = route.params.shareId;

const videUrl = ref("");
if(props.shareMode){
  getSharePreviewUrl(shareId, props.file.id).then(res => {
    videUrl.value = import.meta.env.VITE_BASE_HOST + res.data;
  });
}else{
  getFileSignUrl(props.file.id).then(res => {
    videUrl.value = import.meta.env.VITE_BASE_HOST + res.data;
  });
}


const videoUrlComputed = computed(() => {
    return videUrl.value;
})

const videoPlayerRef = ref(null);
const options = reactive({
  width: "800px", //播放器宽度
  height: "450px", //播放器高度
  color: "#409eff", //主题色
  title: props.file.fileName, //视频名称
  src: videoUrlComputed, //视频源
  muted: false, //静音
  webFullScreen: false,
  speedRate: ["0.75", "1.0", "1.25", "1.5", "2.0"], //播放倍速
  autoPlay: true, //自动播放
  loop: false, //循环播放
  mirror: false, //镜像画面
  ligthOff: false, //关灯模式
  volume: 0.3, //默认音量大小
  control: true, //是否显示控制
  controlBtns: [
    "audioTrack",  //音轨按钮
    "quality", //画质按钮
    "speedRate", //播放速度按钮
    "volume", //音量按钮
    "setting", // 设置按钮
    "pip", // 画中画按钮
    "fullScreen", // 全屏按钮
  ], //控制按钮
});

const onPlay = () => {
  
}
</script>

<style lang="scss" scoped>

</style>

<style lang="scss">

.d-player-contextmenu{
  display: none;
  .d-player-contextmenu-body{
    display: none;
  }
}
</style>