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
        removeMember(spotifyId) {
            console.log("Here")
            console.log(this.currentMembers[spotifyId])
            delete this.currentMembers[spotifyId]
        },
        checkUserInRoom(spotifyId) {
            const userIsInRoom = this.currentMembers[spotifyId]

            if(userIsInRoom || userIsInRoom !== undefined) {
                return false
            } else {
                return true
            }
        },
        checkUserIsHost(userSpotifyId) {
            return this.host !== null && userSpotifyId === this.host.spotifyId ? true : false
        },
        leaveRoom() {
            this.id = null,
            this.name = null,
            this.host = null,
            this.currentMembers = {},
            this.roomEvents = [],
            this.sessionActive = false
        }
    }
})