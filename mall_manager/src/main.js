import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'

import './assets/css/global.css'
import TreeTable from 'vue-table-with-tree-grid'

import axios from 'axios'
import md5 from 'js-md5'
axios.defaults.baseURL='http://118.178.89.44:28019/api/v1/admin/'
axios.interceptors.request.use(config =>{
  config.headers.token=window.sessionStorage.getItem('token')
  return config
})

Vue.prototype.$http = axios



Vue.prototype.$md5 = md5

Vue.config.productionTip = false

Vue.component('tree-table',TreeTable)

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
