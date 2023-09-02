<template>
    <!-- <component :is="!authStore.userExists ? Login : Lobby" /> -->
    <Login v-if="!$authStore.userExists" />
    <Lobby v-else-if="$authStore.userExists && !$userStore.userInRoom" />
</template>

<script>
import Login from '../components/Login.vue'
import Lobby from '../components/Lobby.vue'

export default {
    components: {
        Lobby,
        Login
    }
}
</script>