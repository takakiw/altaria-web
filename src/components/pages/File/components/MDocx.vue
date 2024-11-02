<template>
    <div class="docx-container">
        <vue-office-docx
            :src="docxComputed"
            style="height: 600px; width: 100%;"
            @rendered="renderedHandler"
            @error="errorHandler"
        />
    </div>
</template>

<script setup>
//引入VueOfficeDocx组件
import VueOfficeDocx from '@vue-office/docx'
//引入相关样式
import '@vue-office/docx/lib/index.css'
import { computed, ref } from 'vue';
import { getFileSignUrl } from '../../../../service/file';
import axios from 'axios';

const props = defineProps({
    file :{
        type: Object,
        required: true
    }
})

const docx =  ref("")

const docxComputed = computed(() => {
    return docx.value
})

getFileSignUrl(props.file.id).then(res => {
    if (res.code === 200) {
        axios.get(import.meta.env.VITE_BASE_HOST + res.data, { responseType: 'blob' }).then(res => {
            docx.value = res.data
        });
    }
})

const renderedHandler = () => {
    console.log('渲染完成')
}
const errorHandler = (error) => {
    console.log('渲染出错', error)
}

</script>

<style lang="scss" scoped>
.docx-container {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    min-width: 900px;
}

</style>