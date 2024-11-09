<template>
    <div style="box-sizing: border-box;">
        <ShareNavigation/>
        <Container style="width: 60%;">
            <div v-if="errorMsg" class="error-msg">
                <el-result :sub-title="errorMsg">
                    <template #icon>
                        <img src="../../assets//icon-image/warning.png" alt="" >
                    </template>
                </el-result>
            </div>
            
            <div v-else-if="continueVerify" class="share-container">
                <div class="share-top">
                    <div class="share-user-info">
                        <div class="share-user-avatar">
                            <el-avatar style="width: 100%; height: 100%;"
                            :icon="UserFilled" 
                            :src=getAvatarUrl(shareUser.avatar) />
                        </div>
                        <div class="info">
                            <div> {{ getSignName(shareUser.nickName) }} </div>
                            <div style="font-size: 12px; color:black" v-html="getShareShowExpireTime(shareInfo.expire, true)"></div>
                        </div>
                    </div>
                    <div class="operation">
                        <div v-if="shareInfo.uid == userStore.user.id">
                            <el-button type="primary" plain @click="cancelShare">取消分享</el-button>
                        </div>
                        <div v-if="shareInfo.uid != userStore.user.id">
                            <el-button type="primary" plain color="#8D4EDA" @click="toMySpace">保存到我的空间</el-button>
                        </div>
                    </div>
                </div>
                <div class="share-content">
                    <ShareFiles
                    ref="shareFilesRef"
                    @toCheck="toCheck"
                    @toMySpace="toMySpace"/>
                </div>
            </div>
            <div v-else class="vertical-container">
                <div class="avatar">
                    <el-avatar
                    style="width: 100px; height: 100px;"
                        :icon="UserFilled"
                        :src=getAvatarUrl(shareUser.avatar)
                    />
                </div>
                <div class="name">
                    <h2>{{getSignName(shareUser.nickName)}}</h2>
                </div>
                <div class="expire">
                    <div style="font-size: 12px;" v-html="getShareShowExpireTime(shareInfo.expire)"></div>
                </div>
                <div class="verify-code">
                    <div>
                        <el-input v-model="verifyCode" style="width: 200px;" placeholder="请输入密码" />
                    </div>
                    <div>
                        <el-button type="primary" style="width: 200px;" @click="verifyCodeHandle" :disabled="!verifyCode">进入分享</el-button>
                    </div>
                </div>
            </div>
            <el-dialog
            v-model="dirShow"
            title="保存到当前位置"
            width="100"
            :show-close="false"
            :center="true"
            >
                <template #footer>
                    <DirWindow ref="dirWindowRef" style="width: 100%; height: 400px;"/>
                    <div class="dir-button">
                    <el-button type="primary" @click="saveActiveFiles">确定</el-button>
                    <el-button type="default" @click="dirShow = false">取消</el-button>
                </div>
                </template>
        </el-dialog>
        </Container>
    </div>
</template>

<script setup>
import { useRoute, useRouter } from 'vue-router';
import ShareNavigation from '../../components/pages/share/ShareNavigation.vue';
import ShareFiles from '../../components/pages/share/ShareFiles.vue';
import Container from '../../components/common/Container.vue';
import DirWindow from '../../components/pages/File/DirWindow.vue'
import { delCancelShare, getShareFileList, getShareInfo, getSignUrl, PostSaveShareFileToMyDisk } from '../../service/share';
import { computed, onMounted, reactive, ref } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { useUserStore } from '../../store';
import { getAvatarUrl, getUserInfo } from '../../service/user';
import { UserFilled } from '@element-plus/icons-vue';
import { getShareShowExpireTime, getSignName } from '../../utils/StandardData';

const userStore = useUserStore()
const errorMsg = ref()
const route = useRoute()
const router = useRouter()
const shareId = route.params.shareId // 接收分享id
const shareInfo = reactive({}) // 保存分享信息
const shareUser = reactive({}) // 保存分享者信息
const shareFiles  = reactive([]) // 保存分享文件信息
const shareFilesRef = ref(null) // 保存分享文件组件实例
const dirShow = ref(false) // 保存保存位置弹窗状态
const dirWindowRef = ref(null) // 保存保存位置弹窗实例

const checkedFlag = ref(true) // 标记是否已经验证过
const continueVerify = computed(() => { // 是否可以跳过验证
    return shareInfo.uid == userStore.user.id  || checkedFlag.value // 当前用户是否为分享者或者已经验证过, 若是则可以跳过验证
})


const verifyCode = ref('') // 验证码
const verifyCodeHandle = () => { // 验证验证码
    if(verifyCode.value.length == 0){
        ElMessage.error("请输入密码")
        return
    }
    if(verifyCode.value.length != 4){
        ElMessage.error("密码长度为4位")
        return
    }
    getSignUrl(shareId, verifyCode.value).then(res => {
        if(res.code == 200){
            checkedFlag.value = true
            ElMessage.success("验证成功")
        }else{
            ElMessage.error("密码错误")
            checkedFlag.value = false
        }
    }).catch(err => {
        checkedFlag.value = false
    })
}

const toCheck = () => {
    checkedFlag.value = false
    verifyCode.value = ''
}

const toMySpace = () => {
    if(!userStore.isLogin){
        router.push('/login')
        return
    }
    ElMessageBox.confirm(
        "确定要保存选中的文件到我的空间吗？",
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
        const fids = shareFilesRef.value.fileItemRef.activeFiles.map(item => item.id)
        if(fids.length == 0){
            ElMessage.error("请选择要保存的文件")
            return
        }
        dirShow.value = true
    }).catch(() => {
    })
}

const saveActiveFiles = () => {
    const fids = shareFilesRef.value.fileItemRef.activeFiles.map(item => item.id)
    if(fids.length == 0){
        ElMessage.error("请选择要保存的文件")
        return
    }
    const toPathId = dirWindowRef.value.pathList[dirWindowRef.value.pathList.length - 1].id
    PostSaveShareFileToMyDisk(shareId, fids, toPathId).then(res => {
        if(res.code == 200){
            ElMessage.success("保存成功")
        }else{
            ElMessage.error(res.msg)
        }
    }).catch(err => {
        ElMessage.error("请检查网络连接")
    })
    dirShow.value = false
}

const cancelShare = () => {
    ElMessageBox.confirm(
        "确定要取消分享吗？",
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
        delCancelShare(shareId).then(res => {
            if(res.code == 200){
                ElMessage.success("取消分享成功")
                router.push('/')
            }else{
                ElMessage.error(data.msg)
            }
        }).catch(err => {
            ElMessage.error("请检查网络连接")
        })
    }).catch(() => {
    })
}

onMounted(() => {
    getShareInfo(shareId).then(res => {
        if(res.code == 2023){ // 无效的分享码
            errorMsg.value = res.msg
        }if(res.code == 200){ // 有效的分享码
            // 保存分享信息
            shareInfo.id = res.data.id
            shareInfo.uid = res.data.uid
            shareInfo.name = res.data.name
            shareInfo.type = res.data.type
            shareInfo.expire = res.data.expire
            shareInfo.createTime = res.data.createTime
            // 获取分享者信息
            if(!errorMsg.value){
                getUserInfo(shareInfo.uid).then(res => {
                    if(res.code == 200){
                        shareUser.id = res.data.id
                        shareUser.nickName = res.data.nickName
                        shareUser.avatar = res.data.avatar
                    }
                })
                if(shareInfo.uid != userStore.user.id){
                    // 非分享者，需要验证
                    getSignUrl(shareId).then(res => { // 判断是否验证过
                        if(res.code == 200){ 
                            checkedFlag.value = true
                        }else{
                            checkedFlag.value = false
                        }
                    }).catch(err => {
                        checkedFlag.value = false
                    })
                }
            }
        }
    }).catch( err => {
        ElMessage.error("请检查网络连接")
    })
})


</script>

<style lang="scss" scoped>
.vertical-container{
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 15%;
}

.error-msg{
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
}
.avatar{
    width: 100px;
    height: 100px;
}
.name{
    text-align: center;
}
.verify-code{
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 14px;
    color: #666;
    flex-direction: column;
    gap: 10px;
}
.share-container{
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    box-sizing: border-box;
}

.share-top{
    width: 100%;
    min-height: 50px;
    padding: 5px 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    box-sizing: border-box;
    background-color: #f7f8fa;
    box-shadow: var(--el-box-shadow-light);
    margin-bottom: 5px;
}
.share-user-info{
    display: flex;
    align-items: center;
    gap: 10px;
}

.share-user-avatar{
    width: 40px;
    height: 40px;
}

.operation{
    display: flex;
    align-items: center;
    gap: 10px;
}
.share-content{
    width: 100%;
    box-sizing: border-box;
    background-color: #ffffff;
    font-size: 14px;
    color: #666;
    box-shadow: var(--el-box-shadow-dark);
}

.dir-button{
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 50px;
}

</style>