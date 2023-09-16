import { io } from "socket.io-client";

import { useUserStore } from './stores/userStore.js'
import { useRoomStore } from './stores/roomStore.js'

export const socket = io(import.meta.env.VITE_SOCKET_URL)

socket.on("connect", () => {
  if (socket.recovered) {
    console.log("Session Recovered")
    // any event missed during the disconnection period will be received now
  } else {
    console.log("We lost the session")
    // new or unrecoverable session
    useUserStore().socketId = socket.id
  }
})

socket.on("disconnect", () => {
  console.log("User has disconnected")
})
socket.on('user-joined-room', user => {
    useRoomStore().roomEvents.push(`${user.name} has joined the room`)
    useRoomStore().currentMembers[user.socketId] = user
})
socket.on('change-room-host', host => {
    useRoomStore().host = host

    if(socket.id === host.socketId) {
      useRoomStore().roomEvents.push(`You are now the host`)
    } else {
      useRoomStore().roomEvents.push(`${host.name} is now the host`)
    }
})
socket.on('user-left-room', user => {
    useRoomStore().roomEvents.push(`${user.name} has left the room`)
    delete useRoomStore().currentMembers[user.socketId]
})

socket.on('session-started', _ => {
    useRoomStore().roomEvents.push('Listening session has started')
})