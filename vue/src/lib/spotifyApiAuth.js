import { dateAdd } from '../lib/utils'

function generateCodeVerifier(length) {
    let text = '';
    let possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for (let i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}

async function generateCodeChallenge(codeVerifier) {
    const data = new TextEncoder().encode(codeVerifier)
    const digest = await window.crypto.subtle.digest('SHA-256', data)

    return btoa(String.fromCharCode.apply(null, [...new Uint8Array(digest)]))
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '')
}

export async function redirectToAuthCodeFlow() {
    const clientId = import.meta.env.VITE_SPOTIFY_CLIENT_ID
    const redirectUri = `${import.meta.env.VITE_FRONTEND_URL}/callback`
    const scope = 'user-top-read user-read-playback-state user-modify-playback-state'

    const verifier = generateCodeVerifier(128)
    const challenge = await generateCodeChallenge(verifier)

    localStorage.setItem("verifier", verifier)

    const params = new URLSearchParams()
    params.append("client_id", clientId)
    params.append("response_type", "code")
    params.append("redirect_uri", redirectUri)
    params.append("scope", scope)
    params.append("code_challenge_method", "S256")
    params.append("code_challenge", challenge)

    document.location = `https://accounts.spotify.com/authorize?${params.toString()}`
}

export async function getAccessToken(clientId, code, redirectUri) {
    const verifier = localStorage.getItem("verifier")

    const params = new URLSearchParams()
    params.append("client_id", clientId)
    params.append("grant_type", "authorization_code")
    params.append("code", code)
    params.append("redirect_uri", redirectUri)
    params.append("code_verifier", verifier)

    const result = await fetch("https://accounts.spotify.com/api/token", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: params
    })

    localStorage.removeItem("verifier")

    const { access_token, expires_in, refresh_token } = await result.json()

    const expiryTimestamp = dateAdd(new Date(), "second", expires_in)

    localStorage.setItem("access_token", access_token)
    localStorage.setItem("refresh_token", refresh_token)
    localStorage.setItem("expires_in", expires_in)
    localStorage.setItem("access_token_expiry", expiryTimestamp)

    return {
        accessToken: access_token,
        refreshToken: refresh_token,
        accessTokenExpiry: expiryTimestamp
    }
}

export async function refreshAccessToken(clientId, refreshToken) {
    const params = new URLSearchParams()
    params.append("client_id", clientId)
    params.append("grant_type", "refresh_token")
    params.append("refresh_token", refreshToken)

    const result = await fetch("https://accounts.spotify.com/api/token", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: params
    })

    const { access_token, expires_in, refresh_token } = await result.json()

    const expiryTimestamp = dateAdd(new Date(), "second", expires_in)

    localStorage.setItem("access_token", access_token)
    localStorage.setItem("refresh_token", refresh_token)
    localStorage.setItem("expires_in", expires_in)
    localStorage.setItem("access_token_expiry", expiryTimestamp)
}