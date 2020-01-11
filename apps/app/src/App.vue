<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
  import axios from 'axios'

  import store from '@/store'

  export default {
    name: 'app',
    async mounted () {
      this.$socket.on('initiate_room', (players) => {
        this.players = players
      })

      const res = await axios.get(`${process.env.VUE_APP_API_ENDPOINT}/locales`)
      store.commit('SET_AVAILABLE_LOCALES', res.data.locales)
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

<style lang="css">
  #app, body {
    background-color: #2D3748;
    min-height: 100vh;
  }
</style>