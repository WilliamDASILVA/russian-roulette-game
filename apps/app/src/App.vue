<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
  export default {
    name: 'app',
    mounted () {
      this.$socket.on('initiate_room', (players) => {
        this.players = players
      })
    },
    data () {
      return {
        isLoggedIn: false,
        socket: null,
        username: null,
        players: [],
        rooms: [],
        roomCreation: false,
        roomName: null,
        room: null,
        isInRoom: false
      }
    },
    methods: {
      createRoom () {
        this.$socket.emit('create_room', {
          name: this.roomName
        })
      }
    }
  }
</script>