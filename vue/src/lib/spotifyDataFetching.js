export async function getSpotifyTop5Tracks(accessToken) {
    const results = await fetch("https://api.spotify.com/v1/me/top/tracks?time_range=short_term&limit=5&offset=0", {
        method: "GET",
        headers: { "Authorization": `Bearer ${accessToken}` }
    })

    const data = await results.json()

    const top5Tracks = data.items

    console.log(top5Tracks)

    return top5Tracks
}