import { generateRandomString } from './utils.js'

let rooms = {} // Move this to cache

export default function (io) {
    console.log(`Socket server is listening on port ${ process.env.SOCKET_PORT }`)

    io.on('connection', socket =>{
        socket.on('join-room', (room, user, cb) => {
            if(rooms[room] === undefined) {
                cb(false)
            } else { 
                socket.join(room)
    
                addUserToRoomInMemory(room, user)
                socket.to(room).emit('user-joined-room', user)

                cb(true, rooms[room])
            }
        })
    
        socket.on('create-room', (user, cb) => {
            // const room = generateRandomString(6)
            const room = user.name
            while(rooms[room]) {
                // room = generateRandomString(6)
                room = user.name
            }
    
            socket.join(room)
    
            // Add room and user to memory
            rooms[room] = {
                id: room,
                host: user.socketId,
                members: {}
            }

            addUserToRoomInMemory(room, user)
    
            cb(true, rooms[room])
        })

        socket.on('start-session-request', (roomId, cb) => {
            // Compile all top5 songs
            const trackList = []

            for(const [socketId, user] of Object.entries(rooms[roomId].members)) {
                trackList.push(...user.top5)
            }

            // Send all songs to the hosts front-end
            cb(true, trackList)
        })

        socket.on('start-session', (roomId, cb) => {
            console.log(`Session was started in room ${roomId}`)

            socket.to(roomId).emit('session-started')

            cb()
        })
    
        socket.on('leave-room', (room, cb) => {
            if(!rooms[room]) cb(false)
    
            const user = rooms[room].members[socket.id]
    
            socket.leave(room)

            socket.to(room).emit('user-left-room', user)
    
            removeUserFromRoomInMemory(room, socket.id)
    
            reassignHostToRandomMember(room, socket) 

            console.dir(rooms[room], {depth: null})
    
            cb(true)
        })
    
        socket.on('disconnecting', () => {
            socket.rooms.forEach(room => {
                if(rooms[room]) {
                    const usersName = rooms[room].members[socket.id].name
    
                    socket.leave(room)
    
                    removeUserFromRoomInMemory(room, socket.id)
    
                    socket.to(room).emit('user-left-room', { name: usersName, socketId: socket.id })
    
                    reassignHostToRandomMember(room, socket)
                }
            })
        })
    })
}

function removeUserFromRoomInMemory(room, socketId) {
    delete rooms[room].members[socketId]
    if(rooms[room].members <= 0) delete rooms[room]
}

function addUserToRoomInMemory(room, user) {
    rooms[room].members[user.socketId] = user
}

function reassignHostToRandomMember(room, socket) {
    if(rooms[room].host === socket.id && Object.keys(rooms[room].members).length >= 1) {
        const members = Object.keys(rooms[room].members)
        const newHost = rooms[room].members[members[ members.length * Math.random() << 0]]

        rooms[room].host = newHost.socketId

        socket.to(room).emit('change-room-host', newHost)
    }
}