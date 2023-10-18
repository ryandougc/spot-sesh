import axios from 'axios'

export async function getSpotifyTop5Tracks(accessToken) {
    try {
        // const results = await fetch("https://api.spotify.com/v1/me/top/tracks?limit=5&offset=0&time_range=short_term", {
        //     method: "GET",
        //     headers: { "Authorization": `Bearer ${accessToken}` }
        // })

        // const data = await results.json()

        const results = await axios({
            method: 'GET',
            url: 'https://api.spotify.com/v1/me/top/tracks?limit=5&offset=0&time_range=short_term',
            headers: {
                Authorization: `Bearer ${accessToken}`
            },
            responseType: "json",
            validateStatus: (status) => {
                return status >= 200 && status < 300
            } 
        })

        const top5Tracks = results.data.items

        if(top5Tracks.length === 0) return []

        const top5TrackUris = top5Tracks.map(track => track.uri)

        return top5TrackUris
    } catch(error) {
        throw new Error(error.message)
    }
}

export async function playTracks(accessToken, trackList) {
    try {
        const body = JSON.stringify({ "uris": trackList })

        return await fetch(`https://api.spotify.com/v1/me/player/play`, {
            method: "PUT",
            headers: { "Authorization": `Bearer ${accessToken}` },
            body: body
        })
    } catch(error) {
        throw new Error(error.message)
    }
}

export async function getUserProfile(accessToken) {
    // Get the user's Spotify username Spotify ID, and Spotify profile URI
    try {
        const result = await fetch("https://api.spotify.com/v1/me", {
            method: "GET", 
            headers: { Authorization: `Bearer ${accessToken}` }
        })
    
        const spotifyProfile = await result.json()

        const spotifyUsername = spotifyProfile.display_name
        const spotifyId = spotifyProfile.id
        let spotifyProfilePicture = ""

        if(spotifyProfile.images.length === 0) {
            spotifyProfilePicture = "https://blendicons.s3.eu-central-1.amazonaws.com/files/C8i5xC1kkJ60hK6YC5sp.svg"
        } else {
            spotifyProfilePicture = spotifyProfile.images[0].url
        }

        localStorage.setItem("spotify_username", spotifyUsername)
        localStorage.setItem("spotify_id", spotifyId)
        localStorage.setItem("spotify_profilePicture", spotifyProfilePicture)

    
        return spotifyProfile
    } catch(error) {
        throw new Error(error.message)
    }
}