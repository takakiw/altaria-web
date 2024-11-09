<template>
    <div class="share-table">
        <el-scrollbar class="infinite-list">
            <el-table 
            :data="props.shareList" 
            style="width: 100%" 
            :stripe="true"
            empty-text="暂时还没有分享的链接"
            @selection-change="handleSelectionChange">
                <el-table-column type="selection" width="55" />
                <el-table-column prop="name" label="名称" width="320">
                </el-table-column>
                <el-table-column prop="createTime" label="创建时间" width="200">
                </el-table-column>
                <el-table-column label="过期时间" width="200">
                    <template #default="scope">
                        <div v-html="getShareShowExpireTime(scope.row.expire)"></div>
                    </template>
                </el-table-column>
                <el-table-column prop="sign" label="密码" width="100">
                </el-table-column>
                <el-table-column label="下载次数" prop="visit" width="100">
                </el-table-column>
                <el-table-column fixed="right" label="操作" min-width="120">
                    <template #default="scope">
                        <el-button link type="primary" size="small" @click="copyShareUrl(scope.row)">
                            复制
                        </el-button>
                        <el-button link type="primary" size="small" @click="cancelShare(scope.row)">
                            取消分享
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-scrollbar>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import { getShareShowExpireTime, getShareUrl } from '../../../utils/StandardData';
import { delCancelShare } from '../../../service/share';
import { ElMessage, ElMessageBox } from 'element-plus';



const props = defineProps({
    shareList: {
        type: Array,
        default: () => []
    }
})

const activeRow = ref([])

const handleSelectionChange = (selection) => {
    activeRow.value = selection
}

const copyShareUrl = async (row) => {
    await navigator.clipboard.writeText(getShareUrl(row.url, row.sign))
    ElMessage.success('复制成功')
}

const cancelShare = (row) => {
    ElMessageBox.confirm(
    '确定要取消分享吗?',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
      roundButton: true,
      showClose: false,
      customStyle: {
        top: '-20%',
        bottom: 'auto',
      }
    }
  ).then(() => {
        const ids = [row.id]
        delCancelShare(ids).then((res) => {
            if (res.code == 200){
                ElMessage.success('取消分享成功')
                emit("cancelShareList", ids)
            }else{
                ElMessage.error(res.msg)
            }
        }).catch((err) => {
            console.log(err);
            ElMessage.error('取消分享失败')
        })
    }).catch(() => {

    })
}

defineExpose({ activeRow })
const emit = defineEmits(['cancelShareList'])



</script>

<style lang="scss" scoped>
.share-table {
    width: 100%;
    margin-top: 20px;
    height: 720px;
    border-bottom: 1px solid #d8d8d8;
}
.infinite-list{
  width: 100%;
  height: 100%;
  padding: 0;
  margin: 0;
  overflow: hidden;
}
</style>

<style>

</style>