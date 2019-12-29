import Vue from 'vue'
import io from 'socket.io-client'

import App from './App.vue'

import router from './routes'
import store from './store'
import './plugins'

import '@/assets/css/main.css'

Vue.config.productionTip = false

const socket = io('http://0.0.0.0:3000')
Vue.prototype.$socket = socket
Vue.socket = socket

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app')
