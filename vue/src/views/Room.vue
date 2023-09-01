<template>
    <button @click="leaveRoom">X</button>
    <h3>Room</h3>
    <p>Your Name: {{ usersName }}</p>
    <p>Room id: {{ roomId }}</p>
    <p>Host: {{ roomHost.name }}</p>

    <label>Members</label>
    <ul>
        <li v-for="member in roomMembers" :key="member" >
            {{ member }}
        </li>
    </ul>

    <label>Events</label>
    <ul>
        <li v-for="event in roomEvents" :key="event" >
            {{ event }}
        </li>
    </ul>

    <button @click="startSession">Start Session</button>
</template>
  
<script>
import { socket } from "@/socket"

export default {
    data() {
        return {
            usersName: this.$userStore.name
        }
    },
    computed: {
        roomEvents() {
            return this.$roomStore.roomEvents ? this.$roomStore.roomEvents : []
        },
        roomMembers() {
            return this.$roomStore.currentMembers ? this.$roomStore.currentMembers : []
        },
        roomId() {
            return this.$roomStore.id
        },
        roomHost() {
            return this.$roomStore.host
        }
    },
    methods: {
        leaveRoom() {
            socket.emit('leave-room', this.$roomStore.id, success => {
                if(!success) return console.log("This room could not be found")
                
                console.log("Successfully Left") // This 

                this.$roomStore.leaveRoom()

                this.$router.push('/')
            })
        },
        startSession() {

        }
    }
}
</script>

<style scoped>
ul {
    list-style: none;
}
</style>
  