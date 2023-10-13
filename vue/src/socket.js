import { io } from "socket.io-client";

import { useUserStore } from './stores/userStore.js'
import { useRoomStore } from './stores/roomStore.js'
import ErrorService from "./services/ErrorService.js";

const timeout = {
  socketTimeout: null
}

export const socket = io(import.meta.env.VITE_SOCKET_URL, {
  reconnectionAttempts: 5
})

socket.io.on("error", error => {
  // Log an error every time connection to the socket.io instance fails
  // Only send an error report to the server if all 5 retries fail.
  error.message = "Cannot connect to the socket.io server."

  console.log(`${error.message} Retrying 5 times total.`)

  clearTimeout(timeout.socketTimeout)

  timeout.socketTimeout = setTimeout(() => {
    ErrorService.onError(error)
  }, "10000")
})

socket.on("connect", () => {
  clearTimeout(timeout.socketTimeout)
  delete timeout.socketTimeout

  console.log("Connected to socket.io")

  if (socket.recovered) {
    console.log("Session Recovered")
    // any event missed during the disconnection period will be received now
  } else {
    // new or unrecoverable session
  }
});

// socket.on("disconnect", () => {
//   console.log("User has disconnected")
// })

socket.on('user-joined-room', user => {
  try {
    useRoomStore().roomEvents.push(`${user.name} has joined the room`)
    useRoomStore().currentMembers[user.spotifyId] = user
  } catch(error) {
    console.log("There was an error when updating the page to show a new user was added to the room")
    ErrorService.onError(error)
  }
})

socket.on('change-room-host', host => {
  try {
    useRoomStore().host = host

    if(useUserStore().spotifyId === host.spotifyId) {
      useRoomStore().roomEvents.push(`You are now the host`)
      delete useRoomStore().removeMember(host.spotifyId)
    } else {
      useRoomStore().roomEvents.push(`${host.name} is now the host`)
    }
  } catch(error) {
    console.log("There was an error when updating the room host")
    ErrorService.onError(error)
  }
})

socket.on('user-left-room', user => {
  try {
      delete useRoomStore().currentMembers[user.spotifyId]
      useRoomStore().roomEvents.push(`${user.name} has left the room`)
  } catch(error) {
    console.log("There was an error when deleting the user that left the room")
    ErrorService.onError(error)
  }
})

socket.on('session-started', _ => {
  try {
    useRoomStore().sessionActive = true
    useRoomStore().roomEvents.push('Listening session has started')
  } catch(error) {
    console.log("There was an error when updating the page to show the session has started")
    ErrorService.onError(error)
  }
})