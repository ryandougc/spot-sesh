import { defineStore } from 'pinia'

// Setup Global State
export const useRoomStore = defineStore('room', {
    state: () => ({
        id: null,
        host: {},
        currentMembers: {},
        roomEvents: [],
        sessionActive: false
    }),
    getters: {
        upperCaseHostName: (state) => {
            if(!state.host || state.host.name === undefined) return null
            
            const firstLetterUpperCase = state.host.name.charAt(0).toUpperCase()
            const upperCaseName = firstLetterUpperCase + state.host.name.slice(1)

            return upperCaseName
        },
        getRoomObject: (state) => {
            return {
                id: state.id,
                host: state.host,
                currentMembers: state.currentMembers,
                roomEvents: state.roomEvents,
                sessionActive: state.sessionActive
            }
        }
    },
    actions: {
        removeMember(roomMembers, usersName) {
            this.currentMembers = roomMembers

            this.roomEvents.push(`${usersName} has left the room`)
        },
        addMember(user) {
            this.currentMembers[user.spotifyId] = user
            this.addRoomEvent(`${user.name} has joined the room`)
        },
        checkUserIsHost(spotifyId) {
            return this.host.spotifyId === spotifyId ? true : false
        },
        leaveRoom() {
            this.id = null,
            this.host = {},
            this.currentMembers = {},
            this.roomEvents = [],
            this.sessionActive = false
        },
        addRoomEvent(event) {
            this.roomEvents.push(event)
        },
        startListeningSession(eventMessage) {
            this.roomEvents.push(eventMessage)

            this.sessionActive = true
        },
        currentUserJoinedRoom(room) {
            this.id = room.id
            this.currentMembers = room.members
            this.host = room.host

            this.addRoomEvent("You joined")
        },
        currentUserCreatedRoom(room) {
            this.id = room.id
            this.host = room.host

            this.roomEvents.push("You created this room")
        },
        changeRoomHost(newHost) {
            this.host = newHost
        }
    },
})