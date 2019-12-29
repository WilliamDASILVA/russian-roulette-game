<template>
  <div
    v-if="value"
    class="room-password-dialog"
  >
    <ValidationObserver
      ref="observer"
      slim
    >
      <div class="room-password-dialog__wrapper">
        <div class="room-password-dialog__wrapper__header">
          <h2 class="room-password-dialog__wrapper__header__title">
            Password
          </h2>
          <button
            type="button"
            title="Close"
            class="room-password-dialog__wrapper__header__close"
            @click="$emit('input', false)"
          >
            <i class="material-icons" aria-hidden="true">close</i>
          </button>
        </div>
        <form
          @submit.prevent="submitted"
        >
          <div
            class="room-password-dialog__wrapper__content"
          >
            <div class="room-password-dialog__wrapper__content__field">
              <ValidationProvider
                v-slot="{ invalid, errors }"
                name="password"
                slim
              >
                <label
                  for="name"
                  class="room-password-dialog__wrapper__content__label"
                >
                  Password
                </label>
                <input
                  v-model="roomPassword"
                  type="password"
                  id="password"
                  class="field"
                  :class="{
                    'field--invalid': invalid && errors.length > 0
                  }"
                >
                <span
                  v-if="invalid && errors.length > 0"
                  class="room-password-dialog__wrapper__content__error"
                >
                  {{ errors[0] }}
                </span>
              </ValidationProvider>
              <p
                v-if="error"
                class="room-password-dialog__wrapper__content__error"
              >
                {{ error }}
              </p>
            </div>
          </div>

          <div class="room-password-dialog__wrapper__footer">
            <button
              type="button"
              class="btn"
              @click="$emit('input', false)"
            >
              Cancel
            </button>
            <button
              type="submit"
              class="btn btn-primary"
            >
              Join room
            </button>
          </div>
        </form>
      </div>
    </ValidationObserver>
  </div>
</template>

<script>
  import axios from 'axios'

  /**
   * @module component - RoomPasswordDialog
   */
  export default {
    name: 'RoomPasswordDialog',
    props: {
      value: {
        type: Boolean,
        default: false
      },
      room: {
        type: Object,
        default: null
      }
    },
    data () {
      return {
        error: null,
        roomPassword: null
      }
    },
    methods: {
      submitted () {
        this.$refs.observer.validate()
          .then(valid => {
            if (!valid) return false
            this.error = null

            axios.post(`${process.env.VUE_APP_API_ENDPOINT}/rooms/${this.room.id}/join`, {
              password: this.roomPassword
            })
              .then(response => {
                if (response.status === 200) {
                  this.$socket.emit('room_join', {
                    id: this.room.id
                  })
                  this.$router.push({
                    name: 'Room',
                    params: {
                      id: this.room.id
                    }
                  })
                }
              })
              .catch(() => {
                this.error = 'Wrong password'
              })
          })
      }
    }
  }
</script>

<style lang="css" scoped>
  .room-password-dialog {
    display: flex;
    position: absolute;
    left: 0;
    top: 0;
    width: 100vw;
    height: 100vh;

    background-color: rgba(0, 0, 0, 0.4);
  }

  .room-password-dialog__wrapper {
    margin: auto;
    min-width: 500px;
    background: white;
    border-radius: 4px;
  }

  .room-password-dialog__wrapper__header,
  .room-password-dialog__wrapper__content,
  .room-password-dialog__wrapper__footer {
    display: flex;
    padding: 0 16px;
  }

  .room-password-dialog__wrapper__header {
    justify-content: space-between;
    align-items: center;
  }

  .room-password-dialog__wrapper__header__title {
    font-size: 1.5rem;
    font-weight: 400;
    color: rgba(0, 0, 0, 0.86);
  }

  .room-password-dialog__wrapper__header__close {
    appearance: none;
    border: none;
    width: 50px;
    height: 50px;
    padding: 0;
    color: rgba(0, 0, 0, 0.5);
    cursor: pointer;
  }

  .room-password-dialog__wrapper__content {
    display: flex;
    flex-direction: column;
  }

  .room-password-dialog__wrapper__content__field {
    display: flex;
    flex-direction: column;
    width: 100%;
    margin-bottom: 16px;
  }

  .room-password-dialog__wrapper__content__label {
    color: rgba(0, 0, 0, 0.7);
    font-size: 1rem;
    margin-bottom: 4px;
  }

  .room-password-dialog__wrapper__content__error {
    display: flex;
    color: #c53030;
    font-size: 0.9rem;
    margin-top: 8px;
  }

  .room-password-dialog__wrapper__content__label {
    color: rgba(0, 0, 0, 0.7);
    font-size: 1rem;
    margin-bottom: 4px;
  }

  .room-password-dialog__wrapper__content__field .field {
    width: 100%;
  }

  .room-password-dialog__wrapper__footer {
    justify-content: flex-end;
    padding-bottom: 16px;
  }
</style>
