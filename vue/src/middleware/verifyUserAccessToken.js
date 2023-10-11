// Check if user has a token or not. If the user needs to be refreshed, refresh the token now
import { useAuthStore } from '../stores/authStore.js'

import ErrorService from '../services/ErrorService.js'

export default async () => {
    try {
        // Check if the user already exists
        const { tokenExists, tokenIsValid } = await useAuthStore().tokenIsValid

        if(!tokenExists && !tokenIsValid) {
            // User needs to log in
            console.log("User is logged out")
        } else {
            if(tokenExists && !tokenIsValid) {
                // Users token needs to be refreshed
                console.log("token needs to be refreshed")
                await await useAuthStore().refreshToken()
            } else {
                // Users token is valid
                console.log("User is valid")
            }
        }
    } catch(error) {
        ErrorService.onError(error)
    }
}