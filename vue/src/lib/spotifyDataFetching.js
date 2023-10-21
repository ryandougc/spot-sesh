import axios from 'axios'
import ErrorService from '../services/ErrorService'

export async function getSpotifyTop5Tracks(accessToken) {
    try {
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
        return ErrorService.onError(error)
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
        return ErrorService.onError(error)
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
        return ErrorService.onError(error)
    }
}