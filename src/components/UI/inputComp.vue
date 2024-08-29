<template>
    <div class="input-container" :class="isInvalid" @click="() => input.focus()">
        <!-- Метка в качестве placeholder -->
        <label 
        class="input-label" 
        :class="computeLabelClass"
        :for="inputId"
        >
            {{ props.placeholder }}

        </label>
        <input 
        ref="input"
        :id="inputId"
        class="input-inner-field" 
        :type="props.type === 'number' ? 'text' : props.type" 
        :min="props.min"
        :value="props.modelValue"
        @focus="isFocus = true"
        @blur="isFocus = false"
        @keyup.escape="handlerBlurInput"
        @input="(e) => e.target.value = mutateValue(e.target.value)"
        >
        <!-- Кнопки переключатели для числового инпута -->
        <span v-if="props.type === 'number'" class="number-switch">
            <button class="input-arrow-btn" @click.stop="upNum"><i class="pi pi-chevron-up"></i></button>
            <button class="input-arrow-btn" @click.stop="downNum"><i class="pi pi-chevron-down"></i></button>
        </span>
    </div>
</template>

<script setup>
import { throttle } from '@/utils/tools';
import { defineProps, defineEmits, ref, onMounted, computed, capitalize } from 'vue';

// #######################################   PROPS   #######################################

const props = defineProps({
    modelValue: {
        type: [String, Number],
        required: false,
        default: null,
    },
    placeholder: {
        type: String,
        required: false,
        default: 'Enter data...'
    },
    type: {
        type: String,
        required: false,
        default: 'text',
    },
    min: {
        type: Number,
        required: false,
        default: 0,
    },
    max: {
        type: Number,
        required: false,
        default: null,
    },
    throttle: {
        type: Boolean,
        required: false,
        default: false,
    },
    invalid: {
        type: Boolean,
        required: false,
        default: false,
    },
    capitalize: {
        type: Boolean,
        required: false,
        default: false,
    }
});


// #######################################   EMITS   #######################################

const emit = defineEmits(['update:modelValue']);


// #######################################   DATA   #######################################

const input = ref(null);
const isFocus = ref(false);


// #######################################   COMPUTED   #######################################

// Вычисление класса invalid для в случае ошибки
const isInvalid = computed(() => {
    try {
        if(props.invalid === true) return 'invalid';
        return '';
    } catch (err) {
        console.error('/src/components/UI/inputComp.vue: computed[isInvalid]  => ', err);
        throw err;
    }
});

// Вычисление класса focus для перемещения метки label (которая выступает в качестве placeholder'а)
const computeLabelClass = computed(() => {
    try {
        if(isFocus.value || (props.modelValue !== null && (props.modelValue + '').length)) return 'focus';
        return '';
    } catch (err) {
        console.error('/src/components/UI/inputComp.vue: computed[computeLabelClass]  => ', err);
        throw err;
    }
});

// Вычилсение уникального айдишника для DOM-узла инпута
const inputId = computed(() => {
    try {
        return Math.ceil((Date.now() / (Math.random().toFixed(3) * 1000)));
    } catch (err) {
        console.error('/src/components/UI/inputComp.vue: computed[inputId]  => ', err);
        throw err;
    }
});

// #######################################   METHODS   #######################################

// Обработчик расфокусировки инпута
function handlerBlurInput() {
    try {
        if(!props.modelValue) {
            isFocus.value = false;
            input.value.blur();
        }
    } catch (err) {
        console.error('/src/components/UI/inputComp.vue: handlerBlurInput  => ', err);
        throw err;
    }
}

// Общая функция, которая мутирует ввод в инпут (как middleware)
function mutateValue(value) {
    try {
        // Если требуется, то в инпут не попадают строки, а только числа
        if(props.type === 'number' && typeof value === 'string') {
            return excludeStringChars(value);
        }
        // Если есть пропс capitalize, то при вводе в инпут каждый первый символ нового слова будет в верхнем регистре
        else if(props.capitalize && typeof value === 'string') {
            return capitalizeString(value);
        }
        return value;
    } catch (err) {
        console.error('/src/components/UI/inputComp.vue: mutateValue  => ', err);
        throw err;
    }
}

// Извлечение строковых литералов из строки, чтобы в инпуте оставлять только числа
function excludeStringChars(value) {
    try {
        return value.split('').filter((char) => +char === +char).join('');
    } catch (err) {
        console.error('/src/components/UI/inputComp.vue: excludeStringChars  => ', err);
        throw err;
    }
}

// каждый первый символ нового слова принимаемой строки будет в верхнем регистре
function capitalizeString(value) {
    try {
        return value.toLowerCase().split(' ') .map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');   
    } catch (err) {
        console.error('/src/components/UI/inputComp.vue: capitalizeString  => ', err);
        throw err;
    }
}

// Повысить значение на 1 (Для числового инпута)
function upNum() {
    try {
        if(+props.modelValue === +props.modelValue) {
            let newNum = +props.modelValue + 1;
            if(props.max) {
                if(newNum <= props.max) {
                    emit('update:modelValue', newNum);
                }
            } else {
                emit('update:modelValue', newNum);
            }
        } 
    } catch (err) {
        console.error('/src/components/UI/inputComp.vue: upNum  => ', err);
        throw err;
    }

}

// Понизить значение на 1 (Для числового инпута)
function downNum() {
    try {
        if(+props.modelValue === +props.modelValue) {
            let newNum = +props.modelValue - 1;
            if(newNum >= props.min) {
                emit('update:modelValue', newNum);
            }
        }
    } catch (err) {
        console.error('/src/components/UI/inputComp.vue: downNum  => ', err);
        throw err;
    }
}

// Триггер события "update:modelValue"
function handlerUpdateValue(event) {
    emit('update:modelValue', event.target.value);
}


// #######################################   LIFECYCLE HOOKS   #######################################

onMounted(() => {
    try {
        if(input.value) {
            if(props.throttle) {
                // Обновление значения с временной задержкой
                input.value.addEventListener('input', throttle((event) => {
                    handlerUpdateValue(event);
                }, 500));
            } 
            // Стандартное обновление инпута
            else {
                input.value.addEventListener('input', (event) => {
                    handlerUpdateValue(event);
                });
            }
        }
    } catch (err) {
        console.error('/src/components/UI/inputComp.vue: onMounted  => ', err);
        throw err;
    }
});

</script>

<style scoped>
.input-container {
    height: 3.5rem;
    position: relative;
    display: flex;
    align-items: flex-end;
    border: 1px solid var(--input-border-color);
    border-radius: var(--input-radius);
    padding: 1.625rem 1rem 0.2rem 1rem;
    user-select: none;
    transition: all 0.3s ease;
}
.input-container.invalid {
    border-color: var(--invalid-color);
    transition: all 0.3s ease;
}
.input-label {
    position: absolute;
    transform: translateY(-50%);
    left: 1rem;
    color: var(--input-label-color);
    font-size: var(--input-inner-font-size);
    transition: all var(--input-label-transition) ease;
    cursor: auto;
}
.input-label.focus {
    font-size: var(--input-label-size);
    transition: all var(--input-label-transition) ease;
    transform: translateY(-25px);
}
.input-inner-field {
    height: 1.5rem;
    background-color: rgba(0, 0, 0, 0) !important;
    width: 100%;
    font-size: var(--input-inner-font-size);
    font-family: var(--font);
    font-weight: 400;
    border: none;
    outline: rgba(0,0,0,0);
    color: var(--input-inner-color);
}

.input-container:hover .number-switch {
    scale: 1;
    transition: all 0.2s ease;
}

.number-switch {
    position: absolute;
    top: 0;
    bottom: 0;
    right: 1rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    scale: 0;
    gap: 1px;
    transition: all 0.2s ease;
}
.input-arrow-btn {
    outline: none;
    border: none;
    padding: 0rem 0.2rem;
    background-color: var(--input-arrow-btn-bg);
    cursor: pointer;
    border-radius: 3px;
}
.input-arrow-btn:hover {
    background-color: var(--input-arrow-btn-hover-bg);
}
.input-arrow-btn i {
    font-size: 10px;
    color: var(--primary-color);
}
</style>