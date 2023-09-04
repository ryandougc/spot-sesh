# Spot Sesh

Like russian roulette but for your top 5 most listened to songs. 

Create a session for your friends to join, or join your friends' session. When everyone has joined, start playing the music. The web app will take everyones top 5 most listened to songs, shuffle them, and start playing them on the hosts device.

# Installation

For development:
- Setup a Spotify Web App. Instructions can be found [here](https://developer.spotify.com/documentation/web-api/tutorials/getting-started) in the Spotify API Docs.
- Open two terminals, navigating into the `/vue/` and `/server/` directories
- In both directories, run the command `npm install`
- In both directories, copy the `sample.env` files and fill in the environment variables. Details Below.
- In both directories, run the apps with the command `npm run dev`

### Environment Variables
`server`
	- NODE_ENV: just keep this as 'development' unless this is getting hosted
	- EXPRESS_PORT: This port needs to match `VITE_FRONTEND_PORT` in Vue's `.env` file. This is the port the front-end SPA will be hosted on.
	- SOCKET_PORT: default value is 3001. This port needs to match `VITE_SOCKET_PORT` in Vue's `.env` file
	- FRONT_END_URL: This URL is where your Vue app is hosted. You must include the port if it is on the localhost
`vue`
	- NODE_ENV: just keep this as `development` unless this is getting hosted, then switch to `production`
	- VITE_SOCKET_URL: This port needs to match of where the socket server is running, and `SOCKET_PORT` in the server's `.env` file
	- VITE_FRONTEND_URL: This port is the URL and port of where your front-end app will be running
	- VITE_SPOTIFY_CLIENT_ID: This needs to be the 'Client Id' in your Spotify app dashboard settings