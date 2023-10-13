<template>
    <div class="user-list-item">
        <div class="user-list-item__profile-picture profile-picture-container">
            <ProfilePicture :profilePictureUrl="profilePictureUrl || 'https://blendicons.s3.eu-central-1.amazonaws.com/files/C8i5xC1kkJ60hK6YC5sp.svg'" />
        </div>

        <p class="user-list-item__name">{{ displayName }}</p>
    </div>
</template>

<script>
import ProfilePicture from './ProfilePicture.vue';

export default {
    props: {
        usersName: String,
        profilePictureUrl: String,
    },
    components: {
        ProfilePicture
    },
    computed: {
        displayName() {
            return this.$userStore.name === this.usersName ? "You" : this.usersName
        }
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