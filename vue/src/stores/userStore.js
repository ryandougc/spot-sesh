import { defineStore } from 'pinia'

import { getUserProfile } from '../lib/spotifyDataFetching.js'

// Setup Global State
export const useUserStore = defineStore('user', {
    state: () => ({
        socketId: null,
        name: localStorage.getItem("spotify_username"),
        id: localStorage.getItem("spotify_id"),
        top5: [],
        profilePictureUrl: localStorage.getItem("spotify_profilePicture")
    }),
    getters: {
        properName: (state) => {
            const firstLetterUpperCase = state.name.charAt(0).toUpperCase()
            const upperCaseName = firstLetterUpperCase + state.name.slice(1)

            return upperCaseName
        }
    },
    actions: {
        async getSpotifyProfile() {
            try {
                if(this.name && this.name !== undefined && this.name !== "undefined") {
                    console.log("Already Have Spotify Username")
                    return this.name
                } 

                console.log("Fetching Spotify Username")

                const access_token = localStorage.getItem("access_token")

                const profile = await getUserProfile(access_token)

                this.name = profile.display_name
                this.id = profile.id

                if(profile.images.length === 0) {
                    this.profilePictureUrl = "https://blendicons.s3.eu-central-1.amazonaws.com/files/C8i5xC1kkJ60hK6YC5sp.svg"
                } else {
                    this.profilePictureUrl = profile.images[0].url
                }
            } catch(error) {
                console.log(error)
            }
        }
    }
})