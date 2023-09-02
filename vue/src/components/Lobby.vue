<template>
  <h3>Lobby</h3>

  <div id="join-room-container">
      <p>Name: {{ user.name }}</p>
      <label for="recipient">Join A Session</label> <br />
      <input type="text" name="recipient" id="recipient_input" placeholder="Session Id" v-model="sessionToJoin">
      <button id="joinRoom_button" @click="joinRoom">Join</button>

      <p v-if="failedToJoinRoom">That room doesn't exist, please try again</p>
  </div>

  <div id="create-room-container">
      <button id="joinRoom_button" @click="createRoom">Create A Session</button>
  </div>
</template>

<script>
import { socket } from '@/socket'
import { getSpotifyTop5Tracks } from '../lib/spotifyDataFetching.js'

export default {
  data() {
    return {
      sessionToJoin: "",
      failedToJoinRoom: false
    }
  },
  computed: {
    user() {
      return {
        name: this.$userStore.name,
        socketId: this.$userStore.socketId,
        top5: this.$userStore.top5
      }
    }
  },
  methods: {
    joinRoom() {
      socket.emit('join-room', this.sessionToJoin, this.user, (success, room) => {
        if(success) {
            // Move the user into the room they just created
            this.$router.push(`/room/${room.id}?clk=F`)

            this.$roomStore.roomEvents.push("You joined")
            this.$roomStore.id = room.id
            this.$roomStore.currentMembers = room.members
            this.$roomStore.host = room.members[room.host]
        } else {
            this.sessionToJoin = ""
            this.failedToJoinRoom = true
        }
      })
    },
    createRoom() {
      socket.emit('create-room', this.user, (success, room) => {
        if(success) {
            // Move the user into the room they just created
            this.$router.push(`/room/${room.id}?clk=F`)

            this.$roomStore.roomEvents.push("You created this room")
            this.$roomStore.id = room.id
            this.$roomStore.currentMembers[this.user.socketId] = this.user
            this.$roomStore.host = this.user
        }
      })
    }
  },
  async mounted() {
      // Get user's top 5 tracks
      this.$userStore.top5 = await getSpotifyTop5Tracks(this.$authStore.accessToken)
  }
}
</script>

<style scoped>

</style>
