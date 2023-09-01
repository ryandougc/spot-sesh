export function generateRandomString(length) {
    if(length <= 0) throw new Error('generateRandomString() must be passed a 1 or higher')

    let string = ""
    let chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890"

    for (let i = 0; i < length; i++) {
        string += chars[Math.floor(Math.random() * chars.length)]
    }

    return string
}