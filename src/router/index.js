import { createRouter, createWebHistory } from 'vue-router'
import {useVerwaltungsStore} from '@/stores/PraktikumsverwaltungStore.js'
import Home from "@/views/Home.vue";

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/login',
            name: 'login',
            component: () => import('../views/Login.vue')
        },
        {
            path: '/',
            name: 'home',
            // route level code-splitting
            // this generates a separate chunk (About.[hash].js) for this route
            // which is lazy-loaded when the route is visited.
            component: Home
        },
        {
            path: '/getkurs',
            name: 'getkurs',
            component: () => import('../views/KursErstellenFinden.vue')
        },
        {
            path: '/kurs',
            name: 'kurs',
            component: () => import('../views/TabellenAnsicht.vue')
        },
        {
            path: '/student',
            name: 'students',
            component: () => import("../views/InfoStudent.vue")
        },
        {
            path: '/student/:studentid',
            name: 'student',
            component: () => import("../views/InfoStudent.vue")
        },
        {
            path: '/aufgabe',
            name: 'aufgabes',
            component: () => import("../views/AufgabenTermin.vue")
        },
        {
            path: '/aufgabe/:studentid/:aufgabeid',
            name: 'aufgabe',
            component: () => import("../views/AufgabenTermin.vue")
        },

        {
            path: '/test',
            name: 'test',
            component: () => import('../views/Test.vue')
        },

    ]
})

/*router.beforeEach(async (to, from) => {
    // ✅ This will work because the router starts its navigation after
    // the router is installed and pinia will be installed too
    const store = useVerwaltungsStore()
    if (to.name !== "login" && !store.isLoggedIn()) return {name: "login"}
})

 */
export default router
