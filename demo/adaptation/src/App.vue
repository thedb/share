<template>
  <div id="app">
    <img src="./assets/logo.png">
    <router-view/>
  </div>
</template>

<script>
import './assets/js/amfe-flexible'

export default {
  name: 'app'
}
</script>

<style>
html body{
  width: 100%;
  height: 100%;
}
*{
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}
.hairlines .rem {
  border-width: 0.5px!important;
}
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
