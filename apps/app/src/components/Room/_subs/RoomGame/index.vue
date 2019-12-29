<template>
  <div class="room-game">
    <div class="room-game__circle">
      <div
        class="room-game__message"
      >
        <template
          v-if="getCurrentRoom.state === 'created'"
        >
          <div
            class="room-game__message__title"
          >
            Waiting for players...
          </div>
        </template>
        <template
          v-if="getCurrentRoom.state === 'started'"
        >
          <div
            class="room-game__message__title"
          >
            Find a word with "{{ getCurrentRoom.word_to_guess }}"
          </div>
        </template>
        <template
          v-if="getCurrentRoom.state === 'starting'"
        >
          Game starts in {{ waitingTimer }}...
        </template>
        <template
          v-if="getCurrentRoom.state === 'finished'"
        >
          {{ winner.name }} won
        </template>

        <button
          v-if="(getCurrentRoom.state === 'starting' || getCurrentRoom.state === 'created') && !hasJoinedGame"
          type="button"
          class="btn btn-primary"
          @click="joinGame"
        >
          Join game
        </button>
      </div>

      <div class="room-game__circle__players">
        <RoomGamePlayer
          v-for="(player, k) in players"
          :key="k"
          :name="player.name"
          :hearts="player.heart"
          :typing="player.typing"
          :style="{
            left: player.position.left,
            top: player.position.top
          }"
          :class="{
            'room-game-player--is-self': isPlaying && player.id === $socket.id
          }"
        />
      </div>

      <div class="room-game__circle__center" />
      <div
        v-if="getCurrentRoom.state === 'started'"
        class="room-game__circle__arrow"
        :style="{
          'transform': `rotate(${arrowRotation}deg)`
        }"
      />
    </div>
    <div
      v-if="getCurrentRoom.state === 'started' && isPlaying"
      class="room-game__form"
    >
      <form
        @submit.prevent="guessWord"
      >
        <label for="word">
          Your word
        </label>
        <input
          v-model="guessingWord"
          type="text"
          name="word"
          id="word"
          class="field"
          @input="typeWord"
        >
      </form>
    </div>

    <ul
      v-if="getCurrentRoom.state === 'started'"
      class="room-game__letters-to-use"
    >
      <li
        v-for="letter in computedLetters"
        :key="letter.letter"
        :class="{
          'room-game__letters-to-use--used': letter.isUsed
        }"
      >
        {{ letter.letter }}
      </li>
    </ul>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'

  import RoomGamePlayer from './_subs/RoomGamePlayer'

  const LETTERS_TO_USE = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'L', 'M', 'N', 'O', 'P', 'R', 'S', 'T', 'U', 'V']

  /**
   * @module component - RoomGame
   */
  export default {
    name: 'RoomGame',
    components: {
      RoomGamePlayer
    },
    data () {
      return {
        guessingWord: null,
        typingWord: null,
        waitingTimer: null,
        totalRotations: 0
      }
    },
    mounted () {
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
      this.$socket.on('room_next_player', () => {
        this.typingWord = null
        this.guessingWord = null
        this.totalRotations += 0.5
      })
      this.$socket.on('room_type_guess_word', ({ word }) => {
        this.typingWord = word
      })
    },
    computed: {
      ...mapGetters(['getCurrentRoom']),
      winner () {
        const { activePlayers } = this.getCurrentRoom
        return activePlayers.filter(player => player.heart > 0)[0]
      },
      arrowRotation () {
        const { activePlayers, currentPlayer } = this.getCurrentRoom
        const playerIndex = activePlayers.findIndex(player => player.id === currentPlayer.id)

        // 180 => 360
        // 540 => 720

        // 180 + 0 + 0 => 180 => 0r
        // 180 + 0 + 180 => 360 => 0.5r
        // 180 + 180 + 180 => 540 => 1
        // 180 + 540 + 0 => 720 => 1.5
        // 180 + 540 + 180 => 900 => 2
        // 180 + 900 + 0 => 1080 2.5

        return 180 + ((360 / activePlayers.length) * playerIndex)
      },
      computedLetters () {
        const { activePlayers } = this.getCurrentRoom
        const player = activePlayers.find(player => player.id === this.$socket.id)

        return LETTERS_TO_USE.map(letter => ({
          isUsed: !player.lettersToUse.includes(letter),
          letter
        }))
      },
      hasJoinedGame () {
        const { activePlayers } = this.getCurrentRoom
        return activePlayers.map(v => v.id).includes(this.$socket.id)
      },
      isPlaying () {
        const { currentPlayer } = this.getCurrentRoom
        return currentPlayer && this.$socket.id === currentPlayer.id
      },
      players () {
        const { activePlayers, currentPlayer } = this.getCurrentRoom
        return activePlayers.map((player, k) => {
          const angle = (Math.PI * 2) / activePlayers.length

          return {
            ...player,
            typing: currentPlayer && currentPlayer.id === player.id ? this.typingWord : null,
            position: {
              left: `${((Math.cos((k * angle) + angle)).toFixed(2) * 250) - 70}px`,
              top: `${((Math.sin((k * angle) + angle)).toFixed(2) * 250) - 33}px`
            }
          }
        })
      }
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

<style lang="css" scoped>
  .room-game {
    display: flex;
    flex-direction: column;
  }

  .room-game__circle {
    position: relative;
    width: 500px;
    height: 500px;
    border-radius: 500px;
    border: 1px solid #434C5B;
    margin: auto;
    margin-bottom: 64px;
  }

  .room-game__circle__center {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    width: 32px;
    height: 32px;
    border-radius: 32px;
    margin: auto;
    background-color: #434C5B;
  }

  .room-game__circle__arrow {
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    margin: auto;
    width: 500px;
    height: 28px;
    transition: transform 500ms ease-in-out;
  }

  .room-game__circle__arrow::before {
    content: '';
    position: absolute;
    width: 0;
    height: 0;
    border-style: solid;
    border-width: 14px 16px 14px 0;
    border-color: transparent #434C5B transparent transparent;
  }

  .room-game__circle__arrow::after {
    content: '';
    position: absolute;
    left: 16px;
    top: 9px;
    width: 250px;
    height: 10px;
    background-color: #434C5B;
  }

  .room-game__circle__center::after {
    position: absolute;
    content: '';
    left: -12px;
    top: -12px;
    width: 54px;
    height: 54px;
    border-radius: 54px;
    border: 1px solid rgba(255, 255, 255, 0.12);
  }

  .room-game__message {
    position: absolute;
    display: flex;
    flex-direction: column;
    text-align: center;
    bottom: 120px;
    left: 0;
    right: 0;
    width: 200px;
    margin: auto;
  }

  .room-game__message__title {
    margin-bottom: 16px;
  }

  .room-game-player {
    position: absolute;
    z-index: 2;
  }

  .room-game__circle__players {
    position: absolute;
    left: 250px;
    top: 250px;
  }

  .room-game__word-to-guess {
    position: absolute;
  }

  .room-game__form form {
    display: flex;
    flex-direction: column;
    width: 250px;
    margin: auto;
    margin-bottom: 32px;
  }

  .room-game__form label {
    color: rgba(255, 255, 255, 0.70);
    text-align: center;
    margin-bottom: 8px;
  }

  .room-game__letters-to-use {
    display: flex;
    flex-wrap: wrap;
    margin: 0 auto;
    padding: 0;
    list-style: none;
    width: 500px;
  }

  .room-game__letters-to-use li {
    width: 40px;
    height: 40px;
    border-radius: 4px;
    text-align: center;
    line-height: 40px;
    background-color: #242C3B;
    margin-bottom: 4px;
  }

  .room-game__letters-to-use li:not(:last-child) {
    margin-right: 4px;
  }

  .room-game__letters-to-use li.room-game__letters-to-use--used {
    opacity: 0.2;
  }
</style>
