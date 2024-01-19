<template>
    <div id="no-active-session-popup">
        <div class="content-window">
            <h3 class="content-window__title">Select a Device</h3>
            <p class="content-window__description">
                Choose the device that you want to start playing music on. If no devices are available, launch Spotify on the device you want to listen on.
            </p>
            <div class="content-window__devices">
                <p class="content-window__devices__header">
                    Devices
                </p>
                <ol class="content-window__devices__list">
                    <li v-for="device in availableDevices" class="content-window__devices__list__item">
                        <a @click="modalAccept(device.id)">{{ device.id }}</a>
                    </li>
                </ol>
            </div>
            
            <div class="content-window__button-container">
                <p class="content-window__button-container__cancel" @click="modalCancel">Cancel</p>
            </div>

            <!-- <div class="content-window__accept-button-container">
                <button class="button-large" @click="modalAccept">Okay, I got it</button>
            </div> -->
        </div>
    </div>
</template>

<script>
export default {
    emits: ['modalAccepted', 'modalCanceled'],
    computed: {
        availableDevices() {
            return this.$userStore.getAvailableDevices
        },
    },
    methods: {
        modalAccept(deviceId) {
            this.$emit('modalAccepted', deviceId)
        },
        modalCancel() {
            this.$emit('modalCanceled')
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

    &__button-container {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-around;

        margin-top: 40px;

        width: 100%;

        &__cancel {
            color: $c-secondary-gray;
            
            transition: 150ms;

            cursor: pointer;

            &:hover {
                color: $c-light-gray;
                
                transition: 150ms;
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