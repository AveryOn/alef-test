import { createRouter, createWebHistory } from "vue-router";
import FormView from '@/views/FormView.vue';

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: "/",
            redirect: { name: "form" },
        },
        {
            path: "/form",
            name: "form",
            component: FormView,
        },
        {
            path: "/preview",
            name: "preview",
            component: () => import("@/views/PreviewView.vue"),
        },
        {
            path: '/:pathMatch(.*)*',
            name: 'notFound',
            component: () => import('@/views/NotFoundView.vue'),
        }
    ],
});

export default router;
