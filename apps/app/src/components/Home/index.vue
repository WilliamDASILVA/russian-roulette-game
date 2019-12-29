<template>
  <div class="home">
    <div class="home__container">
      <img
        class="home__container__logo"
        src="@/assets/img/logo.png"
        alt="Bombparty Clone"
      >

      <PlayerJoinForm />
    </div>
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

<style lang="css" scoped>
  .home {
    display: flex;
    min-height: 100vh;
  }

  .home__container {
    display: flex;
    flex-direction: column;
    margin: auto;
  }

  .home__container__logo {
    margin: 0 auto 32px auto;
  }
</style>
