<template>
    <div class="pdf-container">
        <vue-office-pdf 
            :src="PdfUrlComputed"
            style="height: 600px; width: 100%;"
            @rendered="renderedHandler"
            @error="errorHandler"
        />
    </div>
</template>

<script setup>
import VueOfficePdf from '@vue-office/pdf'
import { computed } from 'vue';
import { ref } from 'vue';
import { getFileSignUrl } from '../../../../service/file';
import { useRoute } from 'vue-router';
import { getSharePreviewUrl } from '../../../../service/share';

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

const pdf = ref("")

const PdfUrlComputed = computed(() => {
    return pdf.value
})


const route = useRoute()
const shareId = route.params.shareId
if(props.shareMode){
  getSharePreviewUrl(shareId, props.file.id).then(res => {
      pdf.value = import.meta.env.VITE_BASE_HOST + import.meta.env.VITE_API_URI + res.data
  }).catch(err => {
      console.log(err)
  })
}else{
  getFileSignUrl(props.file.id).then(res => {
      pdf.value = import.meta.env.VITE_BASE_HOST + import.meta.env.VITE_API_URI + res.data
  }).catch(err => {
      console.log(err)
  })
}

const renderedHandler = () => {
    
}

const errorHandler = (error) => {
    console.log('error', error)
}


</script>

<style lang="scss" scoped>

.pdf-container {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    min-width: 900px;
}

</style>