import { createRouter, createWebHistory } from 'vue-router'
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
            component: Home,
            children: [
                {
                    path: '/getkurs',
                    name: 'getkurs',
                    component: () => import('../views/KursErstellenFinden.vue')
                },
                {
                    path: '/kurs/:kursid',
                    name: 'kurs',
                    component: () => import('../views/TabellenAnsicht.vue')
                },
                {
                    path: '/student',
                    name: 'studenttestseite',
                    component: () => import("../views/InfoStudent.vue")
                },
                {
                    path: 'kurs/student/:studentid',
                    name: 'student',
                    component: () => import("../views/InfoStudent.vue")
                },
                {
                    path: '/aufgabe',
                    name: 'aufgabetestseite',
                    component: () => import("../views/AufgabenTermin.vue")
                },
                {
                    path: 'kurs/aufgabe/:studentid/:aufgabeid',
                    name: 'aufgabe',
                    component: () => import("../views/AufgabenTermin.vue")
                },
            ]
        },

    ]
})

router.beforeEach(async (to, from) => {
    if (to.name !== "login" && (sessionStorage.getItem("wsToken") === null)) return {name: "login"}
})


export default router
