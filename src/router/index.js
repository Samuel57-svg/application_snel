import { createRouter, createWebHistory } from 'vue-router';
import HelloWorld from '@/components/HelloWorld.vue';
import DossierView from '@/components/DossierView.vue';
import DocumentView from '@/components/DocumentView.vue';


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
  },
  {
    path: '/document/:name',
    name: 'DocumentView',
    component: DocumentView
  }
];

const router = createRouter({
  history: createWebHistory(),
  mode: 'history',
  base: process.env.BASE_URL,
  routes
});


export default  router; 

