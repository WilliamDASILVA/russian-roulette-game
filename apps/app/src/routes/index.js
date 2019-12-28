import Vue from 'vue'
import VueRouter from 'vue-router'

import Home from '@/components/Home'
import Rooms from '@/components/Rooms'
import Room from '@/components/Room'

Vue.use(VueRouter)

const router = new VueRouter({
  mode: 'history',
  routes: [
    {
      name: 'Home',
      path: '/',
      component: Home
    },
    {
      name: 'Rooms',
      path: '/rooms',
      component: Rooms
    },
    {
      name: 'Room',
      path: '/rooms/:id',
      component: Room
    },
  ]
})

export default router
