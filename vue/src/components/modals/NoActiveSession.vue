<template>
    <div id="no-active-session-popup">
        <div class="content-window">
            <h3 class="content-window__title">That's not gonna work!</h3>
            <p class="content-window__description">
                Spotify needs an active device to start a listening session.
            </p>
            <div class="content-window__instructions">
                <p class="content-window__instructions__header">
                    Here's how to do this
                </p>
                <ol class="content-window__instructions__list">
                    <li class="content-window__instructions__list__item">
                        Open Spotify on the device you want to start listening on
                    </li>
                    <li class="content-window__instructions__list__item">
                        Hit play on the music. You can pause it immediately if you'd like
                    </li>
                    <li class="content-window__instructions__list__item">
                        Come back here and click the "Start Listening" button again
                    </li>
                </ol>
            </div>
            <div class="content-window__accept-button-container">
                <button class="button-large" @click="modalAccept">Okay, I got it</button>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    emits: ['modalAccepted'],
    methods: {
        modalAccept() {
            this.$emit('modalAccepted')
        }
    }
}
</script>

<style lang="scss" scoped>
#no-active-session-popup {
    position: absolute;
    left: 0;
    top: 0;

    display: flex;
    align-items: center;
    justify-content: center;

    width: 100vw;
    height: 100vh;

    background-color: rgba(0,0,0,0.4);
}

.content-window {
    display: flex block;
    flex-direction: column;
    align-items: left;

    width: 320px;
    height: 450px;

    padding: 1rem 2rem;

    background-color: $c-dark-gray;
    border: 2px solid $c-secondary-gray;
    border-radius: 15px;

    &__title {
        font-size: 21px;
        font-weight: 900;
    }

    &__description {
        margin-top: 5px;

        font-size: 15px;
        font-weight: 400;
    }

    &__instructions {
        margin-top: 20px;

        &__header {
            font-size: 16px;
            font-weight: 900;
        }
        &__list {
            margin-top: 3px;
            padding: 0 20px;

            &__item {
                margin-top: 3px;

                font-size: 15px;
                font-weight: 400;
            }


        }
    }

    &__accept-button-container {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;

        margin-top: 30px;

        width: 100%;

        button {
            background-color: $c-spotify-green;
            transition: 150ms;

            &:hover {
                background-color: $c-dark-green;
                transition: 150ms;
            }
        }


    }
}
</style>