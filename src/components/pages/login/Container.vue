<template>
    <div id="app">
    <div class="container">
        <div class="logo">
          <img src="../../../../public/cloud.png" alt="" style="width: 60%;height:60%;">
          <span>青鸟云</span>
          <span style="font-size: 50px;">一个轻便的云空间</span>
        </div>
        <div class="form">
          <div v-if="!isLogin">
          <LoginFrom/>
        </div>
        <div v-else>
          <RegisterForm/>
        </div>
        <div style="width: 200px; display: flex;justify-content: space-between;margin-top: 10px;">
          <a-link @click="open">{{ !isLogin? '忘记密码？' : '' }}</a-link>
          <a-link @click="isLogin = !isLogin">{{ !isLogin? '注册' : '登录' }}</a-link>
          </div>
        </div>
    </div>
    </div>
    <!-- <div id="app">
        <iframe src="http://localhost:8080/preview" frameborder="0" style="height: 70%; width: 70%;"></iframe>
        <button @click="isPdf">an</button>
    </div> -->
</template>

<script setup>
import LoginFrom from "@/components/pages/login/LoginFrom.vue"
import RegisterForm from "@/components/pages/login/RegisterForm.vue"
import { ElMessage } from "element-plus";
import { onMounted, ref } from "vue"

const isLogin = ref(false)

/* const isPdf = () => {
  console.log(/Chrome|Firefox|Safari|Edge/.test(navigator.userAgent));
  
} */
</script>

<style lang="scss" scoped>
#app {
    height: 100vh;
    margin: 0 auto;
    display: flex;
    justify-content: center;
    align-items: center;
}

.container {
  width: 80%;
  height: 600px;
  position: absolute;
  padding: 48px;
  border-radius: 25px;
  display: flex;
  justify-content:space-around;
  align-items: center;
  //box-shadow: rgba(149, 157, 165, 0.2) 0px 10px 24px;
  box-shadow:  0px 0px 50px rgba(129, 217, 226, 0.941);
  
  border: 5px solid transparent;
}

.logo {
    height: 500px;
    min-width: 500px;
    display: flex;
    justify-content: center;
    align-items: center;
    // 更换主轴方向
    flex-direction: column;
    font-size: 60px;
    
    span{
      opacity: 1;
      background: -webkit-linear-gradient(315deg, #2608a0 25%, #14e22f);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      
    }
}

.form {
  width: 240px;
  min-height: 300px;
  max-height: 400px;
  display: flex;
  align-items: center;
  padding: 30px;
  flex-direction: column;
  border-radius: 25px;
  // 阴影
  //box-shadow: rgba(149, 157, 165, 0.2) 0px 10px 24px;
  box-shadow: 5px 5px 10px rgba(74, 78, 67, 0.5);
  gap: 10px;
}

</style>

<style>
.el-tabs__nav {
  width: 240px;
}
</style>