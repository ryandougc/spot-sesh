import { createRouter, createWebHistory } from 'vue-router'

// Components
import Room from './views/Room.vue'
import Home from './views/Home.vue'
import Login from './components/Login.vue'
import PrivacyPolicy from './views/PrivacyPolicy.vue'
import PageNotFound from './views/PageNotFound.vue'

import { useAuthStore } from './stores/authStore.js'
import { useUserStore } from './stores/userStore.js'

import { getAccessToken } from './lib/spotifyApiAuth.js'

export const router = createRouter({
    history: createWebHistory(import.meta.env.VITE_BASE_URL),
    routes: [
        {
            path: "/",
            component: Home,
            name: Home,
            beforeEnter: async () => {
                // Get users spotify profile
                if(useAuthStore().userExists) {
                    await useUserStore().getSpotifyProfile()
                }
            }
        }, {
            // This path is simply used as an intermediary for the spotify API token request return redirect
            path: "/callback",
            component: Login,
            beforeEnter: async (to) => {
                // Handle redirecting routes from /callback to homepage is the authentication is successful

                const clientId = import.meta.env.VITE_SPOTIFY_CLIENT_ID
                const redirectUri = `${import.meta.env.VITE_FRONTEND_URL}/callback`
                const code = to.query.code

                try {
                    if(code !== null || code !== undefined) {
                        await getAccessToken(clientId, code, redirectUri)
        
                        // set tokens in authStore
                        useAuthStore().accessToken = localStorage.getItem('access_token')
                        useAuthStore().refreshToken = localStorage.getItem('refresh_token')
                        useAuthStore().accessTokenExpiry = localStorage.getItem('access_token_expiry')
        
                        // Get user's profile
                        await useUserStore().getSpotifyProfile()
        
                        return { name: Home }
                    }
                } catch(error) {
                    console.log(error)
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
    // Check if user has a token or not. If the user needs to be refreshed, refresh the token now
    try {
        // Check if the user already exists
        const { tokenExists, tokenIsValid } = await useAuthStore().tokenIsValid

        if(!tokenExists && !tokenIsValid) {
            // User needs to log in
            console.log("User is logged out")
        } else {
            if(tokenExists && !tokenIsValid) {
                // Users token needs to be refreshed
                console.log("token needs to be refreshed")
                await await useAuthStore().refreshToken()
            } else {
                // Users token is valid
                console.log("User is valid")
            }
        }
    } catch(error) {
        console.log(error)
    }
})

router.beforeEach((to) => {
    // check for the path "/user/*" and redirect back to the homepage if this path is found
    const regex = /\/room\/[A-Za-z0-9]+/i

    if(to.path.match(regex) && (to.query.clk !== "F" || to.query.clk === undefined)) {
        return { name: Home }
    }
})