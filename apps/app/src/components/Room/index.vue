<template>
  <div class="room">
    <template v-if="getCurrentRoom">
      <div class="room__sidebar">
        <h1 class="room__sidebar__title">
          {{ getCurrentRoom.name }}
        </h1>
        <div class="room__sidebar__players">
          <h2 class="room__sidebar__players__title">
            Players
          </h2>
          <ul>
            <li
              v-for="player in getCurrentRoom.players"
              :key="player.id"
              class="room__sidebar__players__item"
            >
              {{ player.name }}
            </li>
          </ul>
        </div>
      </div>
      <div class="room__content">
        <img
          class="room__content__logo"
          src="@/assets/img/logo.png"
          alt="Bombparty Clone"
        >

        <RoomGame />
      </div>
    </template>
    <template v-else>
      Loading...
    </template>
  </div>
</template>

<script>
  import store from '@/store'
  import axios from 'axios'
  import { mapGetters } from 'vuex'

  import env from '@/env.json'
  import RoomGame from './_subs/RoomGame'

  /**
   * @module component - room
   */
  export default {
    name: 'room',
    components: {
      RoomGame
    },
    beforeRouteEnter (to, from, next) {
      const username = store.getters.getUsername
      if (!username) {
        next({
          name: 'Home'
        })

        return false
      }

      axios.get(`${env['api-endpoint']}/rooms/${to.params.id}`)
        .then(response => {
          if (response.status === 200) {
            store.commit('SET_ROOM', response.data)
            next()
          }
        })
        .catch(() => {
          next({
            name: 'Rooms'
          })
        })
    },
    computed: {
      ...mapGetters(['getCurrentRoom'])
    },
    mounted () {
      this.$socket.on('joined_room', (room) => {
        this.$store.commit('SET_ROOM', room)
      })
      this.$socket.on('player_joined_room', (room) => {
        console.log('PLAYER JOINED?')
        this.$store.commit('SET_ROOM', room)
      })
      this.$socket.on('room_next_player', ({ state, activePlayers, currentPlayer, word_to_guess }) => {
        console.log('ROOM NEXT PLAYER?')
        const room = this.$store.getters.getCurrentRoom
        this.$store.commit('SET_ROOM', {
          ...room,
          state,
          word_to_guess,
          activePlayers,
          currentPlayer
        })
      })
      this.$socket.on('player_lost_heart', ({ activePlayers }) => {
        const room = this.$store.getters.getCurrentRoom
        this.$store.commit('SET_ROOM', {
          ...room,
          activePlayers,
        })
      })
      this.$socket.on('room_started', ({ state, word_to_guess, activePlayers, currentPlayer }) => {
        const room = this.$store.getters.getCurrentRoom
        this.$store.commit('SET_ROOM', {
          ...room,
          state,
          word_to_guess,
          activePlayers,
          currentPlayer
        })
        console.log('ROOM STARTED...')
      })
      this.$socket.on('room_game_finished', ({ state, activePlayers }) => {
        const room = this.$store.getters.getCurrentRoom
        this.$store.commit('SET_ROOM', {
          ...room,
          state,
          activePlayers,
        })
        console.log('ROOM FINISHED...')
      })
      this.$socket.on('room_player_left', ({ state, players, activePlayers }) => {
        const room = this.$store.getters.getCurrentRoom
        this.$store.commit('SET_ROOM', {
          ...room,
          state,
          players,
          activePlayers,
        })
        console.log('ROOM PLAYER LEFT...')
      })
      this.$socket.on('room_reset', ({ state, activePlayers, currentPlayer, timer }) => {
        const room = this.$store.getters.getCurrentRoom
        this.$store.commit('SET_ROOM', {
          ...room,
          state,
          currentPlayer,
          activePlayers,
          timer,
        })
        console.log('ROOM RESET...')
      })
      this.$socket.on('room_type_guess_word', ({ state, currentPlayer }) => {
        const room = this.$store.getters.getCurrentRoom
        this.$store.commit('SET_ROOM', {
          ...room,
          state,
          currentPlayer,
        })
      })
      this.$socket.on('room_joined_game', ({ state, activePlayers }) => {
        const room = this.$store.getters.getCurrentRoom
        this.$store.commit('SET_ROOM', {
          ...room,
          state,
          activePlayers,
        })
      })
    },
    beforeRouteLeave (to, from, next) {
      this.$socket.emit('room_left', {
        id: this.getCurrentRoom.id,
      })

      next()
    }
  }
</script>

<style lang="css" scoped>
  .room {
    display: flex;
  }

  .room__sidebar {
    width: 340px;
    height: 100vh;
    background-color: #242C3B;
    padding: 20px;
  }

  .room__sidebar__title,
  .room__sidebar__players__title {
    color: white;
    font-weight: 400;
  }

  .room__sidebar__title {
    font-size: 1.5rem;
  }

  .room__sidebar__players ul {
    list-style: none;
    margin: 0;
    padding: 0;
  }

  .room__sidebar__players__title {
    font-size: 1.1rem;
  }

  .room__sidebar__players__item {
    color: rgba(255, 255, 255, 0.7);
    font-size: 1rem;
    margin-bottom: 8px;
    margin-left: 16px;
  }

  .room__content {
    display: flex;
    flex-direction: column;
    flex: 1;
  }

  .room__content__logo {
    margin: 0 auto 64px auto;
  }
</style>