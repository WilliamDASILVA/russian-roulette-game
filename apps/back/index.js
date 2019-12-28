const uuid = require('uuid/v4')
const { io } = require('./server')
const Room = require('./room')
const Player = require('./player')

const rooms = []
const players = []

setInterval(() => {
  rooms
    .filter(room => room.state === 'started')
    .forEach((room, roomsId) => {
      if (room.timer < Date.now()) {
        // Kill player
        const playerIndex = room.activePlayers
          .findIndex(player => room.currentPlayer.id === player.id)

        if (playerIndex !== -1) {
          room.activePlayers[playerIndex].heart -= 1
          io.to(room.id).emit('player_lost_heart', {
            activePlayers: room.activePlayers
          })
          room.checkGameState()
          room.nextPlayer()
        }
      }
    })
}, 500)

io.on('connection', function (socket) {
  socket.on('create_room', ({ name }) => {
    const room = new Room(name)
    rooms.push(room)

    players.forEach((player) => {
      io.to(player.id).emit('rooms_available', rooms)
    })

    socket.emit('room_created', {
      id: room.id
    })
  })

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

  socket.on('room_join', ({ id }) => {
    console.log('JOIN ROOM', id)
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
      }
    }
  })

  socket.on('room_join_game', ({ id }) => {
    const roomsId = rooms.findIndex(room => room.id === id)
    if (roomsId !== -1) {
      const playerId = players.findIndex(player => player.id === socket.id)
      if (playerId !== -1) {
        rooms[roomsId].joinGame(players[playerId])
      }
    }
  })

  socket.on('join', (username) => {
    console.log('socket', socket.id)
    socket.emit('rooms_available', rooms)
    const player = new Player(socket.id, username)
    players.push(player)
  })

  socket.on('disconnect', () => {
    const playerId = players.findIndex(player => player.id === socket.id)
    if (playerId !== -1) {
      const roomId = rooms.findIndex(room => {
        return room.players.findIndex(player => player.id === players[playerId].id) !== -1
      })

      if (roomId !== -1) {
        rooms[roomId].removePlayer(players[playerId], () => {
          // Self destruct
          rooms.splice(roomId, 1)
        })
      }

      players.splice(playerId, 1)
    }
  })
})
