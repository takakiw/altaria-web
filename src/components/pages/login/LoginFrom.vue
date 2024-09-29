<template>
    <div class="login-form">
        <div>欢迎使用</div>
        <div class="form-title">
            <el-tabs v-model="activeName" class="demo-tabs" @tab-click="handleClick">
                <el-tab-pane label="密码登录" name="password">
                    <div class="content">
                        <el-input v-model="input" style="width: 200px" placeholder="账号" />
                        <el-input v-model="inputPassword" style="width: 200px" type="password" placeholder="密码" show-password/>
                        <el-button type="primary" style="width: 200px" @click="loginPassWord">登 录</el-button>
                    </div>
                </el-tab-pane>
                <el-tab-pane label="邮箱登录" name="email">
                    <div class="content">
                        <el-input v-model="email" style="width: 200px" placeholder="邮箱" />
                        <div style="display: flex;justify-content: space-between;width: 200px;">
                            <el-input v-model="code" style="width: 100px" placeholder="验证码" />
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
import { getCode } from '../../../service/user';
import { ElMessage } from "element-plus";

const activeName = ref('password')

const input = ref('')
const inputPassword = ref('')
const email = ref('')
const code = ref('')
const codeFlag = ref(true)
const timeOut = ref(60)

const handleClick = (tab, event) => {
  input.value = ''
  inputPassword.value = ''
  email.value = ''
  code.value = ''
  }

  const checkEmail = (email) => {
    return /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/.test(email)
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
        if(res.code){
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
            ElMessage.error('验证码发送失败')
        }
    }).catch(err => {
        ElMessage.error('验证码发送失败')
    })
  }

  const loginPassWord = () => {
    if(!input.value){
        ElMessage.error('账号不能为空')
        return
    }
    if(!inputPassword.value){
        ElMessage.error('密码不能为空')
        return
    }
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