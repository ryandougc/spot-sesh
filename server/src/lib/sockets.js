import { generateRandomString } from './utils.js'

let rooms = {} // Move this to cache

import { serverLogger as logger } from './logger.js'

export default function (io) {
    console.log(`Socket server is listening on port ${ process.env.SOCKET_PORT }`)

    io.on('connection', socket =>{
        let roomIdAsMember
        let roomIdAsHost
        let usersData

        socket.on('join-room', (roomId, user, cb) => {
            try {
                const room = rooms[roomId]

                if(room === undefined) {
                    return cb(false, null, "That room doesn't exist!")
                }

                if(room.members[user.spotifyId] || room.host.spotifyId === user.spotifyId) {
                    return cb(false, null, "You are already in that room!")
                }

                socket.join(room.id)
    
                addUserToRoomInMemory(room.id, user)

                socket.to(room.id).emit('user-joined-room', user)

                usersData = user
                roomIdAsMember = roomId

                return cb(true, room)
            } catch(error) {
                logger.log({ 
                    level: 'error',
                    type: error.name,
                    message: error.message,
                    stack: error.stack
                })


                cb(false, null, "")
            }
        })
    
        socket.on('create-room', (user, cb) => {
            try {
                let roomId = user.name  // let room = generateRandomString(6)

                while(rooms[roomId]) { // If a room exists with the user's Spotify username as the ID, generate a random ID for the new room
                    roomId = generateRandomString(6)
                }

                socket.join(roomId)
        
                rooms[roomId] = { // Add new room to memory
                    id: roomId,
                    host: user,
                    members: {}
                }

                usersData = user
                roomIdAsHost = roomId
        
                cb(true, rooms[roomId])
            } catch(error) {
                logger.log({ 
                    level: 'error',
                    type: error.name,
                    message: error.message,
                    stack: error.stack
                })

                cb(false, null, "")
            }

        })

        socket.on('start-session-request', (roomId, cb) => {
            const trackList = []

            try {
                // Compile all members' top5 songs
                for(const [id, user] of Object.entries(rooms[roomId].members)) {
                    trackList.push(...user.top5)
                }

                // Get hosts top5 songs
                trackList.push(...rooms[roomId].host.top5)
    
                cb(true, trackList)
            } catch(error) {
                logger.log({ 
                    level: 'error',
                    type: error.name,
                    message: error.message,
                    stack: error.stack
                })


                cb(false, null, "")
            }
        })

        socket.on('start-session', (roomId, cb) => {
            try {
                socket.to(roomId).emit('session-started')
    
                cb(true, null)
            } catch(error) {
                logger.log({ 
                    level: 'error',
                    type: error.name,
                    message: error.message,
                    stack: error.stack
                })


                cb(false, null, "")
            }

        })
    
        socket.on('leave-room', (roomId, user, cb) => {
            try {
                const room = rooms[roomId]

                if(!room || room === undefined) return cb(false, null, "The room you are trying to leave does not exist")

                if(room.host.spotifyId === user.spotifyId && Object.keys(room.members).length > 0) {
                    reassignHostToRandomMember(room) 

                    socket.to(room.id).emit('change-room-host', room.host)
                } else if(room.host.spotifyId === user.spotifyId) {
                    delete rooms[room.id]
                } else {
                    removeUserFromRoomInMemory(room, user.spotifyId)
                }

                socket.leave(room.id)

                socket.to(room.id).emit('user-left-room', {room, user})

                cb(true)
            } catch(error) {
                logger.log({ 
                    level: 'error',
                    type: error.name,
                    message: error.message,
                    stack: error.stack
                })


                cb(false, null, error.message)
            }
        })
    
        socket.on('disconnecting', () => {
            try {
                let room = rooms[roomIdAsHost]

                if(roomIdAsHost && Object.keys(room.members).length > 0) {
                    reassignHostToRandomMember(room)

                    socket.to(room.id).emit('change-room-host', room.host)
                    socket.to(room.id).emit('user-left-room', { room: room, user: usersData })

                    socket.leave(room.id)
                } else if(roomIdAsHost) {
                    delete rooms[room.id]
                } else if(roomIdAsMember) {
                    room = rooms[roomIdAsMember]

                    removeUserFromRoomInMemory(room, usersData.spotifyId)

                    socket.to(room.id).emit('user-left-room', { room: room, user: usersData })

                    socket.leave(room.id)
                }
            } catch(error) {
                logger.log({ 
                    level: 'error',
                    type: error.name,
                    message: error.message,
                    stack: error.stack
                })
            }
        })
    })
}

function removeUserFromRoomInMemory(room, spotifyId) {
    if(room.members[spotifyId]) delete room.members[spotifyId]
}

function addUserToRoomInMemory(roomId, user) {
    rooms[roomId].members[user.spotifyId] = user
}

function reassignHostToRandomMember(room) {
    const members = Object.keys(room.members)
    const randomMember = members[members.length * Math.random() << 0]

    const newHost = room.members[randomMember]

    room.host = newHost

    removeUserFromRoomInMemory(room, newHost.spotifyId)
}