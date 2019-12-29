<template>
  <div class="player-join-form">
    <form
      @submit.prevent="submitted"
    >
      <div
        class="player-join-form__label-container"
      >
        <label
          for="name"
          class="player-join-form__label"
        >
          Your username
        </label>
      </div>
      <div class="player-join-form__fields">
        <input
          v-model="formData.username"
          id="name"
          type="text"
          class="field"
        >

        <button
          type="submit"
          class="btn btn-primary player-join-form__button"
        >
          Join
        </button>
      </div>
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

<style lang="css" scoped>
  .player-join-form__label-container {
    margin-bottom: 8px;
  }

  .player-join-form__label {
    color: rgba(255, 255, 255, 0.7);
    font-size: 1rem;
  }

  .player-join-form__fields {
    display: flex;
  }

  .player-join-form__fields .field {
    margin-right: 8px;
    min-width: 200px;
  }

  .player-join-form__button {
    min-width: 125px;
  }
</style>
