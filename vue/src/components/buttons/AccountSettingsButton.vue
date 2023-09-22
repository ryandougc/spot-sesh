<template>
    <div class="profile-picture" @click="activateAccountSettingsPopup">
        <ProfilePicture :profilePictureUrl="profilePictureUrl" />
    </div>

    <div 
        v-if="settingsIsActive" 
        v-click-outside="deactivateAccountSettingsPopup"
        class="account-settings"
    >
        <a @click="logout">Logout</a>
        <hr class="account-settings__line-break">
        <a href="/privacypolicy">Privacy Policy</a>
        <a @click="openConfirmDeleteModal">Delete Account</a>
    </div>

    <ConfirmDeleteAccount v-if="confirmDeleteModalActive" @modalAccepted="deleteAccount" @modalCanceled="closeConfirmDeleteModal" />
</template>

<script>
import vClickOutside from 'click-outside-vue3'

import ProfilePicture from '../ProfilePicture.vue'
import ConfirmDeleteAccount from '../modals/ConfirmDeleteAccount.vue'

export default {
    components: {
        ProfilePicture,
        ConfirmDeleteAccount
    },
    data() {
        return {
            settingsIsActive: false,
            profilePictureUrl: this.$userStore.profilePictureUrl,
            confirmDeleteModalActive: false
        }
    },
    methods: {
        activateAccountSettingsPopup() {
            this.settingsIsActive = true
        },
        deactivateAccountSettingsPopup() {
            this.settingsIsActive = false
        },
        logout() {
            this.$authStore.logout()

            this.$router.push('/')
        },
        deleteAccount() {
            this.$authStore.logout()

            localStorage.removeItem('spotify_id')
            localStorage.removeItem('spotify_username')
            localStorage.removeItem('spotify_profilePicture')

            this.$router.push('/')
        },
        openConfirmDeleteModal() {
            this.confirmDeleteModalActive = true
        },
        closeConfirmDeleteModal() {
            this.confirmDeleteModalActive = false
        }
    },
    directives: {
        clickOutside: vClickOutside.directive
    }
}
</script>

<style lang="scss" scoped>
.profile-picture {
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