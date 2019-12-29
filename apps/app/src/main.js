import Vue from 'vue'
import io from 'socket.io-client'

import App from './App.vue'

import router from './routes'
import store from './store'
import './plugins'

import '@/assets/css/main.css'

import env from '@/env.json'

Vue.config.productionTip = false

const socket = io(env['api-endpoint'])
Vue.prototype.$socket = socket
Vue.socket = socket

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app')
