import { defineStore } from 'pinia'

// Setup Global State
export const useRoomStore = defineStore('room', {
    state: () => ({
        id: null,
        name: null,
        host: null,
        currentMembers: {},
        roomEvents: []
    }),
    actions: {
        checkUserInRoom(userSocketId) {
            const user = this.currentMembers[userSocketId]

            if(user || user !== undefined) {
                return false
            } else {
                return true
            }
        },
        leaveRoom() {
            this.id = null,
            this.name = null,
            this.host = null,
            this.currentMembers = {},
            this.roomEvents = []
        }
    }
})