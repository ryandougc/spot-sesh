import { createRouter, createWebHistory } from 'vue-router'

// Components
import Room from './views/Room.vue'
import Home from './views/Home.vue'
import Login from './components/Login.vue'
import PrivacyPolicy from './views/PrivacyPolicy.vue'
import PageNotFound from './views/PageNotFound.vue'

import { useAuthStore } from './stores/authStore.js'
import { useUserStore } from './stores/userStore.js'

import ErrorService from './services/ErrorService.js'

import verifyUserAccessToken from './middleware/verifyUserAccessToken'
import redirectOnInvalidPath from './middleware/redirectOnInvalidPath'

export const router = createRouter({
    history: createWebHistory(import.meta.env.VITE_BASE_URL),
    routes: [
        {
            path: "/",
            component: Home,
            name: Home,
            beforeEnter: async () => {
                try {
                    // Get users spotify profile
                    if(useAuthStore().userExists) {
                        await useUserStore().getSpotifyProfile()
                    }
                } catch(error) {
                    ErrorService.onError(error)
                }
            }
        }, {
            // This path is simply used as an intermediary for the spotify API token request return redirect
            path: "/callback",
            component: Login,
            beforeEnter: async (to) => {
                // Handle redirecting routes from /callback to homepage if the authentication is successful

                const clientId = import.meta.env.VITE_SPOTIFY_CLIENT_ID
                const redirectUri = `${import.meta.env.VITE_FRONTEND_URL}/callback`
                const code = to.query.code

                try {
                    if(code !== null || code !== undefined) {
                        await useAuthStore().getAccessToken(clientId, code, redirectUri)

                        await useUserStore().getSpotifyProfile()
        
                        return { name: Home }
                    }
                } catch(error) {
                    ErrorService.onError(error)
                }
            }
        }, {
            path: "/privacypolicy",
            component: PrivacyPolicy,
            name: PrivacyPolicy
        }, {
            path: "/room/:roomId",
            component: Room,
            name: Room,
            beforeEnter: (to) => {
                // Remove query param clk=F from path if it exists
                const regex = /\?[A-Za-z0-9]+=F/
                to.query = {}
                to.fullPath = to.fullPath.replace(regex, '')
            }
        }, {
            // Catchall route. If user navigates to any route that isn't found, the 404 page will be shown
            path: '/:pathMatch(.*)*',
            component: PageNotFound,
            name: 404
        }
    ]
})

router.beforeEach(async () => {
    await verifyUserAccessToken()

    await redirectOnInvalidPath()
})