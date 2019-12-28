import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    rooms: [],
    room: null
  },
  mutations: {
    SET_ROOMS (state, rooms) {
      state.rooms = rooms
    },
    SET_ROOM (state, room) {
      state.room = room
    }
  },
  getters: {
    getRooms (state) {
      return state.rooms
    },
    getCurrentRoom (state) {
      return state.room
    }
  }
})

export default store
