import { ref, computed } from "vue";
import { defineStore } from "pinia";

export const useMainStore = defineStore("mainStore", () => {

    // #############################  DATA  #############################
    const themeMode = ref(null) // 'light' | 'dark' | null

    // #############################  METHODS  #############################

    function setThemeMode(mode) {
        
        if(mode) {
            if(mode === 'light') {
                document.body.classList.add('light-theme');
                document.body.classList.remove('dark-theme');
                themeMode.value = 'light';
            }
            else if (mode === 'dark') {
                document.body.classList.add('dark-theme');
                document.body.classList.remove('light-theme');
                themeMode.value = 'dark';
            }
            localStorage.setItem('theme-mode', mode);
        }
    }

    // Переключить цветовую схему
    function initThemeMode(event, mode = null) {
        try {
            const initThemeMode = localStorage.getItem('theme-mode'); // Извлечение цветовой схемы из LS
            // Если в localStorage имеется предустановленный цветовой режим
            if(initThemeMode && !mode) {
                setThemeMode(initThemeMode);
            }
            // Если передается медиа "prefers-color-scheme: dark" (Например при загрузке страницы)
            if(event && !initThemeMode) {
                const themeMode = event.matches ? 'dark' : 'light';
                setThemeMode(themeMode);
                return;
            }
            // Если вручную меняется цветовой режим
            if(mode) {
                setThemeMode(mode);
            }

        } catch (err) {
            console.error('@/stores/mainStore.js: toggleTheme => ', err);
            throw err
        }
    }

    return {
        themeMode,

        initThemeMode,
    }
});
