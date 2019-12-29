<template>
  <div class="room-game-player">
    <div class="room-game-player__container">
      <div class="room-game-player__container__name">
        {{ name }}
      </div>
      <div class="room-game-player__container__hearts">
        <i
          v-for="(heart, k) in computedHearts"
          :key="k"
          :class="{
            'room-game-player__container__hearts__item--active': heart.icon === 'favorite',
            'room-game-player__container__hearts__item--gold': computedHearts.length === 4,
          }"
          class="room-game-player__container__hearts__item material-icons"
        >
          {{ heart.icon }}
        </i>
      </div>
    </div>
    <div
      v-if="typing"
      class="room-game-player__typing"
    >
      {{ typing }}
    </div>
  </div>
</template>

<script>
  /**
   * @module component - RoomGamePlayer
   */
  export default {
    name: 'RoomGamePlayer',
    props: {
      name: {
        type: String,
        required: true
      },
      hearts: {
        type: Number,
        required: true
      },
      typing: {
        type: String,
        default: null
      }
    },
    computed: {
      computedHearts () {
        return Array.from(new Array(this.hearts === 4 ? 4 : 3))
          .map((_, k) => ({
            icon: (k + 1) <= this.hearts ? 'favorite': 'favorite_border'
          }))
      }
    }
  }
</script>

<style lang="css" scoped>
  .room-game-player {
    width: 140px;
  }

  .room-game-player__typing {
    text-align: center;
  }

  .room-game-player__container {
    background-color: #464F5E;
    border-radius: 4px;
    padding: 8px 0;
    box-shadow: 0 3px 3px rgba(0, 0, 0, 0.1);
    transition: transform 200ms, box-shadow 200ms;
  }

  .room-game-player__container__name {
    position: relative;
    font-size: 1rem;
    text-align: center;
    font-weight: 400;
    margin-bottom: 8px;
  }

  .room-game-player__container__name::after {
    content: '';
    position: absolute;
    width: 45px;
    height: 1px;
    background-color: #525B69;
    bottom: -4px;
    left: 0;
    right: 0;
    margin: auto;
  }

  .room-game-player__container__hearts {
    display: flex;
    justify-content: center;
  }

  .room-game-player__container__hearts__item {
    color: #5B6679;
  }

  .room-game-player__container__hearts__item:not(:last-child) {
    margin-right: 4px;
  }

  .room-game-player__container__hearts__item--active {
    color: #D53F8C;
  }

  .room-game-player__container__hearts__item--gold {
    color: #D5AB3F;
  }
  
  .room-game-player--is-self .room-game-player__container {
    box-shadow: 0 5px 5px rgba(0, 0, 0, 0.1);
    transform: translateY(-5px);
  }
</style>
