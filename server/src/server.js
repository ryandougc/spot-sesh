import 'dotenv/config.js'

// Express Server
import App from './lib/app.js'

const EXPRESS_PORT = process.env.EXPRESS_PORT || 3000
const app = new App().express

app.listen(EXPRESS_PORT, (error) => {
    if(error) return console.log(error)

    return console.log(`Express server is listening on port ${ EXPRESS_PORT }`)
})

// Socket.io Server
import { Server } from 'socket.io'
import { instrument as initSocketIoAdminDashboard } from '@socket.io/admin-ui'
import initSockets from './lib/sockets.js'

const SOCKET_PORT = process.env.SOCKET_PORT || 3001

const io = new Server(SOCKET_PORT, {
    cors: {
        origin: ['https://admin.socket.io', process.env.FRONT_END_URL],
        credentials: true
    }
})

initSockets(io)
initSocketIoAdminDashboard(io, { auth: false })