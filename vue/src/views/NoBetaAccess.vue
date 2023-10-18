<template>
    <div id="no-beta-access_container">
        <p>You do not have access to this application!</p>
        <router-link to="/">Go Back to Homepage</router-link>
    </div>
</template>

<script>
export default {
    mounted() {
        this.$authStore.logout()
    }
}
</script>

<style scoped lang="scss">
#no-beta-access_container {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    p {
        margin-bottom: 50px;
    }
}
</style>