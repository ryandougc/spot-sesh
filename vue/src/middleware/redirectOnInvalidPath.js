// check for the path "/user/*" and redirect back to the homepage if this path is found
import ErrorService from '../services/ErrorService.js'

export default async (to) => {
    try {
        const regex = /\/room\/[A-Za-z0-9]+/i

        if(to.path.match(regex) && (to.query.clk !== "F" || to.query.clk === undefined)) {
            return { name: Home }
        }
    } catch(error) {
        ErrorService.onError(error)
    }
}