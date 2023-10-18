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
            // this.currentMembers = this.currentMembers.filter((member) => {
            //     member.spotifyId != spotifyId;
            //   });

            // this.currentMembers = this.currentMembers.filter(e => !(e.spotifyId === spotifyId))

        },
        // checkUserInRoom(spotifyId) {
        //     console.log(this.currentMembers[spotifyId])
        //     const userIsMemberInRoom = this.currentMembers[spotifyId]
        //     const userIsHostOfRoom = this.host.spotifyId = spotifyId

        //     if(userIsMemberInRoom || userIsHostOfRoom) {
        //         return true
        //     } else {
        //         return false
        //     }
        // },
        checkUserIsHost(spotifyId) {
            console.log(this.host.spotifyId)
            const userIsHostOfRoom = this.host.spotifyId = spotifyId
            
            return userIsHostOfRoom ? true : false
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