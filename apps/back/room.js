const axios = require('axios')
const uuid = require('uuid/v4')
const { io } = require('./server')

const GAME_TIMER = 5

module.exports = class Room {
  constructor (name, password) {
    this.id = uuid()
    this.state = 'created'
    this.name = name
    this.password = password

    this.players = []
    this.activePlayers = []
    this.blacklist = []

    this.word_to_guess = null
    this.currentPlayer = null
    this.timer = null
    this.gameStartTimeout = null
    this.wordTriesCount = 0
    this.language = 'en'
  }

  addPlayer (player) {
    this.players.push(player)
  }

  removePlayer (player, cb) {
    const playerId = this.players.findIndex(p => p.id === player.id)
    if (playerId !== -1) {
      this.players.splice(playerId, 1)
    }

    const activePlayerId = this.activePlayers.findIndex(p => p.id === player.id)
    if (activePlayerId !== -1) {
      this.activePlayers.splice(activePlayerId, 1)
    }
    
    // TODO: Emit event to the room once a player leaves
    io.to(this.id).emit('room_player_left', {
      state: this.state,
      players: this.players,
      activePlayers: this.activePlayers
    })

    if (this.currentPlayer && player.id === this.currentPlayer.id) {
      if (this.activePlayers.length >= 2) {
        // Go to next player
        this.nextPlayer()
      } else {
        this.checkGameState()
      }
    }

    if (this.players.length === 0) {
      cb()
    }
  }

  get playersAlive () {
    return this.activePlayers.filter(player => player.heart > 0)
  }

  joinGame (player, cb) {
    const playerIndex = this.activePlayers.findIndex(p => p.id === player.id)
    if (playerIndex !== -1) return false

    const disabledStates = ['started', 'finished']
    if (disabledStates.includes(this.state)) return false

    this.activePlayers.push(player)

    if (this.activePlayers.length >= 2) {
      if (this.state !== 'starting') {
        this.state = 'starting'
        const GAME_START_AT = Date.now() + 5000
  
        io.to(this.id).emit('room_starting', {
          state: this.state,
          game_start_at: GAME_START_AT
        })
  
        setTimeout(() => {
          this.startGame()
        }, 5000)
      }
    }

    io.to(this.id)
      .emit('room_joined_game', {
        state: this.state,
        activePlayers: this.activePlayers
      })
    cb()
  }

  async changeLettersToGuess () {
    const res = await axios.get(`http://dictionnary:3010/locales/${this.language}/letters`)
    this.word_to_guess = res.data.letter
    this.timer = Date.now() + (1000 * GAME_TIMER)
  }

  async startGame () {
    /**
     * Pick a random letters to guess
     */
    await this.changeLettersToGuess()
    this.currentPlayer = this.activePlayers[Math.floor(Math.random() * this.activePlayers.length)]

    this.state = 'started'

    io.to(this.id).emit('room_started', {
      state: this.state,
      word_to_guess: this.word_to_guess,
      activePlayers: this.activePlayers,
      currentPlayer: this.currentPlayer
    })
  }

  resetRoom () {
    this.state = 'created'
    this.activePlayers = []
    this.currentPlayer = null
    this.timer = null
    this.blacklist = []

    this.players.forEach(player => player.reset())

    io.to(this.id).emit('room_reset', {
      state: this.state,
      activePlayers: this.activePlayers,
      currentPlayer: this.currentPlayer,
      timer: this.timer
    })
  }

  async checkGameState () {
    if (this.playersAlive.length === 1) {
      this.state = 'finished'
      console.log('End game')
      io.to(this.id).emit('room_game_finished', {
        state: this.state,
        activePlayers: this.activePlayers
      })

      setTimeout(() => {
        this.resetRoom()
      }, 5000)
      return false
    }

    if (this.wordTriesCount === this.playersAlive.length) {
      // Nobody found a word matching the current letters, change the letters
      this.wordTriesCount = 0
      await this.changeLettersToGuess()
    }
    return true
  }

  typeGuessWord (word) {
    io.to(this.id).emit('room_type_guess_word', {
      state: this.state,
      currentPlayer: this.currentPlayer,
      word
    })
  }

  async guess (word) {
    try {
      await axios.post(`http://dictionnary:3010/locales/${this.language}/words`, {
        word
      })
    } catch (err) {
      return false
    }

    const transformedWord = word.toLowerCase()
    const isInBlackList = this.blacklist.includes(transformedWord)
    const matchesWordToGuess = transformedWord.match(this.word_to_guess.toLowerCase())

    if (!isInBlackList && matchesWordToGuess) {
      await this.changeLettersToGuess()
      this.blacklist.push(transformedWord)
      this.wordTriesCount = 0

      const currPlayer = this.activePlayers.findIndex(p => p.id === this.currentPlayer.id)
      console.log('player to update', this.activePlayers[currPlayer])
      const lettersToMatch = this.activePlayers[currPlayer].lettersToUse
      lettersToMatch.forEach(letter => {
        if (transformedWord.includes(letter.toLowerCase())) {
          // Remove letter from list
          const letterIndex = this.activePlayers[currPlayer].lettersToUse.findIndex(l => l === letter)
          const newLetters = [...this.activePlayers[currPlayer].lettersToUse]
          newLetters.splice(letterIndex, 1)
          this.activePlayers[currPlayer].lettersToUse = newLetters
        }
      })

      if (this.activePlayers[currPlayer].heart < 4 && !this.activePlayers[currPlayer].hasUsedAllLetters && this.activePlayers[currPlayer].lettersToUse.length === 0) {
        this.activePlayers[currPlayer].heart += 1
        this.activePlayers[currPlayer].hasUsedAllLetters = true
      }

      this.nextPlayer()
    }
  }

  nextPlayer () {
    // Player found a word or previous player died.
    this.timer = Date.now() + (1000 * GAME_TIMER)
  
    // Go to next player
    if (!this.checkGameState()) return false

    const playerIndex = this.playersAlive.findIndex(player => this.currentPlayer.id === player.id)
    if (playerIndex + 1 >= this.playersAlive.length) {
      // 0
      this.currentPlayer = this.playersAlive[0]
    } else {
      this.currentPlayer = this.playersAlive[playerIndex + 1]
      // index + 1
    }
  
    io.to(this.id).emit('room_next_player', {
      state: this.state,
      word_to_guess: this.word_to_guess,
      activePlayers: this.activePlayers,
      currentPlayer: this.currentPlayer
    })
  }
}
