<template>
  <div class="rooms">
    <h1>
      Rooms
    </h1>
    <template
      v-if="getRooms && getRooms.length > 0"
    >
      <ul>
        <li 
          v-for="room in getRooms"
          :key="room.id"
        >
          <router-link
            :to="{
              name: 'Room',
              params: {
                id: room.id
              }
            }"
          >
            {{ room.name }}
          </router-link>
        </li>
      </ul>
    </template>
    <template
      v-else
    >
      No rooms.
    </template>

    <button
      type="button"
      @click="roomCreation = true"
    >
      Create room
    </button>

    <form
      v-if="roomCreation"
      @submit.prevent="createRoom"
    >
      <label for="name">
        Room name
      </label>
      <input
        v-model="roomName"
        type="text"
        id="name"
      >

      <button type="submit">Create room</button>
    </form>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'

  /**
   * @module component - rooms
   */
  export default {
    name: 'rooms',
    data () {
      return {
        roomCreation: false,
        roomName: null
      }
    },
    computed: {
      ...mapGetters([
        'getRooms'
      ])
    },
    mounted () {
      this.$socket.on('rooms_available', (rooms) => {
        console.log('rooms', rooms)
        this.$store.commit('SET_ROOMS', rooms)
      })
      this.$socket.on('room_created', ({ id }) => {
        this.$router.push({
          name: 'Room',
          params: {
            id
          }
        })
      })
    },
    methods: {
      createRoom () {
        console.log('create room?')
        this.$socket.emit('create_room', {
          name: this.roomName
        })
      }
    }
  }
</script>
