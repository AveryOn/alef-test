<template>
    <li class="child-item">
        <!-- Child Name -->
        <inputComp 
        class="child-item__input"
        v-model="childData.name" 
        :placeholder="'Имя'" 
        :invalid="isInvalidName"
        type="text"
        capitalize
        throttle
        @update:model-value="(name) => emit('update:childName', name, props.childData.id)"
        />
        <!-- Child Age -->
        <inputComp 
        class="child-item__input"
        v-model="childData.age"
        :placeholder="'Возраст'" 
        :invalid="isInvalidAge"
        throttle
        type="number"
        @update:model-value="(age) => emit('update:childAge', age, props.childData.id)"
        />
        <!-- Кнопка Удалить (Видна по умолчанию) -->
        <btnComp 
        class="remove-btn-child-item" 
        :variant="'text'" 
        :label="'Удалить'" 
        @click="emit('remove', props.childData.id)"
        />
        <!-- Кнопка Удалить (Видна по медиа-запросу) -->
        <btnComp 
        class="remove-icon-child-item" 
        icon="pi pi-trash" 
        :variant="'text'" 
        @click="emit('remove', props.childData.id)"
        />
    </li>
</template>

<script setup>
import { computed, defineEmits, defineProps, onMounted, reactive, watch } from 'vue';


// #######################################   PROPS   #######################################
const props = defineProps({
    childData: {
        type: Object,
        required: true,
    },
    invalidChilds: {
        type: Array,
        default: () => [],
        required: false,
    }
})

// #######################################   EMITS   #######################################
const emit = defineEmits(['update:childAge', 'update:childName', 'remove']);


// #######################################   DATA   #######################################
const childData = reactive({
    name: '',
    age: null,
});

// #######################################   COMPUTED   #######################################

// Вычисление корректности поля name
const isInvalidName = computed(() => {
    try {
        if(props.invalidChilds.includes(props.childData.id) && !childData.name) return true;
        else return false;
    } catch (err) {
        console.error('/src/components/childItemComp.vue: computed[isInvalidName] => ', err);
        throw err;
    }
})

// Вычисление корректности поля age
const isInvalidAge = computed(() => {
    try {
        if(props.invalidChilds.includes(props.childData.id) && !(childData.age !== null && childData.age + '').length) return true;
        else return false;
    } catch (err) {
        console.error('/src/components/childItemComp.vue: computed[isInvalidAge] => ', err);
        throw err;
    }
});

// #######################################   WATCH   #######################################

// Применяется при сбросе изменений в списке детей. Для того чтобы обновить modelValue инпутов
watch(() => props.childData, (newValue) => {
    try {
        if(newValue) {
            childData.name = newValue.name;
            childData.age = newValue.age;
        }
    } catch (err) {
        console.error('/src/components/childItemComp.vue: watch[props.childData] => ', err);
        throw err;
    }
})

// #######################################   LIFECYCLE HOOKS   #######################################

onMounted(() => {
    // Заполнение полей при монитировании
    if (props.childData) {
        childData.name = props.childData.name;
        childData.age = props.childData.age;
    }
})

</script>

<style scoped>
.child-item {
    width: 100%;
    display: flex;
    align-items: center;
    gap: 10px;
}
.child-item__input {
    width: 50%;
}
.child-item + .child-item {
    margin-top: 10px;
}
.remove-icon-child-item {
    display: none;
}
</style>