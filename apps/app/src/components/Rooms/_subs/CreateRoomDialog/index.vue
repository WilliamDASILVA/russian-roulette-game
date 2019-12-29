<template>
  <div
    v-if="value"
    class="create-room-dialog"
  >
    <ValidationObserver
      ref="observer"
      slim
    >
      <div class="create-room-dialog__wrapper">
        <div class="create-room-dialog__wrapper__header">
          <h2 class="create-room-dialog__wrapper__header__title">
            Create a new room
          </h2>
          <button
            type="button"
            title="Close"
            class="create-room-dialog__wrapper__header__close"
            @click="$emit('input', false)"
          >
            <i class="material-icons" aria-hidden="true">close</i>
          </button>
        </div>
        <form
          @submit.prevent="createRoom"
        >
          <div
            class="create-room-dialog__wrapper__content"
          >
            <div class="create-room-dialog__wrapper__content__field">
              <ValidationProvider
                v-slot="{ invalid, errors }"
                name="room name"
                rules="required"
                slim
              >
                <label
                  for="name"
                  class="create-room-dialog__wrapper__content__label"
                >
                  Room name
                </label>
                <input
                  v-model="roomName"
                  type="text"
                  id="name"
                  class="field"
                  :class="{
                    'field--invalid': invalid && errors.length > 0
                  }"
                  required
                >
                <span
                  v-if="invalid && errors.length > 0"
                  class="create-room-dialog__wrapper__content__error"
                >
                  {{ errors[0] }}
                </span>
              </ValidationProvider>
            </div>
            <div class="create-room-dialog__wrapper__content__field">
              <ValidationProvider
                v-slot="{ invalid, errors }"
                name="password"
                slim
              >
                <label
                  for="name"
                  class="create-room-dialog__wrapper__content__label"
                >
                  Room password (optional)
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
                  class="create-room-dialog__wrapper__content__error"
                >
                  {{ errors[0] }}
                </span>
              </ValidationProvider>
            </div>
          </div>

          <div class="create-room-dialog__wrapper__footer">
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
              Create room
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
   * @module component - CreateRoomDialog
   */
  export default {
    name: 'CreateRoomDialog',
    props: {
      value: {
        type: Boolean,
        default: false
      }
    },
    data () {
      return {
        roomName: null,
        roomPassword: null
      }
    },
    methods: {
      createRoom () {
        this.$refs.observer.validate()
          .then(valid => {
            if (!valid) return false

            axios.post(`http://0.0.0.0:3000/rooms`, {
              name: this.roomName,
              password: this.roomPassword
            })
              .then(response => {
                if (response.status === 201) {
                  const room = response.data

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
              })
          })
      }
    }
  }
</script>

<style lang="css" scoped>
  .create-room-dialog {
    display: flex;
    position: absolute;
    left: 0;
    top: 0;
    width: 100vw;
    height: 100vh;

    background-color: rgba(0, 0, 0, 0.4);
  }

  .create-room-dialog__wrapper {
    margin: auto;
    min-width: 500px;
    background: white;
    border-radius: 4px;
  }

  .create-room-dialog__wrapper__header,
  .create-room-dialog__wrapper__content,
  .create-room-dialog__wrapper__footer {
    display: flex;
    padding: 0 16px;
  }

  .create-room-dialog__wrapper__header {
    justify-content: space-between;
    align-items: center;
  }

  .create-room-dialog__wrapper__header__title {
    font-size: 1.5rem;
    font-weight: 400;
    color: rgba(0, 0, 0, 0.86);
  }

  .create-room-dialog__wrapper__header__close {
    appearance: none;
    border: none;
    width: 50px;
    height: 50px;
    padding: 0;
    color: rgba(0, 0, 0, 0.5);
    cursor: pointer;
  }

  .create-room-dialog__wrapper__content {
    display: flex;
    flex-direction: column;
  }

  .create-room-dialog__wrapper__content__field {
    display: flex;
    flex-direction: column;
    width: 100%;
    margin-bottom: 16px;
  }

  .create-room-dialog__wrapper__content__label {
    color: rgba(0, 0, 0, 0.7);
    font-size: 1rem;
    margin-bottom: 4px;
  }

  .create-room-dialog__wrapper__content__error {
    display: flex;
    color: #c53030;
    font-size: 0.9rem;
    margin-top: 8px;
  }

  .create-room-dialog__wrapper__content__label {
    color: rgba(0, 0, 0, 0.7);
    font-size: 1rem;
    margin-bottom: 4px;
  }

  .create-room-dialog__wrapper__content__field .field {
    width: 100%;
  }

  .create-room-dialog__wrapper__footer {
    justify-content: flex-end;
    padding-bottom: 16px;
  }
</style>
