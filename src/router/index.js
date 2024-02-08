/* */
//import Vue from 'vue';
//import VueRouter from 'vue-router';
import { createRouter, createWebHistory } from 'vue-router';



//Vue.use(VueRouter);

import HelloWorld from '@/components/HelloWorld.vue';
import DossierView from '@/components/DossierView.vue';




const routes = [
  {
    path: '/',
    name: 'HelloWorld',
    component: HelloWorld
  },
  {
    path: '/dossier',
    name: 'DossierView',
    component: DossierView
  }
];

/*
const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes
}); */

const router = createRouter({
  history: createWebHistory(),
  base: process.env.BASE_URL,
  routes
});


export default  router; 

