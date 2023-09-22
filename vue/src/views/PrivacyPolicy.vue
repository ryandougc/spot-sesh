<template>
    <HeaderNoLogin />
    <div id="privacy-policy" class="privacy-policy">


        <h3 class="privacy-policy__title">Privacy Policy</h3>
        <p class="privacy-policy__text">
            Alright, let’s keep this nice and short, in language that we can all understand. 
            SpotSesh (this web application) uses the Spotify Web API to get a list of your top most listened to songs. 
            We also use it to get your Spotify display name and Spotify user ID. That’s it. 
            All storage of this data on our servers is temporary while you are active on SpotSesh. 
            Your data will be removed from our servers once you logout, delete your account, or even close the tab or browser. 
            Some data will be stored in localstorage on your device. This can be deleted by clearing your browser’s cache and data. 
            No data is shared with any third parties.
            <br /><br />
            If you want to revoke the permission you gave us to pull your Spotify data from the Spotify Web API, you can do so here.
            <br /><br />
            By using SpotSesh, you agree to this Privacy Policy.
            <br /><br />
            If you have any questions, please contact me here.
        </p>
    </div>
</template>

<script>
import BackButton from '../components/buttons/BackButton.vue';
import HeaderNoLogin from '../components/HeaderNoLogin.vue';

export default {
    components: {
        BackButton,
        HeaderNoLogin
    }
}
</script>

<style lang="scss" scoped>
.privacy-policy {
    position: relative;

    display: flex;
    flex-direction: column;
    align-items: center;


    &__title {
        margin-top: 75px;
        margin-bottom: 20px;

        width: 100%;

        color: $c-off-white;
        font-size: 20px;
        font-style: normal;
        font-weight: 700;
        line-height: normal;
    }

    &__text {
        color: $c-off-white;
        font-size: 15px;
        font-style: normal;
        font-weight: 500;
        line-height: normal;
    }

    @media (min-width: 900px) {
        margin: 0 auto;

        width: 80%;

        &__title {
            margin-top: 145px;
            margin-bottom: 35px;
        }
    }
}
</style>