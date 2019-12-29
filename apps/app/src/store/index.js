import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    rooms: [],
    room: null,
    username: null
  },
  mutations: {
    SET_ROOMS (state, rooms) {
      state.rooms = rooms
    },
    SET_ROOM (state, room) {
      state.room = room
    },
    SET_USERNAME (state, username) {
      state.username = username
    }
  },
  getters: {
    getRooms (state) {
      return state.rooms
    },
    getCurrentRoom (state) {
      return state.room
    },
    getUsername (state) {
      return state.username
    }
  }
})

export default store
