<template>
    <el-affix :offset="0">
        <Navigation/>
    </el-affix>
    <div v-if="canPreview" class="note-container">
        <div class="note-left">
            <el-affix :offset="80">
                <div class="note-catalog">
                    <div class="catalog-container">
                        <div>目录</div>
                        <MdCatalog  :editorId="id" :scrollElement="scrollElement" />
                    </div>
                </div>
            </el-affix>
        </div>
        <div class="note-content">
            <div class="title">{{ note.title }}</div>
            <MdPreview :id="id" :modelValue="note.text" />
        </div>
        <div class="note-right" v-if="showComments">
            <div style="width: 300px; height: 1px;"></div>
            <el-affix :offset="80">
                <div class="note-info">
                    <div class="info-item">
                        <el-avatar :src="userInfo.avatar" />
                        <span>{{ userInfo.nickName }}</span>
                    </div>
                    <div class="info-item">
                        <span>更新于: </span>
                        <span>{{ note.updateTime }}</span>
                    </div>
                    <div class="info-item">
                        <span>创建于: </span>
                        <span>{{ note.createTime }}</span>
                    </div>
                    <div class="info-item">
                        <span>评论数: </span>
                        <span>{{ note.commentCount }}</span>
                    </div>
                </div>
                <div class="comment-input">
                    <!-- 输入框 -->
                    <el-input :max="200" :maxlength="200" @keyup.backspace="handleBackspace(commentText)"  :show-word-limit="true" v-model="commentText" :rows="3" type="textarea" :placeholder="placeholder" />
                    <div style="margin-top: 10px;width: 100%;text-align: right;">
                        <el-button type="primary" @click="addComment" plain round>发布</el-button>
                    </div>
                 </div>
                <div class="note-comment">
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
                                    <div class="comment-header-operation">
                                        <span @click="replyComment(comment)">回复</span>
                                        <span v-if="userStore.user.id == comment.uid" @click="deleteComment(comment)">删除</span>
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
                                                    <el-avatar :src="getAvatarUrl(child.avatar)" class="comment-avatar"/>
                                                    <div class="comment-header-nameAndTime">
                                                        <span>{{ child.nickName }}</span>
                                                        <span class="comment-header-time">{{ child.createTime }}</span>
                                                    </div>
                                                </div>
                                                <div class="comment-header-operation">
                                                    <span @click="replyComment(child)">回复</span>
                                                    <span v-if="userStore.user.id == child.uid" @click="deleteComment(child)">删除</span>
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
            </el-affix>
        </div>
        
    </div>
    <div v-else>
        <el-result icon="info" title="无权限查看">
            <template #sub-title>
            <p>暂无权限查看该笔记</p>
            <p>如需查看，请联系笔记创建者。</p>
            </template>
        </el-result>
    </div>
</template>


<script setup>
import Navigation from '@/components/common/Navigation.vue'
import { reactive, ref } from 'vue';
import { MdPreview, MdCatalog } from 'md-editor-v3';
import 'md-editor-v3/lib/preview.css';
import { deleteNoteComment, getNoteCommentList, getNoteInfo, postAddNoteComment } from '../../service/note';
import { useRoute, useRouter } from 'vue-router';
import { ElMessage, ElMessageBox } from 'element-plus';
import { getAvatarUrl, getUserInfo } from '../../service/user';
import { useUserStore } from '../../store';

const userStore = useUserStore();
const route = useRoute();
const router = useRouter();
const noteId = route.params.noteId; // 当前笔记ID
const text = ref(""); // 笔记内容
const canPreview = ref(false) // 是否可以预览
const id = 'preview-only'; // 预览ID
const scrollElement = document.documentElement; // 预览滚动元素
// 笔记信息
const note = reactive({
    id: 0,
    uid: 0,
    cid: 0,
    isPrivate: false,
    title: 'title',
    text: text,
    commentCount: 0,
    createTime: "2022-01-01 00:00:00",
    updateTime: "2022-01-01 00:00:00"
})

// 处理回退
const handleBackspace = (text) => {
    if (text.length === 0) {
        clearCommentTo()
    }
}

// 用户信息
const userInfo = reactive({
    nickName: 'admin',
    avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif'
})

// 评论列表
const commentList = reactive([
])

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

// 显示评论
const showComments = ref(true)
// 评论输入框提示
const placeholder = ref("");
// 评论回复Id
const commentTo = ref('')
// 评论的顶级评论Id
const commentParentId = ref('')
// 评论内容
const commentText = ref('')

const addComment = () => {
    if(!userStore.isLogin) {
        ElMessage.error('请先登录')
        return
    }
    if (commentText.value === '') {
        ElMessage.warning('评论内容不能为空')
        return
    }
    postAddNoteComment(noteId, commentText.value, commentParentId.value, commentTo.value).then(res => {
        if (res.code !== 200) {
            ElMessage.error(res.msg)
            return
        }
        res = res.data
        res.nickName = userStore.user.nickName
        res.avatar = userStore.user.avatar
        if (!res.pid) {
            commentList.push(res)
        }else{
            let parent = commentList.find(item => item.id == res.pid)
            if (!parent.childrenComment) {
                parent.childrenComment = []
            }
            parent.childrenComment.push(res)
        }
        note.commentCount += 1
    }).catch(err => {
        console.log(err);
        ElMessage.error('评论失败')
    })
    clearCommentTo()
}

const replyComment = (comment) =>{
    if(!userStore.isLogin) {
        ElMessage.error('请先登录')
        return
    }
    commentTo.value = comment.id
    commentParentId.value = comment.pid ? comment.pid : comment.id // 如果是二级评论，则父评论为顶级评论
    placeholder.value = `回复 ${comment.nickName}:`
    commentText.value = ''
}

const clearCommentTo = () => {
    placeholder.value = ""; // 评论输入框提示
    commentTo.value = ''; // 评论回复Id
    commentParentId.value = ''; // 评论的顶级评论Id
    commentText.value = ""; // 评论内容
}

const deleteComment = (comment) => {
    if(!userStore.isLogin) {
        ElMessage.error('请先登录')
        return
    }
    ElMessageBox.confirm('确定要删除该评论吗？',
        '提示', 
        {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
        }
    ).then(() => {
        deleteNoteComment(comment.id).then(res => {
            if (res.code !== 200) {
                ElMessage.error(res.msg)
                ElMessage.error('删除失败')
                return
            }
            note.commentCount -= res.data
            const index = commentList.indexOf(comment)
            if (index !== -1) {
                commentList.splice(index, 1)
                ElMessage.success('删除成功')
                return
            }
            getNoteCommentList(noteId).then(res => {
                if (res.code !== 200) {
                    ElMessage.error(res.msg)
                    return
                }
                res = res.data
                commentList.splice(0, commentList.length)
                res.forEach(comment => {
                    commentList.push(comment)
                })
            })
            ElMessage.success('删除成功')
        }).catch(err => {
            console.log(err);
            ElMessage.error('删除失败')
        })
    })
}

onMounted(() => {
    getNoteInfo(noteId).then(res => {
        if (res.code !== 200) {
            ElMessage.error(res.msg)
            return
        }
        canPreview.value = true
        res = res.data
        note.id = res.id
        note.uid = res.uid
        note.title = res.title
        note.text = res.text
        note.commentCount = res.commentCount
        note.createTime = res.createTime
        note.updateTime = res.updateTime
        console.log(res);
        // 获取用户信息
        getUserInfo(res.uid).then(res => {
            if (res.code !== 200) {
                ElMessage.error(res.msg)
                return
            }
            res = res.data
            userInfo.nickName = res.nickName
            userInfo.avatar = getAvatarUrl(res.avatar)
        })
        getNoteCommentList(noteId).then(res => {
            if (res.code !== 200) {
                ElMessage.error(res.msg)
                return
            }
            res = res.data
            commentList.splice(0, commentList.length)
            res.forEach(comment => {
                commentList.push(comment)
            })
        })
    })
})
</script>

<style lang="scss" scoped>

.note-container {
  padding-top: 5px;
  box-shadow: var(--el-box-shadow-lighter);
  width: calc(100% - 60px);
  margin: 0 auto;
  min-width: 700px;
  display: flex;
  gap: 10px;
  padding: 0 30px;
  height: calc(100vh - 70px);
  @media (max-width: 700px) {
    min-width: 699px; 
    flex-wrap: wrap;
  }
}

.note-left {
    width: 250px;
    box-sizing: border-box;
}
.note-catalog {
    width: 250px;
    box-sizing: border-box;
    max-height: 80vh;
    overflow-y: auto;
    padding: 10px;
    overflow-y: scroll;
    scrollbar-width: none; 
    -ms-overflow-style: none; 
    padding: 10px;
    box-shadow: var(--el-box-shadow-lighter);
    background-color: #ffffff;
}

.note-content{
    width: 60%;
    box-shadow: var(--el-box-shadow-lighter);
}

.title {
    width: 100%;
    height: 40px;
    line-height: 40px;
    text-align: center;
    font-size: 40px;
    font-weight: bold;
    margin-top: 20px;
}

.note-right{
    width:  300px;
    display: flex;
    flex-direction: column;
}
.note-info {
    height: 120px;
    width: 300px;
    margin-bottom: 10px;
    box-shadow: var(--el-box-shadow-lighter);
    display: flex;
    flex-direction: column;
    box-sizing: border-box;
    padding: 10px;
    align-items: center;
    font-family: Inter, 'Helvetica Neue', Helvetica, 'PingFang SC',
    'Hiragino Sans GB', 'Microsoft YaHei', '微软雅黑', Arial, sans-serif;
    color: #6b7785;
}

.info-item{
    box-sizing: border-box;
    padding: 0 20px;
    width: 100%;
    display: flex;
    align-items: center;
    gap: 20px;
}


.note-comment {
    width: 300px;
    height: 65vh;
    box-sizing: border-box;
    padding: 10px;
    box-shadow: var(--el-box-shadow-lighter);
    background-color: #ffffff;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
}

.comment-input{
    box-shadow: var(--el-box-shadow-lighter);
    padding: 2px;
    border-radius: 5%;
}

.comment-list{
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 10px;
    margin-top: 10px;
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
.comment-header-operation{
    display: flex;
    align-items: center;
    gap: 5px;
    font-size: 10px;
    color: rgb(0, 136, 255);
    &:hover{
        cursor: pointer;
    }
    margin-right: 20px;
}

.comment-content{
    width: 100%;
    padding: 10px;
    font-size: 14px;
    font-family: Inter, 'Helvetica Neue', Helvetica, 'PingFang SC',
    'Hiragino Sans GB', 'Microsoft YaHei', '微软雅黑', Arial, sans-serif;
    color: #6b7785;
    line-height: 1.5;
}

.comment-children{
    display: flex;
    flex-direction: column;
    gap: 3px;
    margin-left: 20px;
    width: calc(100% - 20px);
}

.comment-reply-name{
    font-size: 12px;
    color: #223448;
}

@media (max-width: 1350px) {
    .note-right {
        display: none;
    }
    .note-content{
        width: 75%;
    }
}


@media (max-width: 1000px) {
  .note-container {
      flex-direction: column; 
      padding: 0 15px;      
  }
  .note-info, .note-catalog, .note-right {
      width: 100%;         
      max-height: unset;   
      overflow-y: visible;  
  }
  .note-catalog, .note-right, .note-info {
      display: none;        
  }
  .note-content {
      width: 100%;         
  }
}

@media (max-width: 768px) {
  .title {
      font-size: 24px;      
  }
}
</style>