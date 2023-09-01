<template>
    <button @click="authCodeFlow">Login</button>
</template>

<script>
import { getAccessToken, redirectToAuthCodeFlow } from '../lib/spotifyApiAuth.js'

export default {
    data() {
        return {
            clientId: import.meta.env.VITE_SPOTIFY_CLIENT_ID,
            redirectUri: 'http://localhost:5173/callback',
            scope: 'user-top-read'
        }
    },
    computed: {
        code() {
            let code = new URLSearchParams(window.location.search).get('code')
            return code ? code : null
        }
    },
    methods: {
        async authCodeFlow() {
            await redirectToAuthCodeFlow(this.clientId, this.redirectUri, this.scope)
        },
    },
    async mounted() {
        try {
            if(this.code !== null) {
                await getAccessToken(this.clientId, this.code, this.redirectUri)

                // set tokens in authStore
                this.$authStore.accessToken = localStorage.getItem('access_token')
                this.$authStore.refreshToken = localStorage.getItem('refresh_token')
                this.$authStore.accessTokenExpiry = localStorage.getItem('access_token_expiry')

                // Get user's name
                await this.$userStore.getSpotifyUsername()

                this.$router.push('/')
            }
        } catch(error) {
            console.log(error)
        }
    },
}
</script>