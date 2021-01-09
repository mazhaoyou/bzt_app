import Vue from 'vue'
import Vuex from 'vuex'
import user from './modules/user.js'
import exhibitor from './modules/exhibition.js'
import common from './modules/common.js'
import load from './modules/load.js'
Vue.use(Vuex)

const store = new Vuex.Store({
	 modules: {
	    user,
		exhibitor,
		common,
		load
	  }
})

export default store
