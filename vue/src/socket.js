import { io } from "socket.io-client";

import { useUserStore } from './stores/userStore.js'
import { useRoomStore } from './stores/roomStore.js'

export const socket = io(`http://localhost:${import.meta.env.VITE_SOCKET_PORT}`)

socket.on("connect", () => {
  useUserStore().socketId = socket.id
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