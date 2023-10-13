<template>
  <div id="lobby">
    <HeaderLogin />
  
    <h3 class="greeting">Hi {{ $userStore.properName }}!</h3>

    <div class="lobby-content">
        <div class="lobby-content__create-session">
            <p class="lobby-content__create-session__text">Ready to start listening?</p>
            <button 
              class="lobby-content__create-session__create-session-button button-large"
              @click="createRoom"
            >
                Start Session
            </button>
        </div>

        <hr class="lobby-content__page-break">

        <div class="lobby-content__join-session">
            <div class="lobby-content__join-session__text">
                <p class="lobby-content__join-session__text__title">Join a friend's session</p>
                <p class="lobby-content__join-session__text__description">Input a room code below to join a session</p>
            </div>

            <input 
                type="text" 
                name="recipient" 
                class="lobby-content__join-session__session-id-input"
                v-model="sessionToJoin"
            >
            <button class="lobby-content__join-session__join-session-button button-large" @click="joinRoom">Join Session</button>
            <p v-show="failedToJoinRoom.status" class="lobby-content__join-session__error-message">{{ failedToJoinRoom.message }}</p>
        </div>
    </div>

    <Footer class="footer" />
  </div>
</template>

<script>
import { socket } from '@/socket'

import HeaderLogin from './HeaderLogin.vue'
import Footer from './Footer.vue'

export default {
  components: {
    HeaderLogin,
    Footer
  },
  data() {
    return {
      sessionToJoin: "",
      failedToJoinRoom: {
        status: false,
        message: ""
      }
    }
  },
  computed: {
    user() {
      return this.$userStore.userObject
    }
  },
  methods: {
    joinRoom() {
      socket.emit('join-room', this.sessionToJoin, this.user, (success, room, message) => {
        if(success) {
            // Move the user into the room they just created
            this.$router.push(`/room/${room.id}?clk=F`)

            console.log(room)

            this.$roomStore.roomEvents.push("You joined")
            this.$roomStore.id = room.id
            this.$roomStore.currentMembers = room.members
            this.$roomStore.host = room.host
        } else {
            this.sessionToJoin = ""
            this.failedToJoinRoom.status = true
            this.failedToJoinRoom.message = message
        }
      })
    },
    createRoom() {
      socket.emit('create-room', this.user, (success, room, message) => {
        if(success) {
            console.log(room)
            // Move the user into the room they just created
            this.$router.push(`/room/${room.id}?clk=F`)

            this.$roomStore.roomEvents.push("You created this room")
            this.$roomStore.id = room.id
            // this.$roomStore.currentMembers[this.user.spotifyId] = this.user
            this.$roomStore.host = this.user
        }
      })
    }
  },
  async mounted() {
      await this.$userStore.getTop5Tracks(this.$authStore.accessToken)
  }
}
</script>

<style lang="scss" scoped>
#lobby {
    height: 100vh;

    display: flex;
    flex-direction: column;
    align-items: center;

    position: relative;
}
.greeting {
    margin-top: 65px;

    color: $c-off-white;
    font-size: 18px;
    font-style: normal;
    font-weight: 700;
    line-height: normal;
}

.lobby-content {
    display: flex;
    flex-direction: column;

    &__create-session, &__join-session {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 15px;
    }

    &__create-session {
        margin-top: 12vh;
        
        &__text {
            margin-bottom: 20px;

            font-size: 20px;
            font-weight: 600;
            text-align: center;
        }

        &__create-session-button {
            background-color: $c-spotify-green;

            transition: 150ms;

            &:hover {
                background-color: $c-dark-green;

                transition: 150ms;
            }
        }
    }

    &__page-break {
        width: 200px;
        height: 1px;

        margin: 60px auto 60px auto;

        // display: none;

        background-color: $c-secondary-gray;

        border: none;
    }

    &__join-session {
        width: 100%;

        // margin-top: 7vh;

        &__text {
            width: 100%;

            padding: 12px;

            text-align: center;

            &__title {
                font-size: 20px;
                font-weight: 600;
                line-height: normal;
            }
            &__description {
                margin-top: 8px;

                color: $c-secondary-gray;
                font-size: 15px;
                font-weight: 600;
                line-height: normal;
            }

        }
        
        &__session-id-input {
            width: 100%;
            height: 40px;

            padding: 0px 20px;

            background-color: $c-secondary-gray;

            border-radius: 50px;
            border-style: none;

            color: $c-white;
            font-size: 14px;

            &:focus {
                font-size: 14px;
            }
        }

        &__join-session-button {

            background-color: $c-off-white;

            color: $c-black;

            transition: 150ms;
            
            &:hover {
                background-color: $c-light-gray;
                transition: 150ms;
            }
        }

        &__error-message {


            color: $c-red;
        }
    }

    .footer {
        // position: absolute;
        // bottom: 0;
    }

    @media (min-height: 750px) {
        &__create-session {
            margin-top: 15vh;
        }

        &__join-session {
            // margin-top: 12vh;
        }

        &__page-break {
            margin: 100px auto 100px auto;
        }
    }
}

@media (min-width: 315px) {
    .lobby-content {
        &__create-session {
            &__text {
                text-align: left;
            }
        }
    }
}

@media (min-width: 900px) {
    .greeting {
        margin-top: 100px;

        text-align: center;
    } 
    .lobby-content {
        margin-top:150px;

        flex-direction: row;
        align-items: center;
        justify-content: center;
        gap: 140px;

        &__create-session {
            margin-top: 0px;
        }

        &__page-break {
            width: 1px;
            height: 245px;

            margin: 0;
        }

        &__join-session {
            width: initial;

            position: relative;

            margin-top: 0;

            padding: 0px;

            &__join-session-button { 
                display: initial;
            }
        } 
    }
}
</style>
