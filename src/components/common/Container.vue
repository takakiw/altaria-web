<template>
    <div id="container">
        <slot></slot>
    </div>
</template>

<script setup>

</script>

<style lang="scss" scoped>

#container {
    width: 80%;
    margin: 0 auto;
    min-width: 800px;
    display: flex;
    height: calc(100vh - 85px)
}
</style>