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

    position: absolute;
    bottom: 10px;

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


@media (max-width: 750px) {
    .footer {
        text-align: center;

        bottom: 0;

        &__links {
            &__privacy-policy {
                width: 100%;
                font-size: 14px;
            }

            p {
                display: none;
            }
        }
    }
}
</style>