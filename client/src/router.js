import Vue from 'vue'
import VueRouter from 'vue-router'
import LoginComponent from './components/Login.vue'
import RegistryComponent from './components/Registry.vue'
import SearchComponent from './components/Search.vue'

Vue.use(VueRouter)

const router = new VueRouter({
  routes: [
    {
      path: '/login',
      name: 'login',
      component: LoginComponent
    },
    {
      path: '/registry',
      name: 'registry',
      component: RegistryComponent
    },
    {
      path: '/search',
      name: 'search',
      component: SearchComponent
    }
  ]
})

export default router