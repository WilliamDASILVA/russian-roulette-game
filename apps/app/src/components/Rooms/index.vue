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
            <router-link
              :to="{
                name: 'Room',
                params: {
                  id: room.id
                }
              }"
              class="rooms__list__item"
            >
              <div class="rooms__list__item__name">
                {{ room.name }}
              </div>
              <div class="rooms__list__item__player-count">
                3 players
              </div>
            </router-link>
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
    </div>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'

  import CreateRoomDialog from './_subs/CreateRoomDialog'

  /**
   * @module component - rooms
   */
  export default {
    name: 'rooms',
    components: {
      CreateRoomDialog
    },
    data () {
      return {
        isCreateRoomOpen: false
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
    beforeRouteLeave (to, from, next) {
      const routes = ['Home']
      if (routes.includes(to.name)) {
        this.$socket.emit('disconnect', {
          id: this.getCurrentRoom.id,
        })
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
    display: flex;
    flex-direction: column;

    color: white;
    background-color: transparent;
    padding: 16px 20px;
    text-decoration: none;
    border-radius: 4px;
    min-width: 100%;

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

  .rooms__list__item:hover {
    background-color: rgba(255, 255, 255, 0.12);
  }
</style>
