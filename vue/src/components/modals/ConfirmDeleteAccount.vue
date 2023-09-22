<template>
    <div id="no-active-session-popup">
        <div class="content-window">
            <h3 class="content-window__title">Sorry to see you go!</h3>
            <p class="content-window__description">
                We hope you had a good time using SpotSesh. 
                By pressing the confirmation "Delete" button below, we will delete all of your information that was used here.
                <br /><br />
                I encourage you to let me know about your experience using SpotSesh. You can find me on Twitter @ryanvoiture.
            </p>
            <div class="content-window__button-container">
                <p class="content-window__button-container__cancel" @click="modalCancel">Cancel</p>
                <button class="content-window__button-container__accept button-large" @click="modalAccept">Delete</button>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    emits: ['modalAccepted', 'modalCanceled'],
    methods: {
        modalAccept() {
            this.$emit('modalAccepted')
        },
        modalCancel() {
            this.$emit('modalCanceled')
        }
    }
}
</script>

<style lang="scss" scoped>
#no-active-session-popup {
    position: fixed;
    z-index: 1;
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
    height: 400px;

    padding: 1rem 2rem;

    background-color: $c-dark-gray;
    border: 2px solid $c-secondary-gray;
    border-radius: 15px;

    &__title {
        font-size: 21px;
        font-weight: 900;
    }

    &__description {
        margin-top: 15px;

        font-size: 15px;
        font-weight: 400;
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

        &__accept {
            width: 135px;

            background-color: $c-orange;
            transition: 150ms;

            &:hover {
                background-color: $c-red;
                transition: 150ms;
            }
        }
    }
}
</style>