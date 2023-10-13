<template>
    <div id="no-beta-access_container">
        <p>You do not have access to this application!</p>
        <router-link to="/">Let's get you home</router-link>
    </div>
</template>

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