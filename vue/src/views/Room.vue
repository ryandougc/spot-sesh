<template>
    <HeaderLogin class="room__header" />
    <div id="room">

        <BackButton class="room__back-button" @click="leaveRoom" />

        <div class="room__information">
            <p class="room__information__page-title">{{ room.host.name }}'s Room</p>
            <p 
                v-if="!userIsHost && !room.sessionActive"
                class="room__information__session-status"
            >
                Waiting on your host to start playing the music
            </p>
            <p 
                v-if="!userIsHost && room.sessionActive"
                class="room__information__session-status"
            >
                Listening session has already started
            </p>

            <div class="room__information__users-section">
                <div class="room__information__users-section__host">
                    <p class="room__information__users-section__host__title section-title">HOST</p>
                    <div class="room__information__users-section__host__user-card">
                        <UserListItem
                            :usersName="room.host.name"
                            :profilePictureUrl="room.host.profilePictureUrl" 
                        />
                    </div>
                </div>

                <div class="room__information__users-section__members">
                    <p class="room__information__users-section__members__title section-title">MEMBERS</p>
                    <ul class="room__information__users-section__members__list">
                        <li v-for="member in room.currentMembers" :key="member" >
                            <UserListItem
                                :usersName="member.name"
                                :profilePictureUrl="member.profilePictureUrl" 
                            />
                        </li>
                    </ul>
                </div>
            </div>

            <div class="room__information__messages-section">
                <p class="room__information__messages-section__title section-title">MESSAGES</p>
                <ul>
                    <li v-for="event in room.roomEvents" :key="event" >
                        {{ event }}
                    </li>
                </ul>
            </div>
        </div>


        <div class="room__start-listening-section">
            <button 
                class="room__start-listening-section__button button-large"
                v-if="userIsHost && !room.sessionActive"
                @click="startSession"
            >
                Start Listening
            </button>
            <p
                class="room__start-listening-section__session-started-text"
                v-if="userIsHost && room.sessionActive"
            >
                You already started a listening session
            </p>
        </div>

    </div>

    <NoActiveSession v-if="noActiveSessionModalActive" @modalAccepted="toggleNoActiveSessionModal" />
    
    <Footer class="footer" />
</template>
  
<script>
import { socket } from "@/socket"
import { playTracks } from '../lib/spotifyDataFetching.js'
import { shuffleArray } from '../lib/utils.js'

import HeaderLogin from "../components/HeaderLogin.vue"
import Footer from "../components/Footer.vue"
import UserListItem from "../components/UserListItem.vue"
import BackButton from "../components/buttons/BackButton.vue"
import NoActiveSession from '../components/modals/NoActiveSession.vue'

export default {
    components: {
        HeaderLogin,
        Footer,
        UserListItem,
        BackButton,
        NoActiveSession
    },
    data() {
        return {
            user: this.$userStore.userObject,
            // roomId: this.$roomStore.id,
            noActiveSessionModalActive: false
        }
    },
    computed: {
        room() {
            return this.$roomStore.getRoomObject
        },
        // roomHost() {
        //     return {
        //         name: this.$roomStore.host.name || null,
        //         profilePictureUrl: this.$roomStore.host.profilePictureUrl
        //     }
        // },
        // sessionActive() {
        //     return this.$roomStore.sessionActive
        // },
        // roomEvents() {
        //     return this.$roomStore.roomEvents ? this.$roomStore.roomEvents : []
        // },
        // currentMembers() {
        //     return this.$roomStore.currentMembers ? this.$roomStore.currentMembers : []
        // },
        userIsHost() {
            return this.$roomStore.checkUserIsHost(this.$userStore.spotifyId)
        },
    },
    methods: {
        leaveRoom() {
            socket.emit('leave-room', this.room.id, this.user, (success, data, message) => {
                if(!success) return console.log(message)

                this.$roomStore.leaveRoom()
                this.$router.push('/')
            })
        },
        startSession() {
            socket.emit('start-session-request', this.room.id, async (success, trackList) => {
                try {
                    if(success) {
                        const shuffledTracklist = shuffleArray(trackList)

                        const result = await playTracks(this.$authStore.accessToken, shuffledTracklist)

                        if(result.status === 404) {
                            this.$roomStore.roomEvents.push('Error starting session: You need an active device with Spotify ready')

                            // alert('You need to have an active device availalble for Spotify. Open Spotify and start playing a song on the device you want the session to play on. Then come back here and press the "Start Session" button.')
                            this.toggleNoActiveSessionModal()
                        } else {
                            // socket.emit('start-session', this.$roomStore.id, () => {
                            //     this.$roomStore.roomEvents.push('You have started a listening session')

                            //     this.$roomStore.sessionActive = true
                            // })
                        }
                    }
                } catch(error) {
                    console.log(error)
                }

            })
        },
        toggleNoActiveSessionModal() {
            this.noActiveSessionModalActive = !this.noActiveSessionModalActive
        }
    },
    beforeRouteLeave() {
        // this.leaveRoom()
        this.$roomStore.leaveRoom()
    },
}
</script>

<style lang="scss" scoped>
// Reusables
ul {
    padding: 0;

    list-style: none;
}
.section-title {
    margin-top: 38px;
    margin-bottom: 15px;

    color: $c-secondary-gray;
    font-size: 14px;
    font-weight: 700;
}

// Page Styles
#room {
    position: relative;
    height: 90vh;
}
.room__header {
    display: none;
}
.room__back-button {
    display: inherit;
}
.room__information {
    display: flex;
    flex-direction: column;

    &__page-title {
        margin-top: 10px;

        color: $c-off-white;
        font-size: 20px;
        font-style: normal;
        font-weight: 700;
        line-height: normal;
    }

    &__session-status {
        width: 75%;

        color: $c-light-gray;

        overflow-wrap: break-word;
    }

    &__users-section {
        margin-top: 25px;

        &__host {
            &__title {
                margin-top: 0;
            }
        }


        &__members__list li:not(:first-child){
            margin-top: 25px;
        }
    }
}


.room__start-listening-section {
    width: 100%;

    position: absolute;
    bottom: 20px;

    display: flex;
    flex-direction: row;
    justify-content: center;

    &__button {
        background-color: $c-spotify-green;
        transition: 150ms;

        &:hover {
            background-color: $c-dark-green;
            transition: 150ms;
        }
    }

    &__session-started-text {
        text-align: center;
        color: $c-light-gray;
    }
}

.footer {
    display: none;
}


@media (min-width: 900px) {
    #room {
        height: 70vh;
    }
    .room__header {
        display: flex;

        margin-bottom: 100px;
    }
    .room__back-button {
        display: none;
    }

    .room__information {
        padding-top: 35px;

        &__users-section {
            order: 3;

            margin-top: 0;
            padding-right: 90px;

            position: absolute;
            right: 0px;

            &__host {
                &__title {
                    margin-top: 0;
                }
            }
        }

        &__messages-section {
            order: 2;
        }
    }


    .footer {
        display: initial;
    }
}

</style>
  