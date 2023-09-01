import { createRouter, createWebHistory } from 'vue-router'

// Components
import Room from './views/Room.vue'
import Home from './views/Home.vue'
import Login from './components/Login.vue'

export const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: "/",
            component: Home
        }, {
            path: "/callback",
            component: Login
        }, {
            path: "/room/:roomId",
            component: Room
        }
    ]
})