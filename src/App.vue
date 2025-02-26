<template>
  <LoginAdmin/>
</template>

<script>
import LoginAdmin from './views/LoginAdmin.vue';

export default {
  name: 'App',
  components: {
    LoginAdmin
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
