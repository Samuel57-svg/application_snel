<template>
  <div>
    <HelloWorld v-if="!isAuthenticated" @authenticated="handleAuthenticated" />
    <DossierView v-else />
  </div>
</template>

<script>
import HelloWorld from './components/HelloWorld.vue'
import DossierView from './components/DossierView.vue'
//import DossierView from "./components/DossierView.vue"
import 'bootstrap/dist/css/bootstrap.min.css'
//import { createRouter, createWebHistory } from 'vue-router'

/*
const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '/',
            name: 'HelloWorld',
            component: HelloWorld
        },
    ]
});

export default {
  name: 'App',
  components: {
    HelloWorld,
  } ,
  router
} */

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
