<template>
    <div class="login-form">
        <div style="margin-top: 10px;">用户注册</div>
        <div class="content">
            <el-input v-model="userName" style="width: 240px" placeholder="账号" autocomplete="off"/>
            <el-input v-model="password" style="width: 240px" placeholder="密码" type="password" autocomplete="off" show-password/>
            <el-input v-model="email" style="width: 240px" placeholder="邮箱" autocomplete="off"/>
            <div style="display: flex;justify-content: space-between;width: 240px;">
                <el-input v-model="code" style="width: 130px" placeholder="验证码" />
                <el-button type="primary" @click="sendCode" :disabled="!codeFlag">{{ codeFlag? '获取验证码' : `${timeOut}秒后重试` }}</el-button>
            </div>
            <el-button type="primary" style="width: 240px" @click="register">注 册</el-button>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import { getCode, postRegister } from '../../../service/user';
import { ElMessage } from 'element-plus';
import router from '../../../router';
import { useUserStore } from '../../../store';

const userStore = useUserStore()
const userName = ref('')
const password = ref('')
const email = ref('')
const code = ref('')

const codeFlag = ref(true)
const timeOut = ref(60)
const checkEmail = (email) => {
    return /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/.test(email)
}
const CheckField = (value, msg) => {
    if(!value){
        ElMessage.error(msg)
        return true
    }
    return false
}

const sendCode = () => {
   if(!email.value){
       ElMessage.error('邮箱不能为空')
       return
   }
   if(!checkEmail(email.value)){
       ElMessage.error('邮箱格式不正确')
       return
   }
   getCode(email.value, "register").then(res => {
       if(res.code === 200){
           ElMessage.success('验证码发送成功')
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
       }
    })
}

const register = () => {
    if(CheckField(userName.value, '账号不能为空')){
        return
    }
    if(CheckField(password.value, '密码不能为空')){
        return
    }
    if(CheckField(email.value, '邮箱不能为空')){
        return
    }
    if(!checkEmail(email.value)){
        ElMessage.error('邮箱格式不正确')
        return
    }
    if(code.value.length !== 6){
        ElMessage.error('验证码格式不正确')
        return
    }
    postRegister(userName.value, password.value, email.value, code.value).then(res => {
        if(res.code === 200){
            ElMessage.success('注册成功')
            localStorage.setItem('token', res.data.token)
            userStore.user.id = res.data.id
            setTimeout(() => {
                let redirectPath = localStorage.getItem('redirectPath')
                if(redirectPath){
                    localStorage.removeItem("redirectPath")
                    router.replace(redirectPath)
                }else{
                    router.replace('/')
                }
            }, 1000)
        }
        else{
            ElMessage.error(res.msg)
        }
    })
}
</script>


<style lang="scss" scoped>


.demo-tabs > .el-tabs__content {
  padding: 32px;
  margin-top: 20px;
  color: #6b778c;
  font-size: 32px;
  font-weight: 600;
}

.content{
    margin-top: 30px;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 25px;
}

.login-form{
    display: flex;
    flex-direction: column;
    align-items: center;
}
</style>

<style>
.el-tabs{
    margin-top: 20px;
}

.el-tabs__nav{
    justify-content:space-around;
    width: 300px;
}

.el-form-item__content{
    justify-content: space-around;
}
</style>