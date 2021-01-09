import Vue from 'vue'
import App from './App'
import store from './store'
import http from '@/common/http/'
import json from '@/common/json.js'
import * as filters from  './common/filters.js'

import storage from "./common/storage/storage.js"
import * as util from "./common/util.js"
Vue.prototype.$host = 'https://unidemo.dcloud.net.cn/'

Vue.config.productionTip = false
Vue.prototype.$store = store
Vue.prototype.$http = http
Vue.prototype.$storage = storage
Vue.prototype.$util = util;
Vue.prototype.$json = json;


App.mpType = 'app'
// 定义全局过滤器
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})
const app = new Vue({
  store,
  ...App
})
app.$mount()
