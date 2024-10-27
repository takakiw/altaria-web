<template>
    <Navigation ref="ncomponent" />
    <router-view v-slot="{ Component }">
        <component ref="viewComponent" :is="Component" @add="add"/>
    </router-view>
</template>

<script setup>
import Navigation from '@/components/common/Navigation.vue';
import { ref } from 'vue';

const ncomponent = ref(null);

const add = (file) => {
    ncomponent.value.add(file);
}

</script>

<style lang="scss" scoped>

</style>