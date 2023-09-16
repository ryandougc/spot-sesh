<template>
    <div class="container">
        <HeaderNoLogin />

        <div class="description">
            <img 
                class="description__img phone-playing-music-icon"
                src="../assets/icons/phone-and-music.svg" 
                alt="Icon of Phone playing Music"
            >

            <div class="description__content">
                <div class="description__content__text">
                    <p>Join Friends.</p>
                    <p>Shuffle everyone's top songs.</p>
                    <p>Jam out.</p>
                </div>

                <div class="description__content__CTA">
                    <ButtonSpotifyLogin class="description__content__CTA__button spotify-login-btn" />
                    <p class="description__content__CTA__subtext">Music is better with friends</p>
                </div>
            </div>
        </div>

        <Footer />
    </div>

</template>

<script>
import ButtonSpotifyLogin from './buttons/ButtonSpotifyLogin.vue'
import HeaderNoLogin from './HeaderNoLogin.vue'
import Footer from './Footer.vue'

export default {
    components: {
        ButtonSpotifyLogin,
        HeaderNoLogin,
        Footer
    },
    computed: {
        code() {
            let code = new URLSearchParams(window.location.search).get('code')
            return code ? code : null
        }
    }
}
</script>

<style lang="scss" scoped>
.container {
    display: flex;
    flex-direction: column;
    align-items: center;
}

.description {
    margin-top: 15vh;

    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10vh;

    &__img {

    }

    &__content {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 10vh;

        &__text {
            font-size: 20px;
            font-weight: 500;
            font-style: normal;
            font-weight: 500;
        }

        &__CTA {
            width: min-content;

            display: flex;
            flex-direction: column;
            align-items: center;

            &__button {
                margin-bottom: 10px;
            }

            &__subtext {
                position: relative;

                font-size: 14px;
                color: $c-secondary-gray;
                text-align: center;
                font-style: normal;
                font-weight: 500;
                line-height: normal;
            }
        }
    }

    @media (min-height: 750px) {
        margin-top: 18vh;

        &__content {
            gap: 17vh;
        }
    }

    @media (min-width: 900px) {
        flex-direction: row-reverse; 

        &__img {
            width: 300px;
            height: 300px;
        }

        &__content {
            margin-top: 100px;

            align-items: flex-start;
            gap: 12vh;

            &__text {
                margin-top: 50px;

                font-size: 28px;
                line-height: 1.75;
            }
        }
    }
}
</style>