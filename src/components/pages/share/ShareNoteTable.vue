<template>
    <div class="share-table">
        <el-scrollbar class="infinite-list">
            <el-table 
            :data="props.noteList" 
            style="width: 100%" 
            :stripe="true"
            :border="true"
            empty-text="暂时还没有公开的笔记">
                <el-table-column prop="title" label="名称" width="320">
                </el-table-column>
                <el-table-column prop="category" label="分类" width="120">
                </el-table-column>
                <el-table-column prop="createTime" label="创建时间" width="200">
                </el-table-column>
                <el-table-column prop="updateTime" label="更新时间" width="200">
                </el-table-column>
                <el-table-column prop="commentCount" label="评论数" width="100">
                </el-table-column>
                <el-table-column fixed="right" label="操作" min-width="120">
                    <template #default="scope">
                        <el-button link type="primary" size="small" @click="copyShareUrl(scope.row)">
                            复制
                        </el-button>
                        <el-button link type="primary" size="small" @click="cancelShare(scope.row)">
                            设为私密
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-scrollbar>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import { getShareNoteUrl } from '../../../utils/StandardData';
import { delCancelShare } from '../../../service/share';
import { ElMessage, ElMessageBox } from 'element-plus';
import { PutUpdateNote } from '../../../service/note';


const props = defineProps({
    noteList: {
        type: Array,
        default: () => []
    }
})

const copyShareUrl = async (row) => {
    await navigator.clipboard.writeText(getShareNoteUrl(row.id))
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
    PutUpdateNote(row.id, null, null, !row.isPrivate, null).then((res) => {
      if(res.code === 200){
        ElMessage.success('取消分享成功')
        emit("updateNoteList")
      }else{
        ElMessage.error('取消分享失败')
      }
    })
    }).catch(() => {
    })
}

const emit = defineEmits(['updateNoteList'])

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