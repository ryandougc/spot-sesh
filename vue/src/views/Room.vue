<template>
    <HeaderLogin class="room__header" />
    <div id="room">

        <BackButton class="room__back-button" @click="backButton" /> <!-- the @click used to trigger leaveRoom. But leaving the route also triggers leaveRoom, so it was being called twice. -->

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
                @click="activeDevices"
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

    <NoActiveSession v-if="noActiveSessionModalActive" @modalAccepted="startSession" @modalCanceled="toggleNoActiveSessionModal" />
    
    <Footer class="footer" />
</template>
  
<script>
import { socket } from "@/socket"
import { playTracks, getAvailableDevices } from '../lib/spotifyDataFetching.js'
import { shuffleArray } from '../lib/utils.js'

import HeaderLogin from "../components/HeaderLogin.vue"
import Footer from "../components/Footer.vue"
import UserListItem from "../components/UserListItem.vue"
import BackButton from "../components/buttons/BackButton.vue"
// import NoActiveSession from '../components/modals/NoActiveSession.vue'
import NoActiveSession from '../components/modals/SelectPlaybackDevice.vue'

import ErrorService from "../services/ErrorService.js"

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
            noActiveSessionModalActive: false
        }
    },
    computed: {
        user() {
            return this.$userStore.userObject
        },
        room() {
            return this.$roomStore.getRoomObject
        },
        userIsHost() {
            return this.$roomStore.checkUserIsHost(this.$userStore.spotifyId)
        },
    },
    methods: {
        backButton() {
            this.$router.push('/')
        },
        leaveRoom() {
            socket.emit('leave-room', this.room.id, this.user, (success, data, message) => {
                if(!success) return ErrorService.onError(new Error(message))

                this.$roomStore.leaveRoom()
            })
        },
        startSession(deviceId = null) {
            socket.emit('start-session-request', this.room.id, async (success, trackList) => {
                try {
                    if(success) {
                        const shuffledTracklist = shuffleArray(trackList)

                        const result = await playTracks(this.$authStore.accessToken, shuffledTracklist, deviceId)

                        if(result.status === 404) {
                            const errorStartingSessionEvent = 'Error starting session: You need an active device with Spotify ready'
                            this.$roomStore.addRoomEvent(errorStartingSessionEvent)

                            // this.toggleNoActiveSessionModal()
                        } else {
                            socket.emit('start-session', this.room.id, () => {
                                this.$roomStore.startListeningSession('You have started a listening session')
                            })
                        }
                    }
                } catch(error) {
                    ErrorService.onError(error)
                }

            })
        },
        toggleNoActiveSessionModal() {
            this.noActiveSessionModalActive = !this.noActiveSessionModalActive
        },
        async activeDevices() {
            const devices = await getAvailableDevices(this.$authStore.accessToken)

            this.$userStore.availableDevices = devices

            this.toggleNoActiveSessionModal()
        }
    },
    created() {
        socket.on('user-joined-room', user => {
            try {
                this.$roomStore.addMember(user)
            } catch(error) {
                ErrorService.onError(error)
            }
        })

        socket.on('change-room-host', host => {
            try {
                this.$roomStore.changeRoomHost(host)

                if(this.user.spotifyId === host.spotifyId) {
                    this.$roomStore.addRoomEvent(`You are now the host`)
                } else {
                    this.$roomStore.addRoomEvent(`${host.name} is now the host`)
                }
            } catch(error) {
                ErrorService.onError(error)
            }
        })

        socket.on('user-left-room', ({room, user}) => {
            try {
                this.$roomStore.removeMember(room.members, user.name)
            } catch(error) {
                ErrorService.onError(error)
            }
        })

        socket.on('session-started', _ => {
            try {
                this.$roomStore.startListeningSession('Listening session has started')
            } catch(error) {
                ErrorService.onError(error)
            }
        })
    },
    beforeRouteLeave() {
        socket.off('user-joined-room')
        socket.off('change-room-host')
        socket.off('user-left-room')
        socket.off('session-started')
        this.leaveRoom()
    }
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
  