import { defineStore } from 'pinia'

import { getUserProfile } from '../lib/spotifyDataFetching.js'
import { getSpotifyTop5Tracks } from '../lib/spotifyDataFetching.js'

// Setup Global State
export const useUserStore = defineStore('user', {
    state: () => ({
        socketId: null,
        name: localStorage.getItem("spotify_username"),
        spotifyId: localStorage.getItem("spotify_id"),
        top5: [],
        profilePictureUrl: localStorage.getItem("spotify_profilePicture") || null
    }),
    getters: {
        upperCaseName: (state) => {
            const firstLetterUpperCase = state.name.charAt(0).toUpperCase()
            const upperCaseName = firstLetterUpperCase + state.name.slice(1)

            return upperCaseName
        },
        userObject: (state) => {
            return {
                socketId: state.socketId,
                name: state.name,
                spotifyId: state.spotifyId,
                top5: state.top5,
                profilePictureUrl: state.profilePictureUrl
            }
        }
    },
    actions: {
        async getSpotifyProfile() {
            if(this.name && this.name !== undefined && this.name !== "undefined") {
                
            } else {
                const access_token = localStorage.getItem("access_token")
    
                const profile = await getUserProfile(access_token)
    
                this.name = profile.display_name
                this.id = profile.id
    
                if(profile.images.length === 0) {
                    this.profilePictureUrl = null
                } else {
                    this.profilePictureUrl = profile.images[0].url
                }
            }
        },
        async getTop5Tracks(accessToken) {
            if(this.top5.length <= 0) {
                const top5Tracks = await getSpotifyTop5Tracks(accessToken)

                this.top5 = top5Tracks
            }
        }
    }
})