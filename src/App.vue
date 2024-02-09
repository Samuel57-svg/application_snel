<template>
  <div>
    <HelloWorld v-if="!isAuthenticated" @authenticated="handleAuthenticated" />
    <DossierView v-else />
    <router-view v-if="isAuthenticated" />
    
  </div>
</template>

<script>
import HelloWorld from './components/HelloWorld.vue'
import DossierView from './components/DossierView.vue'
//import DocumentView from './components/DocumentView.vue'
import 'bootstrap/dist/css/bootstrap.min.css'


export default {
  name: 'App',
  components: {
    HelloWorld,
    DossierView
    
  },
  data() {
    return {
      isAuthenticated: false
    };
  },
  methods: {
    handleAuthenticated() {
      this.isAuthenticated = true;
    }
  }
};


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
