<template>
    <div class="profile-photo profile-picture-container" @click="activateAccountSettingsPopup">
        <img 
            src="https://i.scdn.co/image/ab67757000003b826c355a38fdc0fc058700f688"
            alt="Spotify profile picture and account settings button"
        >
    </div>

    <div 
        v-if="settingsIsActive" 
        v-click-outside="deactivateAccountSettingsPopup"
        class="account-settings"
    >
        <a @click="">Logout</a>
        <hr class="account-settings__line-break">
        <a href="/privacypolicy">Privacy Policy</a>
        <a @click="">Delete Account</a>
    </div>
</template>

<script>
import vClickOutside from 'click-outside-vue3'

export default {
    data() {
        return {
            settingsIsActive: false
        }
    },
    methods: {
        activateAccountSettingsPopup() {
            this.settingsIsActive = true
        },
        deactivateAccountSettingsPopup() {
            this.settingsIsActive = false
        }
    },
    directives: {
        clickOutside: vClickOutside.directive
    }
}
</script>

<style lang="scss" scoped>
.profile-photo {
    cursor: pointer;
}

.account-settings {
    z-index: 1;

    width: 169px;
    height: 166px;

    padding: 15px;

    position: absolute;

    top: 135%;
    right: 0;

    display: flex;
    flex-direction: column;
    gap: 15px;

    background-color: $c-secondary-gray;

    border-radius: 5px;

    a, p {
        color: white;
        font-size: 16px;
        font-style: normal;
        font-weight: 500;
        line-height: normal;

        text-align: left;

        transition: 150ms;

        cursor: pointer;

        &:hover {
            color: $c-spotify-green;

            transition: 150ms;
        }
    }

    &__line-break {
        width: 100%;
        margin-top: 5px;
        margin-bottom: 5px;
    }
}
</style>