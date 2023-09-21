<template>
    <div class="footer">
        <div class="footer__links">
            <router-link to="/privacypolicy" class="footer__links__privacy-policy">Privacy Policy</router-link>
            <p>
                Created by <a href="https://twitter.com/ryanvoiture">RyanVoiture</a>
            </p>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.footer {
    width: 70%;

    margin-top: 5vh;
    margin-bottom: 5px;

    position: relative;

    &__links {
        display: flex;
        flex-direction: row;
        justify-content: space-between;

        color: $c-secondary-gray;

        a {
            color: $c-secondary-gray;
        }
    }
}

@media (min-height: 750px) {
    .footer {
        margin-top: 0;
        margin-bottom: 0;

        position: absolute;
        bottom: 20px;
    }
}

@media (max-width: 750px) {
    .footer {
        text-align: center;

        bottom: 0;

        &__links {
            &__privacy-policy {

                display: none;
            }

            p {
                width: 100%;
                font-size: 14px;
            }
        }
    }
}
</style>