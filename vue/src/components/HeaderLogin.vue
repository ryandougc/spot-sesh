<template>
    <div class="navbar">
        <img 
            class="navbar__logo spot-sesh-logo"
            src="../assets/SpotSesh-logo.svg" 
            alt="SpotSesh Logo"
        >
        <img
            class="navbar__logo-mobile spot-sesh-logo-mobile"
            src="../assets/SpotSesh-logo-mobile.svg" 
            alt="SpotSesh Logo"
        >

        <div class="navbar__links">
            <a href="">How it Works</a>
            <a @click="authCodeFlow" v-if="!userIsLoggedIn">Login</a>
            <ProfilePicture v-if="userIsLoggedIn" />
        </div>
    </div>
</template>

<script>
import ProfilePicture from './ProfilePicture.vue'

import { redirectToAuthCodeFlow } from '../lib/spotifyApiAuth.js'

export default {
    components: {
        ProfilePicture
    },
    computed: {
        userIsLoggedIn() {
            return this.$authStore.userExists
        }
    },
    methods: {
        async authCodeFlow() {
            await redirectToAuthCodeFlow()
        },
    }
}
</script>

<style lang="scss" scoped>
.navbar {
    width: 100%;

    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;

    &__logo {
        display: inherit;
    }

    &__logo-mobile {
        display: none;
    }

    &__links {
        position: relative;

        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
        gap: 50px;

        a {
            color: $c-white;
            font-weight: 700;

            transition: 150ms;

            &:hover {
                color: $c-spotify-green;

                transition: 150ms;

                cursor: pointer;
            }
        }
    }

    @media (max-width: 750px) {

        &__logo {
            display: none;
        }

        &__logo-mobile {
            display: inherit;
        }

        &__links a {
            display: none;
        }
    }
}
</style>