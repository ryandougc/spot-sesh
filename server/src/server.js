import 'dotenv/config.js'

// Socket.io Server
import { Server } from 'socket.io'
import initSockets from './lib/sockets.js'

const SOCKET_PORT = process.env.SOCKET_PORT || 3001

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