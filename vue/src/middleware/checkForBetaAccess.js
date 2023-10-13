import axios from 'axios'

export default async (accessToken) => {
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

        return true
    } catch(error) {
        if(error.response.status === 403 || error.response.status === 401) {
            console.log("User doesn't have access to the app!")

            return false
        }
    }
}