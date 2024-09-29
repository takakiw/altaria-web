<template>
    <div>
        <div :style="{fontSize: '20px'}">Hello World</div>
        <button @click="toggle()">an</button>
    </div>
</template>

<script setup>
import { useToggle } from '@vueuse/shared';
import { useDark } from "@vueuse/core";


const isDark = useDark({
      // 存储到localStorage/sessionStorage中的Key 根据自己的需求更改
      storageKey: 'useDarkKEY',
      // 暗黑class名字
      valueDark: 'dark',
      // 高亮class名字
      valueLight: 'light',
    })
 const toggle = useToggle(isDark);
</script>

<style lang="scss" scoped>

</style>