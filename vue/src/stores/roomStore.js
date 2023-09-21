import { defineStore } from 'pinia'

// Setup Global State
export const useRoomStore = defineStore('room', {
    state: () => ({
        id: null,
        name: null,
        host: null,
        currentMembers: {},
        roomEvents: [],
        sessionActive: false
    }),
    getters: {
        upperCaseHostName: (state) => {
            if(!state.host) return null
            
            const firstLetterUpperCase = state.host.name.charAt(0).toUpperCase()
            const upperCaseName = firstLetterUpperCase + state.host.name.slice(1)

            return upperCaseName
        }
    },
    actions: {
        checkUserInRoom(userSocketId) {
            const user = this.currentMembers[userSocketId]

            if(user || user !== undefined) {
                return false
            } else {
                return true
            }
        },
        checkUserIsHost(userSocketId) {
            return this.host !== null && userSocketId === this.host.socketId ? true : false
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