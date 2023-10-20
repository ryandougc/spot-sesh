import { createRouter, createWebHistory } from 'vue-router'

// Components
import Room from './views/Room.vue'
import Home from './views/Home.vue'
import Login from './components/Login.vue'
import PrivacyPolicy from './views/PrivacyPolicy.vue'
import PageNotFound from './views/PageNotFound.vue'
import NoBetaAccess from './views/NoBetaAccess.vue'

import { useAuthStore } from './stores/authStore.js'
import { useUserStore } from './stores/userStore.js'

import ErrorService from './services/ErrorService.js'

import verifyUserAccessToken from './middleware/verifyUserAccessToken'
import redirectOnInvalidPath from './middleware/redirectOnInvalidPath'
import checkForBetaAccess from './middleware/checkForBetaAccess.js'

export const router = createRouter({
    history: createWebHistory(import.meta.env.VITE_BASE_URL),
    routes: [
        {
            path: "/",
            component: Home,
            name: Home,
            beforeEnter: async (to) => {
                try {
                    // Get users spotify profile
                    if(useAuthStore().userExists && to.name !== "NoBetaAccess") {
                        // If fetching profile returns 403 or 401, user doesn't have access to the app in beta mode
                        const userHasAccess = await checkForBetaAccess(useAuthStore().accessToken)

                        if(!userHasAccess) {
                            return { name: NoBetaAccess }
                        }

                        await useUserStore().getSpotifyProfile()
                    }
                } catch(error) {
                    // ErrorService.onError(error)
                    throw new Error(error)
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

                        const userHasAccess = await checkForBetaAccess(useAuthStore().accessToken)

                        if(!userHasAccess) {
                            return { name: NoBetaAccess}
                        }

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
            beforeEnter: async (to) => {
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
        }, {
            path: '/noBetaAccess',
            component: NoBetaAccess,
            name: NoBetaAccess
        }
    ]
})

router.beforeEach(async (to) => {
    await verifyUserAccessToken()

    if(await redirectOnInvalidPath(to) === true) {
        return { name: Home }
    }
})