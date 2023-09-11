import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './assets/style.css'
import { createPinia } from 'pinia'

const app = createApp(App)

const pinia = createPinia()

app.use(router)

app.use(pinia)

app.provide("provideRouter", router)

app.mount('#app')
