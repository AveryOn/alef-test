<template>
    <div class="not-found-view">
        <h1 class="not-found-title">
            Ресурс не найден 404!
        </h1>
        <btnComp :variant="'filled'" icon="pi pi-chevron-left" title="Назад" @click="router.push({ name: 'form' })"/>
    </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
const router = useRouter();
</script>

<style scoped>
.not-found-view {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 10px;
}
.not-found-title {
    color: var(--primary-color);
}
</style>