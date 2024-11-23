<template>
    <div class="note-card-wrapper">
        <div class="note-card-header">
            <div class="user-info">
                <div class="user-avatar">
                    <el-avatar style="width: 30px;height: 30px;" :icon="UserFilled" :src=avatarComputed />
                </div>
                <div class="user-name">
                    <span>{{ props.userMap[props.note.uid]?.nickName }}</span>
                </div>
                <div class="time">
                    <span>{{ note.updateTime }}</span>
                </div>
            </div>
            <div class="operations">
                <span  @click="router.push('/note/' + props.note.id)" >查看原文</span>
            </div>

        </div>
        <div class="note-card">
            <el-scrollbar style="max-height: 600px;width: 100%;">
            <div class="news-content">
                <h1 style="padding: 0 20px;">{{ props.note.title }}</h1>
                <MdPreview id="preview" :modelValue="props.note.text" />
            </div>
            </el-scrollbar>
            <div class="actions">
                <span
                class="comment-btn"
                @click="openComments"
                ><el-icon><Comment /></el-icon></span>
            </div>
            <div
            v-if="isCommentsVisible"
            class="comments-panel"
            >
                <el-scrollbar class="comments-scroll">
                <div class="comments-content">
                    <div v-if="commentList.length === 0">
                        <el-empty description="暂无评论"> 
                        </el-empty>
                     </div>
                     <div v-else class="comment-list">
                        <!-- 一级评论 -->
                        <div v-for="(comment, index) in commentList" :key="index">
                            <div class="comment-item">
                                <div class="comment-header">
                                    <div class="header-left">
                                        <el-avatar :src="getAvatarUrl(comment.avatar)" class="comment-avatar"/>
                                        <div class="comment-header-nameAndTime">
                                            <span>{{ comment.nickName }}</span>
                                            <span class="comment-header-time">{{ comment.createTime }}</span>
                                        </div>
                                    </div>
                                </div>
                                <div class="comment-content">
                                    <span>{{ comment.content }}</span>
                                </div>
                                <!-- 二级评论 -->
                                <div v-if="comment.childrenComment && comment.childrenComment.length > 0" class="comment-children">
                                    <div v-for="(child, index) in comment.childrenComment" :key="index">
                                        <div class="comment-item">
                                            <div class="comment-header">
                                                <div class="header-left">
                                                    <el-avatar style="width: 20px;height: 20px;" :src="getAvatarUrl(child.avatar)" class="comment-avatar"/>
                                                    <div class="comment-header-nameAndTime">
                                                        <span>{{ child.nickName }}</span>
                                                        <span class="comment-header-time">{{ child.createTime }}</span>
                                                    </div>
                                                </div>
                                            </div>
                                             <div class="comment-content">
                                                <span >回复 <span class="comment-reply-name">{{ getNoteCommentNickName(comment, child) }}</span>: {{ child.content }}</span>
                                             </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                     </div>
                </div>
                </el-scrollbar>
                <button class="close-btn" @click="closeComments">×</button>
            </div>
        </div>
    </div>
</template>

<script setup>
  import { MdPreview } from 'md-editor-v3';
  import 'md-editor-v3/lib/preview.css';
  import 'element-plus/theme-chalk/el-scrollbar.css';
  import { Comment } from '@element-plus/icons-vue';
  import { useRouter } from 'vue-router';
  import { getAvatarUrl, getUserInfo } from '../../../service/user';
  import { computed, reactive, ref, watch } from 'vue';
  import { UserFilled } from '@element-plus/icons-vue';
  import { getNoteCommentList } from '../../../service/note';
  import { ElMessage } from 'element-plus';
  const props = defineProps({
    note: {
        type: Object,
        required: true
    },
    userMap: {
        type: Object,
        required: true,
    }
  });

  const avatarComputed = computed(() => {
    return getAvatarUrl(props.userMap[props.note.uid]?.avatar);
  })

  const router = useRouter();

  const commentList = ref([]);
  const isCommentsVisible = ref(false);

  const openComments = () => {
    isCommentsVisible.value = true;
  };

  const closeComments = () => {
    isCommentsVisible.value = false;
  };

  watch(isCommentsVisible, () => {
    if (isCommentsVisible.value){
        getNoteCommentList(props.note.id).then(res => {
            if (res.code !== 200) {
                ElMessage.error(res.msg);
                return;
            }
            commentList.value.splice(0)
            commentList.value.push(...res.data)
        })
        console.log(commentList.value);
    }
  })

  const getNoteCommentNickName = (comment, child) => {
    // 查找child回复哪个用户
    let nickName = ''
    if (comment.id == child.toId) return comment.nickName
    comment.childrenComment.forEach(item => {
        if (item.id == child.toId) {
            nickName = item.nickName
        }
    })
    return nickName
 }


</script>

<style lang="scss" scoped>

  .note-card-wrapper {
    font-family: Inter, 'Helvetica Neue', Helvetica, 'PingFang SC',
    'Hiragino Sans GB', 'Microsoft YaHei', '微软雅黑', Arial, sans-serif;
    color: #6b7785;
    width: 100%;
    border-radius: 4px;
    padding: 10px;
    display: flex;
    flex-direction: column;
    align-items: center;
    box-sizing: border-box;
  }
  .note-card-header {
    width: 100%;
    padding: 0 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    box-sizing: border-box;
  }
  .user-info {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .user-avatar {
    width: 30px;
    height: 30px;
  }
  .user-name {
    font-weight: bold;
  }

  .time{
    font-size: 10px;
  }

  .operations {
    display: flex;
    align-items: center;
    color: black;
    &:hover{
        color: #65adf9;
        cursor: pointer;
    }
  }

  .note-card {
    position: relative;
    width: 100%;
    background: #fff;
    border-radius: 4px;
    height: 100%;
    display: flex;
  }

  .news-content {
    width: 100%;
    height: 100%;
  }
  
  .actions {
    display: flex;
    align-items: end;
    font-size: 20px;
    cursor: pointer;
  }
  
  .actions:hover {
    color: #0056b3;
  }

  .comments-panel {
    height: 100%;
    position: absolute;
    top: 0;
    right: 0;
    width: 280px; 
    background: #fff;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    border-radius: 4px;
    overflow: hidden;
  }
  
  .comments-scroll {
    padding: 10px;
    box-sizing: border-box;
    height: 100%;
  }
  
  .comments-content {
    font-size: 14px;
    color: #333;
    line-height: 1.5;
    box-sizing: border-box;
  }
  
  .close-btn {
    position: absolute;
    top: 5px;
    right: 5px;
    background: none;
    border: none;
    font-size: 20px;
    cursor: pointer;
    color: #888;
  }
  
  .close-btn:hover {
    color: #333;
  }

  .comment-list{
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 5px;
    margin-top: 10px;
    box-sizing: border-box;
}
.comment-item{
    display: flex;
    align-items: center;
    width: 100%;
    box-sizing: border-box;
    padding: 2px;
    border-radius: 5px;
    box-shadow: var(--el-box-shadow-lighter);
    flex-direction: column;
}

.comment-header{
    box-sizing: border-box;
    display: flex;
    align-items: center;
    gap: 10px;
    height: 35px;
    font-family: Inter, 'Helvetica Neue', Helvetica, 'PingFang SC',
    'Hiragino Sans GB', 'Microsoft YaHei', '微软雅黑', Arial, sans-serif;
    color: #6b7785;
    align-items: center;
    width: 100%;
    justify-content: space-between;
}

.header-left{
    display: flex;
    align-items: center;
    gap: 10px;
}

.comment-avatar{
    width: 25px;
    height: 25px;
}

.comment-header-time{
    font-size: 8px;
    color: #999;
}
.comment-header-nameAndTime{
    width: 55%;
    display: flex;
    flex-direction: column;
}

.comment-content{
    width: 100%;
    padding: 10px;
    font-size: 14px;
    font-family: Inter, 'Helvetica Neue', Helvetica, 'PingFang SC',
    'Hiragino Sans GB', 'Microsoft YaHei', '微软雅黑', Arial, sans-serif;
    color: #6b7785;
    line-height: 1.2;
    box-sizing: border-box;
    border-bottom: 2px dashed var(--el-border-color);
}

.comment-children{
    display: flex;
    flex-direction: column;
    gap: 3px;
    margin-left: 20px;
    width: calc(100% - 20px);
    box-sizing: border-box;
}

.comment-reply-name{
    font-size: 12px;
    color: #223448;
}
</style>