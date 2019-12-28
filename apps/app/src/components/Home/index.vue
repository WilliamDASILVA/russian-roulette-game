<template>
  <div class="home">
    <h1>
      Bombparty clone
    </h1>

    <PlayerJoinForm />
  </div>
</template>

<script>
  import PlayerJoinForm from './_subs/PlayerJoinForm'

  /**
   * @module component - home
   */
  export default {
    name: 'home',
    components: {
      PlayerJoinForm
    }
  }
</script>
