<template>
  <div>
  
  <HelloWorld msg="Welcome to Your Vue.js App"/>
  
  </div>
</template>

<script>
import HelloWorld from './components/HelloWorld.vue'
//import DossierView from './components/DossierView.vue'
//import DossierView from "./components/DossierView.vue"
import 'bootstrap/dist/css/bootstrap.min.css'

export default {
  name: 'App',
  components: {
    HelloWorld,
    
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
