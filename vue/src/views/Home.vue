<template>
    <!-- <component :is="!authStore.userExists ? Login : Lobby" /> -->
    <Login v-if="!$authStore.userExists" />
    <Lobby v-else-if="$authStore.userExists && !$userStore.userInRoom" :usersName="$userStore.name" />
</template>

<script>
import Login from '../components/Login.vue'
import Lobby from '../components/Lobby.vue'

export default {
    components: {
        Lobby,
        Login
    },
    async mounted() {
        try {
            // Check if the user already exists
            const { tokenExists, tokenIsValid } = await this.$authStore.tokenIsValid

            if(!tokenExists && !tokenIsValid) {
                // User needs to log in
                console.log("User is logged out")
            } else {
                if(tokenExists && !tokenIsValid) {
                    // Users token needs to be refreshed
                    console.log("token needs to be refreshed")
                    await this.$authStore.refreshToken()
                } else {
                    // Users token is valid
                    console.log("User is valid")
                }

                // Get users spotify username
                this.$userStore.name = await this.$userStore.getSpotifyUsername()
            }
        } catch(error) {
            console.log(error)
        }
    }
}
</script>

<style scoped>

</style>