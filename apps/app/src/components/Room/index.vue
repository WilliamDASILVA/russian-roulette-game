<template>
  <div class="room">
    <template
      v-if="getCurrentRoom"
    >
      <h1>
        Room ({{ getCurrentRoom.name }})
      </h1>

      Player in the room:
      <ul>
        <li
          v-for="player in getCurrentRoom.players"
          :key="player.id"
        >
          {{ player.name }}
        </li>
      </ul>

      <template
        v-if="getCurrentRoom.state === 'started'"
      >
        Player in the game:
        <ul>
          <li
            v-for="player in getCurrentRoom.activePlayers"
            :key="player.id"
          >
            {{ player.name }} - Heart: {{ player.heart }}
            <span
              v-if="player.id === getCurrentRoom.currentPlayer.id && typingWord"
            >
              {{ typingWord }}
            </span>
          </li>
        </ul>
      </template>
      

      <template
        v-if="getCurrentRoom.state === 'created'"
      >
        <button
          v-if="!hasJoinedGame"
          type="button"
          @click="joinGame"
        >
          Join game
        </button>
      </template>

      <template
        v-if="getCurrentRoom.state === 'starting'"
      >
        Waiting players...
        Timer: {{ waitingTimer }}
      </template>

      <template
        v-if="getCurrentRoom.state === 'started'"
      >
        <template
          v-if="isPlaying"
        >
          Find a word with "{{ getCurrentRoom.word_to_guess }}"
          <form
            @submit.prevent="guessWord"
          >
            <label for="word">
              Word:
            </label>
            <input
              v-model="guessingWord"
              type="text" name="word" id="word"
              @input="typeWord"
            >
          </form>
          
          Letters to use:
          <ul>
            <li
              v-for="letter in getCurrentRoom.currentPlayer.lettersToUse"
              :key="letter"
            >
              {{ letter }}
            </li>
          </ul>
        </template>
      </template>

      <template
        v-if="getCurrentRoom.state === 'finished'"
      >
        The winner is: {{ winner.name }}
      </template>
    </template>
    <template
      v-else
    >
      Loading...
    </template>
    {{ $socket.id }}
  </div>
</template>

<script>
  import Vue from 'vue'
  import { mapGetters } from 'vuex'

  /**
   * @module component - room
   */
  export default {
    name: 'room',
    beforeRouteEnter (to, from, next) {
      Vue.socket.emit('room_join', {
        id: to.params.id
      })

      next()
    },
    data () {
      return {
        guessingWord: null,
        waitingTimer: null,
        typingWord: null
      }
    },
    computed: {
      ...mapGetters(['getCurrentRoom']),
      isPlaying () {
        return this.getCurrentRoom.currentPlayer && this.$socket.id === this.getCurrentRoom.currentPlayer.id
      },
      winner () {
        const { activePlayers } = this.getCurrentRoom
        return activePlayers.filter(player => player.heart > 0)[0]
      },
      hasJoinedGame () {
        const { activePlayers } = this.getCurrentRoom
        return activePlayers.map(v => v.id).includes(this.$socket.id)
      }
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
        this.typingWord = null
      })
      this.$socket.on('player_lost_heart', ({ activePlayers }) => {
        const room = this.$store.getters.getCurrentRoom
        this.$store.commit('SET_ROOM', {
          ...room,
          activePlayers,
        })
      })
      this.$socket.on('room_starting', ({ game_start_in, state }) => {
        const room = this.$store.getters.getCurrentRoom
        this.$store.commit('SET_ROOM', {
          ...room,
          state
        })
        this.waitingTimer = game_start_in
        const interval = setInterval(() => {
          this.waitingTimer -= 1000
        }, 1000)

        setTimeout(() => {
          this.waitingTimer = null
          clearInterval(interval)
        }, game_start_in)
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
      this.$socket.on('room_type_guess_word', ({ state, currentPlayer, word }) => {
        const room = this.$store.getters.getCurrentRoom
        this.$store.commit('SET_ROOM', {
          ...room,
          state,
          currentPlayer,
        })

        this.typingWord = word
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
    methods: {
      joinGame () {
        this.$socket.emit('room_join_game', {
          id: this.getCurrentRoom.id,
        })
      },
      typeWord () {
        this.$socket.emit('type_guess_word', {
          room: this.getCurrentRoom.id,
          word: this.guessingWord
        })
      },
      guessWord () {
        this.$socket.emit('guess_word', {
          room: this.getCurrentRoom.id,
          word: this.guessingWord
        })
      }
    }
  }
</script>

