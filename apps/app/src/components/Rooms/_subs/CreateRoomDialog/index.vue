<template>
  <div
    v-if="value"
    class="create-room-dialog"
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
            >
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
  </div>
</template>

<script>
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
        roomName: null
      }
    },
    methods: {
      createRoom () {
        this.$socket.emit('create_room', {
          name: this.roomName
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

  .create-room-dialog__wrapper__content__field .field {
    width: 100%;
  }

  .create-room-dialog__wrapper__footer {
    justify-content: flex-end;
    padding-bottom: 16px;
  }
</style>
