import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './assets/style.css'
import { createPinia } from 'pinia'
import {useVerwaltungsStore} from './stores/PraktikumsverwaltungStore.js'

const pinia = createPinia()

const app = createApp(App)


app.use(router)

app.use(pinia)

app.provide("provideRouter", router)



app.mount('#app')
