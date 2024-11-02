<template>
    <div class="text-container">
        <el-scrollbar class="infinite-list">
            <div style="background-color:rgb(255, 252, 232);; height: 600px"><pre>{{ text }}</pre></div>
        </el-scrollbar>
    </div>
</template>

<script setup>
import { computed, ref } from 'vue';
import { getFileSignUrl } from '../../../../service/file';
import axios from 'axios';

const props = defineProps({
    file: {
        type: Object,
        required: true
    }
})


const text = ref('Hello World');

getFileSignUrl(props.file.id).then(res => {
    if (res.code === 200) {
        axios.get(import.meta.env.VITE_BASE_HOST + res.data).then(res => {
            text.value = res.data;
        })
    }
})

</script>

<style lang="scss" scoped>

.text-container {
    display: flex;
    justify-content: center;
    width: 550px;
    height: 600px;
    background-color: rgb(255, 252, 232);
}



</style>

<style>

</style>