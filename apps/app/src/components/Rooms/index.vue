<template>
  <div class="rooms">
    <div class="rooms__wrapper">
      <img
        class="rooms__logo"
        src="@/assets/img/logo.png"
        alt="Bombparty Clone"
      >

      <div class="rooms__header">
        <h1 class="rooms__header__title">
          Rooms
        </h1>

        <button
          type="button"
          class="btn btn-primary"
          @click="isCreateRoomOpen = true"
        >
          Create room
        </button>
      </div>
      <template
        v-if="getRooms && getRooms.length > 0"
      >
        <ul class="rooms__list">
          <li 
            v-for="room in getRooms"
            :key="room.id"
          >
            <button
              class="rooms__list__item"
              @click="joinRoom(room)"
            >
              <div class="rooms__list__item__name">
                {{ room.name }}
              </div>
              <div class="rooms__list__item__player-count">
                {{ room.players.length }} players
              </div>
              <i
                v-if="room.hasPassword"
                class="rooms__list__item__lock material-icons"
                aria-hidden="true"
              >lock</i>
            </button>
          </li>
        </ul>
      </template>
      <template
        v-else
      >
        No rooms.
      </template>

      <CreateRoomDialog
        v-model="isCreateRoomOpen"
      />

      <RoomPasswordDialog
        v-model="passwordDialog.visible"
        :room="passwordDialog.room"
      />
    </div>
  </div>
</template>

<script>
  import store from '@/store'
  import { mapGetters } from 'vuex'

  import CreateRoomDialog from './_subs/CreateRoomDialog'
  import RoomPasswordDialog from './_subs/RoomPasswordDialog'

  /**
   * @module component - rooms
   */
  export default {
    name: 'rooms',
    components: {
      CreateRoomDialog,
      RoomPasswordDialog
    },
    data () {
      return {
        isCreateRoomOpen: false,
        passwordDialog: {
          visible: false,
          room: null
        }
      }
    },
    computed: {
      ...mapGetters([
        'getRooms'
      ])
    },
    mounted () {
      this.$socket.on('joined_room', (room) => {
        this.$store.commit('SET_ROOM', room)
      })
      this.$socket.on('rooms_available', (rooms) => {
        this.$store.commit('SET_ROOMS', rooms)
      })
    },
    methods: {
      joinRoom (room) {
        if (room.hasPassword) {
          this.passwordDialog.visible = true
          this.passwordDialog.room = room
        } else {
          this.$socket.emit('room_join', {
            id: room.id
          })

          this.$router.push({
            name: 'Room',
            params: {
              id: room.id
            }
          })
        }
      }
    },
    beforeRouteEnter (to, from, next) {
      const username = store.getters.getUsername
      if (!username) {
        next({
          name: 'Home'
        })

        return false
      }

      next()
    },
    beforeRouteLeave (to, from, next) {
      const routes = ['Home']
      if (routes.includes(to.name)) {
        this.$socket.emit('disconnect')
      }
      next()
    }
  }
</script>

<style lang="css" scoped>
  .rooms {
    display: flex;
  }

  .rooms__logo {
    margin: 64px auto 64px auto;
  }

  .rooms__wrapper {
    display: flex;
    flex-direction: column;
    margin: auto;
    min-width: 500px;
  }

  .rooms__header {
    display: flex;
    justify-content: space-between;
    margin-bottom: 16px;
  }

  .rooms__header__title {
    color: white;
    font-size: 1.5rem;
    font-weight: 400;
  }

  .rooms__list {
    display: flex;
    flex-direction: column;
    list-style: none;
    margin: 0;
    padding: 0;
  }

  .rooms__list li {
    width: 100%;
  }

  .rooms__list__item {
    position: relative;
    display: flex;
    flex-direction: column;

    color: white;
    background-color: transparent;
    padding: 16px 20px;
    text-decoration: none;
    border-radius: 4px;
    min-width: 100%;
    border: none;

    transition: background-color 100ms;
  }

  .rooms__list__item__name {
    font-size: 1.25rem;
    margin-bottom: 8px;
  }

  .rooms__list__item__player-count {
    font-size: 0.75rem;
    color: rgba(255, 255, 255, 0.7);
  }

  .rooms__list__item__lock {
    position: absolute;
    right: 16px;
    opacity: 0.7;
  }

  .rooms__list__item:hover {
    background-color: rgba(255, 255, 255, 0.12);
  }
</style>
