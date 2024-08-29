<template>
    <main class="preview-view__main">
        <!-- Спиннер загрузки данных -->
        <ProgressSpinner 
            v-show="isLoadingData"
            style="width: 30px; height: 30px; color: #000;" 
            strokeWidth="5" 
            fill="transparent"
            animationDuration=".5s" 
        />

        <!-- Контент -->
        <div class="preview-content" v-show="!isLoadingData">

            <!-- Блок Персональных Данных Пользователя -->
            <div class="info-block">
                <h2>Персональные данные</h2>
                <p v-if="!profileData.name && !profileData.age" class="info-block-no-data" style="">Нет данных</p>
                <p v-else class="owner-data">
                    {{ `${profileData.name}, ${profileData.age} ${formatOldYears(profileData.age)}` }}
                </p>
            </div>

            <!-- Блок Данных по Детям Пользователя -->
            <div class="info-block">
                <h2>Дети</h2>
                <span v-if="!profileData.childrens.length" class="info-block-no-data" >Нет данных</span>
                <span v-else class="children-item" v-for="child in profileData.childrens" :key="child.id">
                    {{ `${child.name}, ${child.age} ${formatOldYears(child.age)}` }}
                </span>
            </div>
        </div>
    </main>
</template>

<script setup>
import { getChildrens } from '@/api/childrensApi';
import { getProfileData } from '@/api/profileApi';
import { computed, onMounted, ref } from 'vue';

// #######################################   DATA   #######################################

const isLoadingData = ref(false);
const profileData = ref({
    name: null,
    age: null,
    childrens: [],
});

// #######################################   COMPUTED   #######################################

// "год" "лет" "года"
const formatOldYears = computed(() => {
    return (age) => {
        const lastChar = +(age + '').at(-1);
        const lastTwoChars = ((age + '').at(-2) + lastChar) || null; 
        if(+age === 1) return 'год';
        if(+age >= 2 && +age < 5) return 'года';
        else if (+age >= 5 && +age <= 20) return 'лет';
        else if (+age > 20 && lastChar >= 5 || (+lastTwoChars > 9 && +lastTwoChars <= 20)) return 'лет';
        else if (+age > 20 && (lastChar > 1 && lastChar < 5)) return 'года';
        else if (+age > 20 && lastChar === 1) return 'год';
        else return 'лет';
    }
});


// #######################################   LIFECYCLE HOOKS   #######################################

onMounted(async () => {
    try {
        isLoadingData.value = true;
        // Получение данных пользователя
        const response = await getProfileData();
        if(response) {
            profileData.value.name = response.name;
            profileData.value.age = response.age;
        }
        // Получение данных детей пользователя
        const childrens = await getChildrens();
        if(childrens) {
            profileData.value.childrens = childrens;
        }
    } 
    catch (err) {
        throw err
    } 
    finally {
        isLoadingData.value = false;
    }
});
</script>

<style scoped>
.preview-view__main {
    width: 100%;
    height: auto;
    display: flex;
    flex-direction: column;
    align-items: center;
}
.preview-content {
    display: flex;
    flex-direction: column;
    gap: 60px;
    width: 45%;
    height: max-content;
}
.info-block {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 20px;
    color: var(--color-text);
}

.info-block h2 {
    font-weight: 500;
    font-size: 16px;
}
.info-block-no-data {
    font-weight: 300; 
    font-style: italic;
}
.owner-data {
    font-size: 16px;
    font-weight: 700;
}
.children-item {
    padding: 10px 20px;
    background-color: var(--secondary-bg);
    font-size: 16px;
    color: var(--color-text);
    font-weight: 700;
    border-radius: 5px;
}
</style>
