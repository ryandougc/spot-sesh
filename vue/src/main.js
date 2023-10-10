import './assets/styles/main.scss'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import { useAuthStore } from './stores/authStore.js'
import { useUserStore } from './stores/userStore.js'
import { useRoomStore } from './stores/roomStore.js'

import { router } from './router.js'

import App from './App.vue'
import ErrorService from './services/ErrorService'

const pinia = createPinia()
const app = createApp(App)

app.use(pinia)

// Install stores globally with custom plugin
app.use({
    install(app) {
        app.config.globalProperties.$authStore = useAuthStore()
        app.config.globalProperties.$userStore = useUserStore()
        app.config.globalProperties.$roomStore = useRoomStore()
    }
})


app.use(router)

app.config.errorHandler = (error, instance, info) => ErrorService.onError(error)

app.mount('#app')