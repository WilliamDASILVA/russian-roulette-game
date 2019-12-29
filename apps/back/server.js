const app = require('express')()
const bodyParser = require('body-parser')
const cors = require('cors')
const server = require('http').Server(app)
const io = require('socket.io')(server)

const PORT = process.env.PORT || 3000

app.use(bodyParser.json())
app.use(cors())

app.get('/', function (req, res) {
  res.status(200).send('ok')
})

server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`)
})

module.exports = {
  io,
  app
}
