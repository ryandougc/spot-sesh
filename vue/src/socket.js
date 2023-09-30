import { io } from "socket.io-client";

import { useUserStore } from './stores/userStore.js'
import { useRoomStore } from './stores/roomStore.js'

export const socket = io(import.meta.env.VITE_SOCKET_URL)

// socket.on("connect", () => {
//   if (socket.recovered) {
//     console.log("Session Recovered")
//     // any event missed during the disconnection period will be received now
//   } else {
//     console.log("We lost the session")
//     // new or unrecoverable session
//     useUserStore().socketId = socket.id
//   }
// })

// socket.on("disconnect", () => {
//   console.log("User has disconnected")
// })

socket.on('user-joined-room', user => {
  try {
    useRoomStore().roomEvents.push(`${user.name} has joined the room`)
    useRoomStore().currentMembers[user.socketId] = user
  } catch(error) {
    console.log("There was an error when updating the page to show a new user was added to the room")
    throw new Error(error)
  }
})

socket.on('change-room-host', host => {
  try {
    useRoomStore().host = host

    if(socket.id === host.socketId) {
      useRoomStore().roomEvents.push(`You are now the host`)
    } else {
      useRoomStore().roomEvents.push(`${host.name} is now the host`)
    }
  } catch(error) {
    console.log("There was an error when updating the room host")
    throw new Error(error)
  }
})

socket.on('user-left-room', user => {
  try {
      delete useRoomStore().currentMembers[user.socketId]
      useRoomStore().roomEvents.push(`${user.name} has left the room`)
  } catch(error) {
    console.log("There was an error when deleting the user that left the room")
    throw new Error(error)
  }
})

socket.on('session-started', _ => {
  try {
    useRoomStore().sessionActive = true
    useRoomStore().roomEvents.push('Listening session has started')
  } catch(error) {
    console.log("There was an error when updating the page to show the session has started")
    throw new Error(error)
  }
})