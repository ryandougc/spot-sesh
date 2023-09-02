<template>
    <button @click="authCodeFlow">Login</button>
</template>

<script>
import { redirectToAuthCodeFlow } from '../lib/spotifyApiAuth.js'

export default {
    computed: {
        code() {
            let code = new URLSearchParams(window.location.search).get('code')
            return code ? code : null
        }
    },
    methods: {
        async authCodeFlow() {
            await redirectToAuthCodeFlow()
        },
    }
}
</script>