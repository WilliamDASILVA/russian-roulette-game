<template>
  <div class="player-join-form">
    <form
      @submit.prevent="submitted"
    >
      <label for="name">
        Username
      </label>
      <input
        v-model="formData.username"
        type="text"
      >

      <button type="submit">Confirm</button>
    </form>
  </div>
</template>

<script>
  /**
   * @module component - player-join-form
   */
  export default {
    name: 'player-join-form',
    data () {
      return {
        formData: {
          username: null
        }
      }
    },
    methods: {
      submitted () {
        this.$socket.emit('join', this.formData.username)
        this.$router.push({
          name: 'Rooms'
        })
      }
    }
  }
</script>
