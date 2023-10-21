import { defineStore } from 'pinia'

import { getAccessToken, refreshAccessToken } from '../lib/spotifyApiAuth.js'

// Setup Global State
export const useAuthStore = defineStore('auth', {
    state: () => ({
        accessToken: localStorage.getItem('access_token') || null,
        accessTokenExpiry: new Date(localStorage.getItem('access_token_expiry')).getTime() || null,
        refreshToken: localStorage.getItem('refresh_token') || null
    }),
    getters: {
        userExists: (state) => !!state.accessToken,
        tokenIsValid: (state) => {
            const statusMessage = { tokenExists: true, tokenIsValid: true }

            if(!state.accessToken || state.accessToken === undefined) {
                // If access Token doesn't exist
                statusMessage.tokenExists = false
                statusMessage.tokenIsValid = null

                return statusMessage
            }

            if(state.accessToken && state.accessTokenExpiry < Date.now()) {
                // If access token exists but is expired and requires refresh
                statusMessage.tokenIsValid = false

                return statusMessage
            }

            return statusMessage
        }
    },
    actions: {
        async refreshToken() {
            const client_id = import.meta.env.VITE_SPOTIFY_CLIENT_ID
            const refresh_token = localStorage.getItem('refresh_token')

            await refreshAccessToken(client_id, refresh_token)

            this.accessToken = localStorage.getItem('access_token')
            this.accessTokenExpiry = new Date(localStorage.getItem('access_token_expiry')).getTime()
            this.refreshToken = localStorage.getItem('refresh_token')
        },
        async getAccessToken(clientId, code, redirectUri) {
            const response = await getAccessToken(clientId, code, redirectUri)
        
            // set tokens in authStore
            this.accessToken = response.accessToken
            this.refreshToken = response.refreshToken
            this.accessTokenExpiry = response.accessTokenExpiry
        },
        async logout() {
            localStorage.removeItem('access_token')
            localStorage.removeItem('access_token_expiry')
            localStorage.removeItem('expires_in')
            localStorage.removeItem('refresh_token')

            this.accessToken = null
            this.accessTokenExpiry = null
            this.refreshToken = null
        }
    }
})