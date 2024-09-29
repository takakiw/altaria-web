<template>
    <div class="login-form">
        <div>欢迎使用</div>
        <div style="margin-top: 10px;">注册</div>
        <div class="content">
            <el-input v-model="input" style="width: 240px" placeholder="账号" />
            <el-input v-model="input" style="width: 240px" placeholder="密码" />
            <el-input v-model="input" style="width: 240px" placeholder="邮箱" />
            <div style="display: flex;justify-content: space-between;width: 240px;"><el-input v-model="input" style="width: 130px" placeholder="验证码" /><el-button type="primary">发送验证码</el-button></div>
            <el-button type="primary" style="width: 240px">注 册</el-button>
        </div>
    </div>
</template>

<script setup>

import { ref } from 'vue'
const activeName = ref('password')

const handleClick = (tab, event) => {
  console.log(tab, event)
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
</style>