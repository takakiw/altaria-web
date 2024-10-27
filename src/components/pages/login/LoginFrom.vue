<template>
    <div class="login-form">
        <div>欢迎使用</div>
        <div class="form-title">
            <el-tabs v-model="activeName" class="demo-tabs" @tab-click="handleClick">
                <el-tab-pane label="密码登录" name="password">
                    <div class="content">
                        <el-input @keydown.enter="nextInput('pwd')" v-model="userName" style="width: 200px" placeholder="账号" autocomplete="off"/>
                        <el-input id="pwd" @keydown.enter="loginPassWord" v-model="password" style="width: 200px" type="password" placeholder="密码" autocomplete="off" show-password/>
                        <el-button type="primary" style="width: 200px" @click="loginPassWord">登 录</el-button>
                    </div>
                </el-tab-pane>
                <el-tab-pane label="邮箱登录" name="email">
                    <div class="content">
                        <el-input v-model="email" style="width: 200px" placeholder="邮箱" />
                        <div style="display: flex;justify-content: space-between;width: 200px;">
                            <el-input @keydown.enter="loginEmail" v-model="code" style="width: 100px" placeholder="验证码" />
                            <el-button type="primary" style="width: 80px" :disabled="!codeFlag" @click="sendCode">{{codeFlag? "发送验证码": timeOut}}</el-button>
                        </div>
                        <el-button type="primary" style="width: 200px" @click="loginEmail">登 录</el-button>
                    </div>
                </el-tab-pane>
            </el-tabs>
        </div>
    </div>
</template>

<script setup>

import { ref } from 'vue'
import { getCode, postLoginByEmail, postLoginByPassword } from '../../../service/user';
import { ElMessage } from "element-plus";
import { useRouter } from 'vue-router';
import { useUserStore } from '../../../store';

const activeName = ref('password')

const userName = ref('')
const password = ref('')
const email = ref('')
const code = ref('')
const codeFlag = ref(true)
const timeOut = ref(60)

const router = useRouter()

const userStore = useUserStore()


const handleClick = (tab, event) => {
  userName.value = ''
  password.value = ''
  email.value = ''
  code.value = ''
  }

  const checkEmail = (email) => {
    return /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/.test(email)
  }

  const nextInput = (idName) => {
    document.getElementById(idName).focus()
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
    getCode(email.value).then(res => {
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

  const CheckField = (value, msg) => {
    if(!value){
        ElMessage.error(msg)
        return true
    }
    return false
  }

  const loginPassWord = () => {
    if(CheckField(userName.value, '账号不能为空')){
        return
    }
    if(CheckField(password.value, '密码不能为空')){
        return
    }
    postLoginByPassword(userName.value, password.value).then((res) => {
        if(res.code === 200){
            ElMessage.success('登录成功')
            localStorage.setItem('token', res.data.token)
            userStore.user.id = res.data.id
            router.push('/')
        }
        else{
            ElMessage.error(res.msg)
        }
    })
  }

  const loginEmail = () => {
    if(CheckField(email.value, '邮箱不能为空')){
        return
    }
    if(CheckField(code.value, '验证码不能为空')){
        return
    }
    if(!checkEmail(email.value)){
        ElMessage.error('邮箱格式不正确')
        return
    }
    postLoginByEmail(email.value, code.value).then((res) => {
        if(res.code === 200){
            ElMessage.success('登录成功')
            localStorage.setItem('token', res.data.token)
            userStore.user.id = res.data.id
            router.push('/')
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
    margin-top: 15px;
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
 justify-content: space-around;
 width: 240px;
}
</style>