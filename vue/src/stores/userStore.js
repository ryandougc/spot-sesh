import { defineStore } from 'pinia'

// Setup Global State
export const useUserStore = defineStore('user', {
    state: () => ({
        socketId: null,
        name: localStorage.getItem("spotify_username"),
        top5: []
    }),
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

                this.name = spotifyUsername
                localStorage.setItem("spotify_username", spotifyUsername)
            
                return spotifyUsername
            } catch(error) {
                console.log(error)
            }
        }
    }
})