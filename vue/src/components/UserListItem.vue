<template>
    <div class="user-list-item">
        <div class="user-list-item__profile-picture profile-picture-container">
            <img :src="profilePictureURI" alt="Spotify profile picture">
        </div>

        <p class="user-list-item__name">{{ usersName }}</p>
    </div>
</template>

<script>
export default {
    props: {
        usersName: String,
        profilePictureURI: String
    }
}
</script>

<style lang="scss" scoped>
.user-list-item {
    margin: 11px 0;

    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: left;

    &__profile-picture {
        width: 40px;
        height: 40px;
    }

    &__name {
        margin-left: 25px;

        font-size: 15px;
        font-weight: 500;
    }
}
</style>