<template>
    <div class="navbar">
        <router-link to="/" tag="img">
            <img 
                class="navbar__logo spot-sesh-logo"
                src="../assets/images/logos/SpotSesh-logo.svg" 
                alt="SpotSesh Logo"
            >
        </router-link>

        <div class="navbar__links">
            <a href="">How it Works</a>
            <a @click="authCodeFlow">Login</a>
        </div>
    </div>
</template>

<script>
import { redirectToAuthCodeFlow } from '../lib/spotifyApiAuth.js'

export default {
    methods: {
        async authCodeFlow() {
            await redirectToAuthCodeFlow()
        },
    }
}
</script>

<style lang="scss" scoped>
.navbar {
    width: 70%;
    
    position: absolute;

    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;

    &__links {

        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        gap: 65px;

        text-align: right;

        a {
            color: $c-white;
            font-weight: 700;
            line-height: 2px;

            transition: 150ms;

            &:hover {
                color: $c-spotify-green;

                transition: 150ms;

                cursor: pointer;
            }
        }
    }
}

@media (max-width: 750px) {
    .navbar {
        justify-content: center;

        &__links {
            display: none;
        }
    }
}
</style>