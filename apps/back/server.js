const app = require('express')()
const server = require('http').Server(app)
const io = require('socket.io')(server)

const PORT = process.env.PORT || 3000

app.get('/', function (req, res) {
  res.status(200).send('ok')
})

server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`)
})

module.exports = {
  io
}
