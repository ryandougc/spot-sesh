import 'dotenv/config.js'

// Express server
import express from 'express'
import cors from 'cors'
import bodyParser from 'body-parser'
import { URL } from 'url'

import { frontendLogger as logger } from './lib/logger.js'

const app = express()

const EXPRESS_PORT = process.env.EXPRESS_PORT || 8080

app.use(cors({
    origin: ['http://localhost:5173', 'http://localhost:3001'],
    
}))
app.use(express.static('public'))
app.use(bodyParser.json({ type: 'application/json' }))

app.post('/logs', (req, res, next) => {
    const error = req.body.error

    logger.log({ 
        level: 'error',
        type: error.type,
        message: error.message,
        stack: error.stack
    })
})

// app.get("*", (req, res, next) => {
//     res.sendFile('index.html', { root: new URL('../public', import.meta.url).pathname })
// })

// app.get("/*", (req, res, next) => {
//     res.sendFile('index.html', { root: new URL('../public', import.meta.url).pathname })
// })

app.listen(EXPRESS_PORT, (err) => {
    if(err) return console.log(err)

    return console.log(`Server is listening on port ${EXPRESS_PORT}`)
})

// Socket.io Server
import { Server } from 'socket.io'
import initSockets from './lib/sockets.js'

const SOCKET_PORT = process.env.SOCKET_PORT || 8081

const io = new Server(SOCKET_PORT, {
    connectionStateRecovery: {
        maxDisconnectionDuration: 2 * 60 * 1000,
        skipMiddlewares: true
    },
    cors: {
        origin: [/*'https://admin.socket.io',*/ process.env.FRONT_END_URL],
        credentials: true
    }
})

initSockets(io)

// // Socket.io admin server
// import { instrument as initSocketIoAdminDashboard } from '@socket.io/admin-ui'
// initSocketIoAdminDashboard(io, { auth: false })