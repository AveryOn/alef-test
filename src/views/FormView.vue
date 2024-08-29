<template>
    <form @submit.prevent class="form-view__main">

        <!-- Персональные Данные -->
        <div class="personal-data-block">
            <h2 class="block-title">Персональные данные</h2>
            <div class="personal-data__input-block">
                <!-- Имя пользователя -->
                <inputComp 
                v-model="ownerData.name" 
                capitalize 
                :invalid="isInvalidOwnerName"
                :placeholder="'Имя'" 
                type="text"
                @update:model-value="(name) => updateDraftOwnerName(name)"
                />
                <!-- Возраст пользователя -->
                <inputComp 
                v-model="ownerData.age" 
                :placeholder="'Возраст'" 
                :invalid="isInvalidOwnerAge"
                type="number"
                @update:model-value="(age) => updateDraftOwnerAge(age)"
                />
            </div>
        </div>

        <!-- Данные О Детях -->
        <div class="childrens-data-block">
            <div class="childrens-data__header">
                <h2 class="block-title">Дети (макс. 5)</h2>
                <!-- + Добавить Данные О Ребенке -->
                <btnComp 
                v-if="childrens.length < 5"
                icon="pi pi-plus" 
                :variant="'outline'" 
                :label="'Добавить ребенка'" 
                @click="handlerAppendChild"
                />
            </div>
            <div class="childrens-data__input-block">
                <!-- Спиннер Загрузки -->
                <ProgressSpinner 
                v-show="isLoadingChildrens"
                style="width: 30px; height: 30px; color: #000;" 
                strokeWidth="5" 
                fill="transparent"
                animationDuration=".5s" 
                />
                <!-- Заглушка на случай, если данных о детях нет -->
                <span class="stub-is-not-list" v-show="isShowStub && !isLoadingChildrens">Список пуст</span>

                <!-- Отрисовка данных детей -->
                <TransitionGroup 
                class="children-list"
                name="child-list" 
                tag="ul" 
                @after-leave="() => toggleStub('leave')"
                @before-enter="() => toggleStub('enter')"
                >
                    <childItemComp 
                    v-for="child in childrens" 
                    :key="child.id" 
                    :child-data="child" 
                    :invalid-childs="invalidChilds"
                    @update:child-name="(name, id) => handlerUpdateChildName(name, id)"
                    @update:child-age="(age, id) => handlerUpdateChildAge(age, id)"
                    @remove="(childId) => handlerRemoveChild(childId)"
                    />
                </TransitionGroup>
            </div>
        </div>

        <!-- Блок Кнопок Взаимодействия с формой -->
        <div class="actions-block">
            <!-- Сохранить -->
            <btnComp 
            :variant="'filled'" 
            :label="'Сохранить'" 
            :disabled="isSaveDisabled" 
            :loading="isLoadingSave" 
            @click="handlerConfirmForm"
            />
            <!-- Сбросить (Изменения формы) -->
            <btnComp 
            v-show="isDispersionForm" 
            :variant="'text'" 
            :label="'Сбросить'" 
            style="margin-left: 1.25rem;" 
            @click="handlerResetForm"
            />
        </div>
    </form>
</template>

<script setup>
import childItemComp from '@/components/childItemComp.vue';
import { updateChildList, getChildrens } from '@/api/childrensApi';
import { getProfileData, updateProfileData } from '@/api/profileApi';
import { useRouter } from 'vue-router';
import { onBeforeMount, reactive, ref } from 'vue';


// #######################################   COMPOSABLES   #######################################
const router = useRouter();


// #######################################   DATA   #######################################
const ownerData = reactive({
    name: '',
    age: null,
});
const isInvalidOwnerName = ref(false);      // Состояние ошибки для поля ввода Name пользователя
const isInvalidOwnerAge = ref(false);       // Состояние ошибки для поля ввода Age пользователя
const childrens = ref([]);                  // Массив по детям
const isDispersionForm = ref(false);        // Флаг указывает на то, есть ли разичие между черновиком формы в localStorage и фактическими данными которые уже сохранены
const invalidChilds = ref([]);              // Массив айдишников элементов по детям. Нужен для того чтобы подсвечивать инпуты как invalid поля (например если при сохранении какой-либо инпут пустой)
const isLoadingChildrens = ref(false);      // Состояние загрузки по детям с типа сервера
const isSaveDisabled = ref(true);           // Состояние, относительно которого кнопка "Сохранить" активна или нет.
const isLoadingSave = ref(false);           // Состояние отвечает за отображение спинера загрузки внутри кнопки "Сохранить"
const isShowStub = ref(false);              // Отображение заглушки, при пустом массиве "childrens"


// #######################################   METHODS   #######################################

// Переключение видимости заглушки "Список пуст"
function toggleStub(stage) {
    try {
        if(stage === 'leave' && !childrens.value.length) isShowStub.value = true;
        else if(stage === 'enter' && childrens.value.length >= 1) isShowStub.value = false; 
    } catch (err) {
        console.error('/src/views/FormView.vue: toggleStub => ', err);
        throw err;
    }
}

// Проверка на различие в данных между черновиками и исходными данными формы
function checkDispersionForm() {
    try {
        if(!JSON.parse(localStorage.getItem('draft_childrens')).length && !JSON.parse(localStorage.getItem('draft_owner_data'))) {
            isDispersionForm.value = false;
            isSaveDisabled.value = true;
        } 
        else {
            isDispersionForm.value = true;
            isSaveDisabled.value = false;
        }
    } catch (err) {
        console.error('/src/views/FormView.vue: checkDispersionForm => ', err);
        throw err;
    }
} 

// Обновление поля "Имя" текущего пользователя
function updateDraftOwnerName(name) {
    try {
        if(!!name) isDispersionForm.value = true;
        localStorage.setItem('draft_owner_data', JSON.stringify({ ...ownerData }));
        isSaveDisabled.value = false;
        isInvalidOwnerName.value = false;
    } catch (err) {
        console.error('/src/views/FormView.vue: updateDraftOwnerName => ', err);
        throw err;
    }
}

// Обновление поля "Возраст" текущего пользователя
function updateDraftOwnerAge(age) {
    try {
        if(!!age) isDispersionForm.value = true;
        localStorage.setItem('draft_owner_data', JSON.stringify({ ...ownerData }));
        isSaveDisabled.value = false;
        isInvalidOwnerAge.value = false;
    } catch (err) {
        console.error('/src/views/FormView.vue: updateDraftOwnerAge => ', err);
        throw err;
    }
}

// Обновление поля имени ребенка
function handlerUpdateChildName(name, childId) {
    try {
        childrens.value.map((child) => {
        if(child.id === childId) {
                if(!name) {
                    if(!invalidChilds.value.includes(child.id)) invalidChilds.value.push(childId);
                }
                child.name = name;
                return child;
            }
            return child;
        });
        updateChildrensDraft();
        checkDispersionForm();
    } catch (err) {
        console.error('/src/views/FormView.vue: handlerUpdateChildName => ', err);
        throw err;
    }
}

// Обновление поля возраста ребенка
function handlerUpdateChildAge(age, childId) {
    try {
        childrens.value.map((child) => {
        if(child.id === childId) {
                if(!age) {
                    if(!invalidChilds.value.includes(child.id)) invalidChilds.value.push(childId);
                }
                child.age = age;
                return child;
            }
            return child;
        });
        updateChildrensDraft();
        checkDispersionForm();
    } catch (err) {
        console.error('/src/views/FormView.vue: handlerUpdateChildAge => ', err);
        throw err;
    }
}

// Обработчик добавления нового поля данных ребенка
function handlerAppendChild() {
    try {
        childrens.value.unshift({
            id: Date.now(),
            name: null,
            age: null,
        });
        updateChildrensDraft();
        checkDispersionForm();
    } catch (err) {
        console.error('/src/views/FormView.vue: handlerAppendChild => ', err);
        throw err;
    }
}

// Обработчик удаления поля данных ребенка
function handlerRemoveChild(childId) {
    try {
        childrens.value = childrens.value.filter((child) => child.id !== childId);
        updateChildrensDraft();
    } catch (err) {
        console.error('/src/views/FormView.vue: handlerRemoveChild => ', err);
        throw err;
    }
}

// Инициализация черновика для списка данных по детям в localStorage
function initDraftChildrens() {
    try {
        let childrensDraft = localStorage.getItem('draft_childrens');
        // Если черновик отсутствует, то создается новый 
        if(!childrensDraft) {
            localStorage.setItem('draft_childrens', '[]');
            childrensDraft = [];
        } 
        // Если черновик существует
        else {
            // Во избежание проблем связанных с не валидной JSON-строкой
            try {
                childrensDraft = JSON.parse(childrensDraft);
            } catch (err) {
                localStorage.setItem('draft_childrens', '[]');
                childrensDraft = [];
            }
        }
        if(Array.isArray(childrensDraft)) return childrensDraft;
        else return null;
    } catch (err) {
        console.error('/src/views/FormView.vue: initDraftChildrens => ', err);
        throw err;
    }
}

// Обновление черновика для списка данных по детям
function updateChildrensDraft() {
    try {
        localStorage.setItem('draft_childrens', JSON.stringify(childrens.value));
        isDispersionForm.value = true; // После обновления черновика, подразумевается, что теперь есть отличия черновика и исходных данных
    } catch (err) {
        console.error('/src/views/FormView.vue: updateChildrensDraft => ', err);
        throw err;
    }
}

// Сбросить изменения внесенные в форму. (Для отката изменения, которые были внесены в форму [и данных пользователя и по детям] )
function handlerResetForm() {
    try {
        const storageChildrens = JSON.parse(localStorage.getItem('childrens'));
        const storageOwnerData = JSON.parse(localStorage.getItem('owner_data')) ?? { name: '', age: null };
        childrens.value = storageChildrens;
        ownerData.name = storageOwnerData.name;
        ownerData.age = storageOwnerData.age;
        localStorage.setItem('draft_childrens', '[]');
        localStorage.removeItem('draft_owner_data');
        isDispersionForm.value = false;
    } catch (err) {
        console.error('/src/views/FormView.vue: handlerResetForm => ', err);
        throw err;
    }
}

// Извлечь черновик данных пользователя для формы 
function getDraftOwnerData() {
    try {
        let ownerDataDraft = JSON.parse(localStorage.getItem('draft_owner_data'));
        if(!ownerDataDraft) {
            return null;
        }
        else {
            isSaveDisabled.value = false;
            return ownerDataDraft;
        }
    } catch (err) {
        console.error('/src/views/FormView.vue: getDraftOwnerData => ', err);
        throw err;
    }
}

// Валидация списка по детям, для выявления в них не заполненных полей.
function hasValideChildrensList() {
    try {
        let isValide = true;
        for (const child of childrens.value) {
            if(!child.name || !child.age) {
                isValide = false;
                // В Специальный массив добавляется айдишник элемента данных (Если его еще в массиве нет) Для того чтобы на основе данного айдишника выявить незаполненные поля 
                if(!invalidChilds.value.includes(child.id)) invalidChilds.value.push(child.id);
            }
        }
        return isValide;
    } catch (err) {
        console.error('/src/views/FormView.vue: hasValideChildrensList => ', err);
        throw err;
    }
}

// Валидация полей данных пользователя
function hasValideOwnerData() {
    try {
        let isValide = true;
        if(!ownerData.name) {
            isValide = false;
            isInvalidOwnerName.value = true;
        }
        if(!ownerData.age) {
            isValide = false;
            isInvalidOwnerAge.value = true;
        }
        return isValide;
    } catch (err) {
        console.error('/src/views/FormView.vue: hasValideOwnerData => ', err);
        throw err;
    }
}

// Обработчик подтверждения формы
async function handlerConfirmForm() {
    try {
        // Деактивация кнопки и запуск загрузки
        isSaveDisabled.value = true;
        isLoadingSave.value = true;

        // Валидация данных пользователя 
        if(hasValideOwnerData()) {
            await updateProfileData(ownerData)
            localStorage.removeItem('draft_owner_data'); // удаление черновика данных пользователя
        } else return;

        // Валидация списка данных по детям
        if(hasValideChildrensList()) {
            await updateChildList(childrens.value);
            localStorage.setItem('draft_childrens', '[]'); // удаление черновика данных по детям
            isDispersionForm.value = false;
        } else return;
        // Переход на страницу превью
        router.push({ name: 'preview' });
    } catch (err) {
        console.error('/src/views/FormView.vue: handlerConfirmForm => ', err);
        throw err;
    } finally {
        isSaveDisabled.value = false;
        isLoadingSave.value = false;
    }
}

// #######################################   LIFECYCLE HOOKS   #######################################

onBeforeMount(async () => {
    // Полученние данных по детям с типа сервера
    try {
        isLoadingChildrens.value = true;
        childrens.value = await getChildrens();         // Запрос на типа сервер
        !childrens.length && (isShowStub.value = true); // Появление заглушки "Список пуст" при пустом массиве данных по детям
    } catch (err) {
        console.error('/src/views/FormView.vue: onBeforeMount[getChildrens] => ', err);
        throw err;
    } finally {
        isLoadingChildrens.value = false;
    }
    // Инициализация черновика для данных по детям
    const draftChildrens = initDraftChildrens();
    // Заполнение массива childrens по данным из черновика (Если они есть)
    if(draftChildrens && draftChildrens.length) {
        if(!childrens.value.length) childrens.value = [...draftChildrens];
        else {
            childrens.value = [...draftChildrens];
            draftChildrens.forEach((draftChild) => {
                childrens.value = childrens.value.map((child) => {
                    if(draftChild.id === child.id) {
                        child = { ...draftChild };
                    }
                    return child;
                })
            })
        }
    }
    // Извлечение данных пользователя с типа сервера
    try {
        const response = await getProfileData();
        // Заполнение данных пользователя, которые пришли с сервера
        if(response) {
            ownerData.name = response?.name;
            ownerData.age = response?.age;
        }
        // Если есть черновик данных пользователя, то заполняем данные по нему
        const draftOwnerData = getDraftOwnerData();
        if(draftOwnerData) {
            ownerData.name = draftOwnerData.name;
            ownerData.age  = draftOwnerData.age;
        }
    } catch (err) {
        console.error('/src/views/FormView.vue: onBeforeMount[getProfileData] => ', err);
        throw err;
    } 
    finally {
        // Проверка на наличие изменения в форме
        checkDispersionForm();
    }
})

</script>

<style scoped>
.child-list-enter-active,
.child-list-leave-active {
  transition: all 0.5s ease;
}
.child-list-enter-from,
.child-list-leave-to {
  opacity: 0;
  transform: translateX(30px);
}

.form-view__main {
    width: 100%;
    height: auto;
    display: flex;
    flex-direction: column;
    align-items: center;
}
.block-title {
    font-family: var(--font);
    font-weight: 500;
    font-size: 16px;
    margin-right: auto;
}
.personal-data-block {
    display: flex;
    flex-direction: column;
    gap: 20px;
    width: 45%;
    height: max-content;
}
.personal-data__input-block {
    display: flex; 
    flex-direction: column;
    gap: 20px;
}
.childrens-data-block {
    display: flex;
    flex-direction: column;
    width: 45%;
    height: max-content;
    gap: 20px;
    margin-top: 1.875rem;
}
.childrens-data__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
}
.childrens-data__input-block {
    position: relative;
    display: flex; 
    flex-direction: column;
    gap: 20px;
}
.children-list {
    width: 100% !important;
}
.actions-block {
    display: flex;
    align-items: center;
    width: 45%;
    margin-top: 1.875rem;
}

.stub-is-not-list {
    width: 100%;
    text-align: center;
    padding-top: 1rem;
    color: var(--secondary-color);
    user-select: none;
}
</style>
