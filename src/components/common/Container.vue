<template>
    <div id="container">
        <slot></slot>
    </div>
</template>

<script setup>

</script>

<style lang="scss" scoped>

#container {
    padding-top: 5px;
    box-shadow: var(--el-box-shadow-lighter);
    width: 80%;
    margin: 0 auto;
    min-width: 1000px;
    display: flex;
    height: calc(100vh - 75px)
}
</style>