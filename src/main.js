import './styles/main.css';

import { createApp } from 'vue'
import { createPinia } from 'pinia'

// PrimeVue
import PrimeVue from 'primevue/config';
import Aura from '@primevue/themes/aura';
import primevue_comps from '@/components/primevue_comps';
import ui_comps from '@/components/UI';
import 'primeicons/primeicons.css';

import App from './App.vue'
import router from './router'

const app = createApp(App);

// Init PrimeVue Components
primevue_comps.forEach((component) => {
    app.component(component.name, component);
});

// Init Base Components
ui_comps.forEach((component) => {
    app.component(component.name, component);
});


app
    .use(createPinia())
    .use(router)
    // Init PrimeVue
    .use(PrimeVue, {
        theme: {
            preset: Aura,
        }
    })
    .mount('#app');
