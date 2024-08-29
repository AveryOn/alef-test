<template>
    <header class="topbar">
        <span class="logo-block">
            <logoComp/>
        </span>
        <span class="navigation-block">
            <nav class="navigation">
                <ul class="navigation-list">
                    <li class="nav-list-item"><router-link class="link" :to="{ name: 'form' }">Форма</router-link></li>
                    <li class="nav-list-item"><router-link class="link" :to="{ name: 'preview' }">Превью</router-link></li>
                    <li></li>
                </ul>
            </nav>
        </span>
        <!-- Переключатель цветовой схемы -->
        <span class="actions">
            <i class="icon moon-icon pi pi-moon" style="margin-right: 0.5rem"></i>
            <ToggleSwitch 
            v-model="themeDark" 
            @update:model-value="handlerToggleTheme"
            />
        </span>
        
    </header>
</template>

<script setup>
import logoComp from '@/components/icons/logoComp.vue'; 
import { nextTick, onMounted, ref } from 'vue';
import { useMainStore } from '@/stores/mainStore';

const store = useMainStore();

const themeDark = ref(false);

// Обработчик переключения цветовой схемы
function handlerToggleTheme(state) {
    const themeMode = state ? 'dark' : 'light';
    store.initThemeMode(null, themeMode);
}

onMounted(async () => {
    await nextTick()
    themeDark.value = (store.themeMode === 'dark') ? true : false;
});

</script>

<style scoped>
.topbar {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    height: 11%;
    background-color: var(--color-background);
    color: var(--color-text);
    padding: 0.1rem 3.1875rem;
    border-bottom: 1px solid var(--topbar-border-color);
}
.logo-block {
    position: absolute;
    display: flex;
    align-items: center;
}
.navigation-block {
    display: flex;
    align-items: center;
    margin: auto;
}
.navigation {
    width: 134px;
    height: max-content;
}
.navigation-list {
    display: flex;
    list-style: none;
    gap: 24px;
}
.nav-list-item {
    font-size: 14px;

}
.nav-list-item .link {
    text-decoration: none;
    color: var(--nav-color);
}
.actions {
    position: absolute;
    right: 3.1875rem;
    display: flex;
    align-items: center;
}
.moon-icon {

}
</style>