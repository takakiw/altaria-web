<template>
    <div id="container">
        <slot></slot>
    </div>
</template>

<script setup>

</script>

<style lang="scss" scoped>

#container {
    widows: 80%;
    margin: 0 auto;
    max-width: 1200px;
    min-width: 800px;
    display: flex;
    justify-content: center;
    align-items: center;
}


</style>