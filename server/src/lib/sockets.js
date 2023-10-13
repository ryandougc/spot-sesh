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
                    return cb(false, null, "That room doesn't exist!")
                }

                if(rooms[room].members[user.spotifyId] || rooms[room].host.spotifyId === user.spotifyId) {
                    return cb(false, null, "You are already in that room!")
                }

                socket.join(room)
    
                addUserToRoomInMemory(room, user)

                socket.to(room).emit('user-joined-room', user)

                return cb(true, rooms[room])
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
                // let room = generateRandomString(6)
                let room = user.name

                while(rooms[room]) { // If a room exists with the user's Spotify username as the ID, generate a random ID for the new room
                    room = generateRandomString(6)
                    // room = user.name
                }

                socket.join(room)
        
                rooms[room] = { // Add new room to memory
                    id: room,
                    host: user,
                    members: {}
                }
        
                cb(true, rooms[room])
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
    
        socket.on('leave-room', (room, user, cb) => {
            try {
                if(!rooms[room]) cb(false, null, "The room you are trying to leave does not exist")
    
                // const user = rooms[room].members[user.spotifyId]
    
                removeUserFromRoomInMemory(room, user.spotifyId)
        
                socket.leave(room)

                socket.to(room).emit('user-left-room', user)

                if(rooms[room].host.spotifyId === user.spotifyId) {
                    console.log("Host Left!")
                    reassignHostToRandomMember(room, socket) 
                }
    
                // if(Object.keys(rooms[room].members).length <= 0) {
                //     // If no members are left in the room, delete the room.
                //     delete rooms[room]
                // } else {
                //     // If there are members left in the room, perform the logic for user leaving
                //     socket.to(room).emit('user-left-room', user)
            
                //     reassignHostToRandomMember(room, socket) 
                // }
        
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
                console.log("Disconnected")

                socket.rooms.forEach(room => {
                    if(rooms[room]) {
                        // loop over members to find the user that just left and remove them from the room
                        for(let m in rooms[room].members) {
                            if(m.socketId === socket.id) {
                                console.log(m)
                            }
                        }




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

function removeUserFromRoomInMemory(room, id) {
    delete rooms[room].members[id]
    if(rooms[room].members <= 0) delete rooms[room]
}

function addUserToRoomInMemory(room, user) {
    rooms[room].members[user.spotifyId] = user
}

function reassignHostToRandomMember(room, socket) {
        const members = Object.keys(rooms[room].members)

        if(members.length >= 0) {
            const newHost = rooms[room].members[members[ members.length * Math.random() << 0]]

            rooms[room].host = newHost
    
            socket.to(room).emit('change-room-host', newHost)
        }
}