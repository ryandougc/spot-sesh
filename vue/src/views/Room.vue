<template>
    <button @click="leaveRoom">X</button>
    <h3>Room</h3>
    <p>Your Name: {{ usersName }}</p>
    <!-- <p>Room id: {{ roomId }}</p> -->
    <p>Host: {{ roomHost }}</p>

    <label>Members</label>
    <ul>
        <li v-for="member in roomMembers" :key="member" >
            {{ member.name }}
        </li>
    </ul>

    <label>Events</label>
    <ul>
        <li v-for="event in roomEvents" :key="event" >
            {{ event }}
        </li>
    </ul>

    <button v-if="userIsHost && sessionStartAvailable" @click="startSession">Start Session</button>
</template>
  
<script>
import { socket } from "@/socket"
import { playTracks } from '../lib/spotifyDataFetching.js'
import { shuffleArray } from '../lib/utils.js'

export default {
    data() {
        return {
            usersName: this.$userStore.name,
            roomId: this.$roomStore.id,
            roomHost: this.$roomStore.host.name,
            sessionStartAvailable: true
        }
    },
    computed: {
        roomEvents() {
            return this.$roomStore.roomEvents ? this.$roomStore.roomEvents : []
        },
        roomMembers() {
            return this.$roomStore.currentMembers ? this.$roomStore.currentMembers : []
        },
        userIsHost() {
            return this.$roomStore.checkUserIsHost(this.$userStore.socketId)
        },
    },
    methods: {
        leaveRoom() {
            socket.emit('leave-room', this.$roomStore.id, success => {
                if(!success) return console.log("This room could not be found")
             
                console.log("Successfully Left") // This 

                this.$router.push('/')

                this.$roomStore.leaveRoom()
            })
        },
        startSession() {
            socket.emit('start-session-request', this.$roomStore.id, async (success, trackList) => {
                try {
                    if(success) {
                        const shuffledTracklist = shuffleArray(trackList)

                        const result = await playTracks(this.$authStore.accessToken, shuffledTracklist)

                        if(result.status === 404) {
                            this.$roomStore.roomEvents.push('Error starting session: You need an active device with Spotify ready')

                            alert('You need to have an active device availalble for Spotify. Open Spotify and start playing a song on the device you want the session to play on. Then come back here and press the "Start Session" button.')
                        } else {
                            socket.emit('start-session', this.$roomStore.id, () => {
                                this.$roomStore.roomEvents.push('You have started a listening session')

                                this.sessionStartAvailable = false
                            })
                        }
                    }
                } catch(error) {
                    console.log(error)
                }

            })
        }
    }
}
</script>

<style scoped>
ul {
    list-style: none;
}
</style>
  