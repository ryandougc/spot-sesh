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
        removeMember(spotifyId, roomMembers) {
            this.currentMembers = roomMembers
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
        }
    }
})