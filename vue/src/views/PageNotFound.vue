<template>
    <div id="error_404_container">
        <p>Error 404: Page not found</p>
        <router-link to="/">Let's get you home</router-link>
    </div>
</template>

<style scoped lang="scss">
#error_404_container {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    p {
        margin-bottom: 50px;
    }
}
</style>