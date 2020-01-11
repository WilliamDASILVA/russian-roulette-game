const uuid = require('uuid/v4')
const axios = require('axios')
const { io, app } = require('./server')
const Room = require('./room')
const Player = require('./player')

const rooms = []
const players = []

setInterval(() => {
  rooms
    .filter(room => room.state === 'started')
    .forEach(async (room, roomsId) => {
      if (room.timer < Date.now()) {
        // Kill player
        const playerIndex = room.activePlayers
          .findIndex(player => room.currentPlayer.id === player.id)

        if (playerIndex !== -1) {
          room.activePlayers[playerIndex].heart -= 1
          room.wordTriesCount += 1
          io.to(room.id).emit('player_lost_heart', {
            activePlayers: room.activePlayers
          })

          await room.checkGameState()
          if (room.playersAlive.length > 1) room.nextPlayer()
        }
      }

      io.to(room.id).emit('room_tick', {
        timer: room.timer,
        state: room.state
      })
    })
}, 500)

function formatRooms ({ id, name, password, players }) {
  return {
    id,
    name,
    hasPassword: !!password,
    players
  }
}

function leaveRoom (socket) {
  const playerId = players.findIndex(player => player.id === socket.id)
  if (playerId === -1) {
    return false
  }

  const roomId = rooms.findIndex(room => {
    return room.players.findIndex(player => player.id === players[playerId].id) !== -1
  })

  if (roomId !== -1) {
    rooms[roomId].removePlayer(players[playerId], () => {
      // Self destruct
      rooms.splice(roomId, 1)
    })
    console.log('leave room called??')
  }

  players.forEach(player => {
    io.to(player.id).emit('rooms_available', rooms.map(formatRooms))
  })
}

io.on('connection', function (socket) {
  socket.on('guess_word', ({ room: id, word }) => {
    const roomsId = rooms.findIndex(room => room.id === id)
    if (roomsId !== -1) {
      const room = rooms[roomsId]
      room.guess(word)
    }
  })

  socket.on('type_guess_word', ({ room: id, word }) => {
    const roomsId = rooms.findIndex(room => room.id === id)
    if (roomsId !== -1) {
      const room = rooms[roomsId]
      room.typeGuessWord(word)
    }
  })

  socket.on('room_join', ({ id }, fn) => {
    const roomsId = rooms.findIndex(room => room.id === id)
    if (roomsId !== -1) {
      console.log('room?', roomsId)
      const playerId = players.findIndex(player => player.id === socket.id)
      console.log('players available', players)
      if (playerId !== -1) {
        console.log('PLAYER?', playerId)
        socket.join(rooms[roomsId].id)
        const player = players[playerId]
        rooms[roomsId].addPlayer(player)
        console.log('rooms?', socket.rooms)

        io.to(rooms[roomsId].id).emit('player_joined_room', rooms[roomsId])

        // Emit to all players the new rooms list
        players.forEach(player => {
          io.to(player.id).emit('rooms_available', rooms.map(formatRooms))
        })
        fn()
      }
    }
  })

  socket.on('room_join_game', ({ id }, fn) => {
    const roomsId = rooms.findIndex(room => room.id === id)
    if (roomsId !== -1) {
      const playerId = players.findIndex(player => player.id === socket.id)
      if (playerId !== -1) {
        rooms[roomsId].joinGame(players[playerId], fn)
      }
    }
  })

  socket.on('room_left', () => {
    leaveRoom(socket)
  })

  socket.on('join', (username) => {
    socket.emit('rooms_available', rooms.map(formatRooms))

    const player = new Player(socket.id, username)
    players.push(player)
  })

  socket.on('disconnect', () => {
    const playerId = players.findIndex(player => player.id === socket.id)
    if (playerId !== -1) {
      leaveRoom(socket)

      players.splice(playerId, 1)
    }
  })
})

app.get('/rooms/:id', (req, res) => {
  const { id } = req.params

  const roomsId = rooms.findIndex(room => room.id === id)
  if (roomsId !== -1) {
    const room = Object.assign({}, rooms[roomsId])
    delete room.password
    // TODO: Filter data sent to the response

    res.status(200).send(room)
  } else {
    res.status(404).send({})
  }
})

app.post('/rooms/:id/join', (req, res) => {
  const { id } = req.params
  const { password } = req.body

  const roomsId = rooms.findIndex(room => room.id === id)
  if (roomsId !== -1) {
    const room = rooms[roomsId]
    if (!!room.password && room.password !== password) {
      res.status(401).send({
        error: 'Wrong password'
      })
      return false
    }

    res.status(200).send({
      success: 'OK'
    })
  } else {
    res.status(404).send({})
  }
})

app.post('/rooms', (req, res) => {
  const { name, password, language } = req.body

  const room = new Room(name, password)
  room.language = language
  rooms.push(room)

  players.forEach((player) => {
    io.to(player.id).emit('rooms_available', rooms.map(formatRooms))
  })

  res.status(201).send(room)
})

app.get('/locales', async (req, res) => {
  const r = await axios.get('http://dictionnary:3010/locales')
  res.status(200).send({
    locales: r.data.locales
  })
})
