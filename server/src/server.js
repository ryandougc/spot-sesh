import 'dotenv/config.js'

// Express server
import express from 'express'

const app = express()

const EXPRESS_PORT = process.env.EXPRESS_PORT || 8080
app.use(express.static('public'))

app.get("*", (req, res, next) => {
    res.sendFile('index.html', { root: '/home/ryan/Documents/Web Dev/spotify-sesh/server/public' })
})

app.get("/*", (req, res, next) => {
    res.sendFile('index.html', { root: '/home/ryan/Documents/Web Dev/spotify-sesh/server/public' })
})

app.listen(EXPRESS_PORT, (err) => {
    if (err) return console.log(err)

    return console.log(`Server is listening on port ${EXPRESS_PORT}`)
})

// Socket.io Server
import { Server } from 'socket.io'
import initSockets from './lib/sockets.js'

const SOCKET_PORT = process.env.SOCKET_PORT || 8081

const io = new Server(SOCKET_PORT, {
    cors: {
        origin: [/*'https://admin.socket.io',*/ process.env.FRONT_END_URL],
        credentials: true
    }
})

initSockets(io)

// // Socket.io admin server
// import { instrument as initSocketIoAdminDashboard } from '@socket.io/admin-ui'
// initSocketIoAdminDashboard(io, { auth: false })