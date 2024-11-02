<template>
    <el-dialog class="upset-dialog" :model-value="props.centerDialogVisible" 
                :show-close=false 
                :close-on-click-modal=false 
                :title=props.title
                @open="beforeShow" 
                center>
        <div class="container">
            <div class="uploadAvatar">
                <el-tooltip
                class="box-item"
                effect="dark"
                content="更新头像"
                placement="bottom">
                    <el-upload
                        class="avatar-uploader"
                        id="file"
                        :show-file-list="false"
                        @change="updateFile"
                        :auto-upload="false"
                    >
                        <img v-if="tempAvatarUrl !== ''" :src="tempAvatarUrl" class="avatar" />
                        <img v-else-if="userStore.avatarURL" :src="userStore.avatarURL" class="avatar" />
                        <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
                    </el-upload>
                </el-tooltip>
                <div class="avatar-uploader-btn">
                    <el-button type="primary" style="width: 80px;" @click="submitSelect">Select</el-button>
                    <el-button type="primary" style="width: 80px;" @click="submitUpload">Upload</el-button>
                </div>
            </div>
            <el-divider />
            <div class="user-info">
              <el-tabs tab-position="left" style="height: 200px" class="demo-tabs" @tab-click="handleClick">
                <el-tab-pane label="基本信息" label-width="100px" class="animate__animated animate__flipInX">
                  <div class="tag">
                    <el-form :model="form" label-width="80px" style="max-width: 600px">
                      <el-form-item label="用户名">
                        <el-input v-model="form.userName" disabled/>
                      </el-form-item>
                      <el-form-item label="昵称">
                        <el-input v-model="form.nickName" />
                      </el-form-item>
                      <el-form-item label="邮箱">
                        <el-input v-model="form.email" disabled/>
                      </el-form-item>
                    </el-form>
                  </div>
                </el-tab-pane>
                <el-tab-pane label="修改密码" label-width="100px" class="animate__animated animate__flipInX">
                  <div class="tag">
                    <el-form :model="form" label-width="80px" style="max-width: 600px">
                      <el-form-item label="邮箱">
                        <el-input v-model="form.email" disabled/>
                      </el-form-item>
                      <el-form-item label="新密码">
                        <el-input type="password" v-model="form.password" />
                      </el-form-item>
                      <el-form-item label="确认密码">
                        <el-input type="password" v-model="form.confirmPassword" />
                      </el-form-item>
                      <el-form-item label="验证码">
                        <div>
                          <el-input v-model="form.code" placeholder="验证码" style="width: 100px;"/>
                          <el-button type="primary" @click="getCaptcha" :disabled="!codeFlag" style="width: 100px;">{{ codeFlag ? '获取验证码' : timeOut + '秒后重试' }}</el-button>
                        </div>
                      </el-form-item>
                    </el-form>
                  </div>
                </el-tab-pane>
              </el-tabs>
            </div>
            <div class="buttons">
                <el-button @click="closeDialog">关闭</el-button>
                <el-button type="primary" @click="saveForm">保存</el-button>
            </div>
        </div>
    </el-dialog>
</template>

<script setup>
import { defineProps, defineEmits, reactive } from 'vue'
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import { useUserStore } from '../../store';
import "animate.css"
import { getCodeByEmail, getUserInfo, postUploadAvatar, putUpdateUserInfo } from '../../service/user';
const props = defineProps({
    centerDialogVisible: {
        type: Boolean,
        default: false
    }
    ,
    title: {
        type: String,
        default: ''
    }
})

const userStore = useUserStore()
const tempAvatarUrl = ref('')
const upFile = ref()

const form = reactive({
  nickName: userStore.user.nickName,
  email: userStore.user.email,
  id: userStore.user.id,
  userName: userStore.user.userName,
  role: userStore.user.role,
  password: '',
  code: '',
  confirmPassword: ''
})

const handleClick = () => {
    form.password = ''
    form.confirmPassword = ''
    form.code = ''
    form.nickName = userStore.user.nickName
}


const beforeShow = () => {
    form.nickName = userStore.user.nickName
    form.email = userStore.user.email
    form.id = userStore.user.id
    form.userName = userStore.user.userName
    form.role = userStore.user.role
    form.password = ''
    form.code = ''
    form.confirmPassword = ''
    tempAvatarUrl.value = ''
}

    


const emit = defineEmits(['update:centerDialogVisible'])
const closeDialog = () => {
    emit('update:centerDialogVisible', false)
}

const codeFlag = ref(true)
const timeOut = ref(60)

// 选择文件
function submitSelect(){
  document.getElementsByClassName("el-upload--text")[0]?.click()
}
// 更新临时文件
const updateFile = (file, fileList) => {
  fileList.splice(0)
  if (file.raw.type.indexOf('image') === -1) {
    ElMessage.error('只能上传图片文件')
    return
  }
  if (file.size > 1024 * 1024 * 2) {
    ElMessage.error('文件大小不能超过2M')
    return
  }
  upFile.value = file.raw
  tempAvatarUrl.value = URL.createObjectURL(file.raw)
}
 
// 上传文件
const submitUpload = () => {
  if (upFile.value) {
    postUploadAvatar(upFile.value).then(res => {
      tempAvatarUrl.value = ''
      upFile.value = null
      if (res.code !== 200) {
        ElMessage.error('上传失败')
        return
      }
      ElMessage.success('上传成功')
      userStore.user.avatar = res.data
    }).catch(err => {
      ElMessage.error('上传失败')
    })
  } else {
    ElMessage.error('请先选择新头像')
  }
}
const getCaptcha = () => {
  getCodeByEmail(userStore.user.email).then(res => {
    if(res.code === 200){
      codeFlag.value = false
      const interval = setInterval(() => {
        timeOut.value -= 1
      }, 1000)
       setTimeout(() => {
           codeFlag.value = true
           clearInterval(interval)
           timeOut.value = 60
       }, 60000)
    }
    else{
      ElMessage.error(res.msg)
    }}).catch(err => {
      ElMessage.error('验证码发送失败')
    })
}

const saveForm = () => {
  if(form.password !== ''){
    if(form.password !== form.confirmPassword){
      ElMessage.error('两次密码输入不一致')
      return
    }
    if(form.code === ''){
      ElMessage.error('请输入验证码')
      return
    }
    putUpdateUserInfo({password: form.password, code: form.code, id: form.id, email: form.email}).then((res) => {
      if(res.code === 200){
        ElMessage.success('修改密码成功')
        form.password = ''
        form.confirmPassword = ''
        form.code = ''
      }
      else{
        ElMessage.error(res.msg)
      }
      return
    })
  }
  if(form.nickName !== userStore.user.nickName){
    putUpdateUserInfo({nickName: form.nickName, id: userStore.user.id}).then((res) => {
      if(res.code === 200){
        ElMessage.success('修改昵称成功')
        userStore.user.nickName = form.nickName
      }
      else{
        ElMessage.error(res.msg)
      }
      return
    })
  }
  getUserInfo(-1).then(res => {
    if(res.code === 200){
      userStore.setUserInfo(res.data)
    }
  })
}
</script>

<style lang="scss" scoped>
.container {
    padding: 10px 0;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    gap: 20px;
}

.avatar-uploader .avatar {
      width: 100px;
      height: 100px;
      display: block;
}


.uploadAvatar{
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 30px;
    .avatar-uploader-btn{
        width: 100px;
        height: 100px;
        display: flex;
        flex-direction: column;
        justify-content: space-around;
    }
}

.user-info{
  margin-top: 20px;
  width: 90%;
  display: flex;
  justify-content: center;
  align-items: center;
  
}


.avatarImg {
    width: 100px;
    height: 100px;
    overflow: hidden;
    position: relative;
    background-color: rgb(184, 182, 180);
}

.buttons{
    display: flex;
    width: 40%;
    justify-content: space-between;
    margin-top: 20px;
}

.tag{
  min-width: 260px;
}

</style>


<style lang="scss">


.el-button+.el-button{
    margin: 0;
}

.el-dialog {
    --el-dialog-width: 34%;
    min-width: 480px;
    
}

.avatar-uploader .el-upload {
      border: 1px dashed var(--el-border-color);
      border-radius: 6px;
      cursor: pointer;
      position: relative;
      overflow: hidden;
      transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
  border-color: var(--el-color-primary);
}

.el-icon.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 100px;
  height: 100px;
  text-align: center;
}

.el-tabs__item,.is-left,.is-active{
  width: 80px;
}
</style>