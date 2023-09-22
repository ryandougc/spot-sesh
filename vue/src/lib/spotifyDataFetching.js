export async function getSpotifyTop5Tracks(accessToken) {
    try {
        const results = await fetch("https://api.spotify.com/v1/me/top/tracks?time_range=short_term&limit=5&offset=0", {
            method: "GET",
            headers: { "Authorization": `Bearer ${accessToken}` }
        })

        const data = await results.json()

        const top5Tracks = data.items

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
        console.log(spotifyProfile)

        const spotifyUsername = spotifyProfile.display_name
        const spotifyId = spotifyProfile.id
        const spotifyProfilePicture = spotifyProfile.images[0].url

        localStorage.setItem("spotify_username", spotifyUsername)
        localStorage.setItem("spotify_id", spotifyId)
        localStorage.setItem("spotify_profilePicture", spotifyProfilePicture)

    
        return spotifyProfile
    } catch(error) {
        throw new Error(error.message)
    }
}