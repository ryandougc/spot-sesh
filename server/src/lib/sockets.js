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

                if(!room) cb(false, null, "The room you are trying to leave does not exist")

                if(room.host.spotifyId === user.spotifyId && Object.keys(room.members).length > 0) {
                    reassignHostToRandomMember(room) 

                    console.log("Host Left!")

                    socket.to(room.id).emit('change-room-host', room.host)
                } else if(room.host.spotifyId === user.spotifyId) {
                    delete rooms[room.id]

                    console.log("No members left in room, room deleted")
                } else {
                    removeUserFromRoomInMemory(room, user.spotifyId)

                    console.log("User Left Room")
                }

                socket.leave(room.id)

                socket.to(room.id).emit('user-left-room', {room, user})

                console.log(rooms)

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
    
        socket.on('disconnecting', (a) => {
            console.log("User Disconnected")
            // try {
            //     console.log("Disconnected")

            //     socket.rooms.forEach(room => {
            //         if(rooms[room]) {
            //             // loop over members to find the user that just left and remove them from the room
            //             for(let m in rooms[room].members) {
            //                 if(m.socketId === socket.id) {
            //                     console.log(m)
            //                 }
            //             }




            //             const usersName = rooms[room].members[socket.id].name
        
            //             removeUserFromRoomInMemory(room, socket.id)

            //             socket.leave(room)
        
            //             if(Object.keys(rooms[room].members).length <= 0) {
            //                 delete rooms[room]
            //             } else {
            //                 socket.to(room).emit('user-left-room', { name: usersName, socketId: socket.id })
        
            //                 reassignHostToRandomMember(room, socket)
            //             }
            //         }
            //     })
            // } catch(error) {
            //     logger.log({ 
            //         level: 'error',
            //         type: error.name,
            //         message: error.message,
            //         stack: error.stack
            //     })

            // }
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