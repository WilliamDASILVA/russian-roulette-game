import Vue from 'vue'
import io from 'socket.io-client'

import App from './App.vue'

import router from './routes'
import store from './store'
import './plugins'

import '@/assets/css/main.css'

Vue.config.productionTip = false

const socket = io(process.env.VUE_APP_API_ENDPOINT)
Vue.prototype.$socket = socket
Vue.socket = socket

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app')
