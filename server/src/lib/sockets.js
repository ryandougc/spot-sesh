import { generateRandomString } from './utils.js'

let rooms = {} // Move this to cache

import { serverLogger as logger } from './logger.js'

export default function (io) {
    console.log(`Socket server is listening on port ${ process.env.SOCKET_PORT }`)

    io.on('connection', socket =>{
        // Each event should have a "cb" function to handle both success and errors
        // cb(success, data, message?) {

        // }

        // if (socket.recovered) {
        //     console.log("Big Recovery")
        //     // recovery was successful: socket.id, socket.rooms and socket.data were restored
        // } else {
        //     console.log("We lost em")
        //     // new or unrecoverable session
        // }

        socket.on('join-room', (room, user, cb) => {
            try {
                if(rooms[room] === undefined) {
                    cb(false)
                } else {
                    socket.join(room)
        
                    addUserToRoomInMemory(room, user)
                    socket.to(room).emit('user-joined-room', user)
    
                    cb(true, rooms[room])
                }
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
    
        socket.on('create-room', (user, cb) => {
            try {
                // let room = generateRandomString(6)
                let room = user.name

                while(rooms[room]) {
                    room = generateRandomString(6)
                    // room = user.name
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

        socket.on('start-session-request', (roomId, cb) => {
            const trackList = []
            
            try {
                // Compile all members' top5 songs
                for(const [socketId, user] of Object.entries(rooms[roomId].members)) {
                    trackList.push(...user.top5)
                }
    
                cb(true, trackList)
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


                cb(false, null, error.message)
            }

        })
    
        socket.on('leave-room', (room, cb) => {
            try {
                if(!rooms[room]) cb(false, null, "The room you are trying to leave does not exist")
    
                const user = rooms[room].members[socket.id]
    
                removeUserFromRoomInMemory(room, socket.id)
        
                socket.leave(room)
    
                if(Object.keys(rooms[room].members).length <= 0) {
                    // If no members are left in the room, delete the room.
                    delete rooms[room]
                } else {
                    // If there are members left in the room, perform the logic for user leaving
                    socket.to(room).emit('user-left-room', user)
            
                    reassignHostToRandomMember(room, socket) 
                }
        
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
                socket.rooms.forEach(room => {
                    if(rooms[room]) {
                        const usersName = rooms[room].members[socket.id].name
        
                        removeUserFromRoomInMemory(room, socket.id)

                        socket.leave(room)
        
                        if(Object.keys(rooms[room].members).length <= 0) {
                            delete rooms[room]
                        } else {
                            socket.to(room).emit('user-left-room', { name: usersName, socketId: socket.id })
        
                            reassignHostToRandomMember(room, socket)
                        }
                    }
                })
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