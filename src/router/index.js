import { createRouter, createWebHistory } from 'vue-router';
import HelloWorld from '@/components/HelloWorld.vue';
import DashBoard from '@/components/DashBoard.vue';
import DossierView from '@/components/DossierView.vue';
import DocumentView from '@/components/DocumentView.vue';
import GraphiqueAgentsParCategorie from '@/components/GraphiqueAgentsParCategorie.vue';

const routes = [
  {
    path: '/',
    name: 'HelloWorld',
    component: HelloWorld,
    meta: { requiresAuth: true }
  },
  {
    path: '/dashboard/:id' ,
    name: 'DashBoard',
    component: DashBoard,
    props: true,
    meta: { requiresAuth: true },
    
  },
  {
    path: '/dashboard/:id/graph',
    name: 'DashboardGraph',
    component: GraphiqueAgentsParCategorie, // Remplacez-le par le nom de votre composant
    meta: { requiresAuth: true }
  },
  
  {
    path: '/agents/:id/:name_category',
    name: 'DossierView',
    component: DossierView,
    meta: { requiresAuth: true }
  },
  {
    path: '/document/:id/:name_category/:name',
    name: 'DocumentView',
    component: DocumentView,
    props: true,
    meta: { requiresAuth: true }
  },
 
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

/*
router.beforeEach((to, from, next) => {
  const isAuthenticated = localStorage.getItem('isAuthenticated');
  if (to.matched.some(record => record.meta.requiresAuth) && !isAuthenticated) {
    next({ name: 'Login' });
  } else {
    next();
  }
}); */

export default router;