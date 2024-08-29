<template>
    <div class="app">
        <topbarComp />
    
        <main class="main-content">
            <RouterView />
        </main>
    
        <footerComp />
    </div> 
</template>

<script setup>
import { onMounted } from 'vue';
import { useMainStore } from './stores/mainStore';
import topbarComp from '@/components/topbarComp.vue';
import footerComp from './components/footerComp.vue';

const store = useMainStore();

onMounted(() => {
    const prefersDarkScheme = window.matchMedia("(prefers-color-scheme: dark)");
    store.initThemeMode(prefersDarkScheme);
})

</script>

<style scoped>
.app {
    width: 100vw;
    height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: stretch;
    color: var(--color-text);
    background-color: var(--color-background);
}
.main-content {
    overflow-y: auto;
    width: 100%;
    height: 78%;
    padding: 1.875rem 0;
    color: var(--color-text);
    background-color: var(--color-background);
}

</style>
