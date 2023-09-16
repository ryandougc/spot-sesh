import { defineStore } from 'pinia'

// Setup Global State
export const useUserStore = defineStore('user', {
    state: () => ({
        socketId: null,
        name: localStorage.getItem("spotify_username"),
        id: localStorage.getItem("spotify_id"),
        top5: []
    }),
    getters: {
        properName: (state) => {
            const firstLetterUpperCase = state.name.charAt(0).toUpperCase()
            const upperCaseName = firstLetterUpperCase + state.name.slice(1)

            return upperCaseName
        }
    },
    actions: {
        async getSpotifyUsername() {
            try {
                if(this.name && this.name !== undefined && this.name !== "undefined") {
                    console.log("Already Have Spotify Username")
                    return this.name
                } 

                console.log("Fetching Spotify Username")

                const access_token = localStorage.getItem("access_token")

                const result = await fetch("https://api.spotify.com/v1/me", {
                    method: "GET", 
                    headers: { Authorization: `Bearer ${access_token}` }
                })
            
                const spotifyProfile = await result.json()
                const spotifyUsername = spotifyProfile.display_name
                const spotifyId = spotifyProfile.id

                this.name = spotifyUsername
                localStorage.setItem("spotify_username", spotifyUsername)
                this.id = spotifyId
                localStorage.setItem("spotify_id", spotifyId)
            
                return spotifyUsername
            } catch(error) {
                console.log(error)
            }
        }
    }
})