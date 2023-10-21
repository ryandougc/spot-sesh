import { io } from "socket.io-client";

import ErrorService from "./services/ErrorService.js"

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
})