<template>
    <button class="button" :class="`${computeClassBtn} ${props.disabled? 'disabled' : ''}`" :disabled="props.disabled">
        <span class="btn-inner">
            <i v-if="isVisibleIcon($slots.default)" :class="`btn-icon ${props.icon}`"></i>
            <span v-if="props.label">{{ props.label }}</span>
            <slot v-else></slot>
            <i v-if="props.loading" class="btn-icon pi-spin pi pi-spinner" :style="($slots.default || props.label)? {marginLeft: '0.3rem'} : {}"></i>
        </span>
    </button>
</template>

<script setup>
import { computed, defineProps } from 'vue';

// #######################################   PROPS   #######################################

const props = defineProps({
    variant: {
        type: String,
        required: false,
        default: 'outline',  // filled | outline
    },
    label: {
        type: String,
        required: false,
        default: null,
    },
    icon: {
        type: String,
        required: false,
        default: null,
    },
    disabled: {
        type: Boolean,
        required: false,
        default: null,
    },
    loading: {
        type: Boolean,
        required: false,
        default: null,
    },
});

// #######################################   COMPUTED   #######################################

// Вычисление класса варианта для кнопки
const computeClassBtn = computed(() => {
    try {
        if(props.variant === 'outline') return 'outline';
        else if (props.variant === 'filled') return 'filled';
        else if (props.variant === 'text') return 'text';
        else return '';
    } catch (err) {
        console.error('/src/components/UI/btnComp.vue: computed[computeClassBtn] => ', err);
        throw err;
    }
});

// Вычисление видимости иконки
const isVisibleIcon = computed(() => {
    return (slot) => {
        try {
            let visible = true;
            if(!props.icon) visible = false;
            if(props.loading) {
                if((!props.label && !slot) && props.icon) {
                    visible = false;
                }
            }
        return visible;
        } catch (err) {
            console.error('/src/components/UI/btnComp.vue: computed[isVisibleIcon] => ', err);
            throw err;
        }
    }
});

</script>

<style scoped>
.button {
    height: 2.75rem;
    padding: 10px 20px;
    font-size: 14px;
    font-family: var(--font);
    font-weight: 400;
    text-align: center;
    border: none;
    outline: rgb(0, 0, 0);
    border-radius: 100px;
    cursor: pointer;
}
.btn-inner {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 4px;
}
.btn-icon {
    color: var(--btn-color);
    font-size: 16px;
}

/* Button Outline */
.button.outline {
    color: var(--btn-color);
    background-color: var(--btn-outline-bg);
    border: 2px solid var(--btn-border-color);
    transition: all var(--btn-transition) ease;
}
.button.outline:hover {
    background-color: var(--btn-outline-hover-bg);
    transition: all var(--btn-transition) ease;
}

/* Button Filled */
.button.filled {
    color: var(--btn-filled-color);
    background-color: var(--btn-filled-bg);
    transition: all var(--btn-transition) ease;
}
.button.filled:hover {
    background-color: var(--btn-filled-hover-bg);
    transition: all var(--btn-transition) ease;
}
.button.filled .btn-icon {
    color: var(--btn-filled-color);
}
.button.filled.disabled {
    color: var(--btn-filled-disabled-color);
    background-color: var(--btn-filled-disabled-bg);
    cursor: default;
}

/* Button Text */
.button.text {
    height: max-content !important;
    color: var(--btn-text-color);
    background-color: var(--btn-text-bg);
    transition: all var(--btn-transition) ease;
    padding: 0 !important;
}
.button.text:hover {
    color: var(--btn-text-hover-color);
    transition: all var(--btn-transition) ease;
}

.button.text .btn-icon {
    color: var(--btn-text-color);
}
</style>