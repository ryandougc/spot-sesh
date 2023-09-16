<template>
    <div class="button_spotify-login" @click="authCodeFlow">
        <img 
            class="button_spotify-login__spotify-logo"
            src="../../assets/icons/spotify-logo.svg"
            alt="Spotify Logo"
        >
            <p class="button_spotify-login__text">Spotify Login</p>

    </div>
</template>

<script>
import { redirectToAuthCodeFlow } from '../../lib/spotifyApiAuth.js'

export default {
    methods: {
        async authCodeFlow() {
            await redirectToAuthCodeFlow()
        },
    }
}
</script>

<style lang="scss" scoped>
.button_spotify-login {
    width: 238px;
    height: 45px;

    padding: 8px;

    position: relative;

    display: flex;
    align-items: center;

    background-color: $c-spotify-green;
    box-sizing: border-box;

    border-radius: 50px;

    cursor: pointer;

    transition: 150ms background-color;

    &:hover {
        background-color: $c-dark-green;
        transition: 150ms background-color;
    }

    &__spotify-logo {
        position: absolute;
        display: flex;
        width: 30px;
        height: 30px;
        justify-content: center;
        align-items: center;
        flex-shrink: 0;
    }

    &__text {
        width: 100%;
        text-align: center;

        font-size: 18px;
        font-weight: 500;
    }
}
</style>