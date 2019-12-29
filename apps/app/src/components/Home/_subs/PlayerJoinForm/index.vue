<template>
  <div class="player-join-form">
    <ValidationObserver
      ref="observer"
      v-slot="{ invalid, errors }"
      slim
    >
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
          <ValidationProvider
            name="username"
            rules="required"
            class="player-join-form__fields__field"
          >
            <input
              v-model="formData.username"
              id="name"
              type="text"
              class="field"
              required
            >
          </ValidationProvider>

          <button
            type="submit"
            class="btn btn-primary player-join-form__button"
          >
            Join
          </button>
        </div>
        <span
          v-if="invalid"
          class="player-join-form__error"
        >
          {{ errors.username[0] }}
        </span>
      </form>
    </ValidationObserver>
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
        this.$refs.observer.validate()
          .then(valid => {
            if (!valid) return false

            this.$socket.emit('join', this.formData.username)
            this.$router.push({
              name: 'Rooms'
            })
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

  .player-join-form__error {
    display: flex;
    color: #D53F8C;
    font-size: 0.8rem;
    margin-top: 8px;
  }

  .player-join-form__fields {
    display: flex;
  }

  .player-join-form__fields .field {
    margin-right: 8px;
    min-width: 200px;
  }

  .player-join-form__fields__field {
    display: flex;
    flex-direction: column;
  }

  .player-join-form__button {
    min-width: 125px;
  }
</style>
