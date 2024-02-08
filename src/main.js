
import { createApp } from 'vue'
import App from './App.vue'
import router from './router/';
//import router from './index'




createApp(App)
  .use(router)
  .mount('#app')
