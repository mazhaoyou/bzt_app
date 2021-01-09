import util from '@/common/util.js';
import storage from "@/common/storage/storage.js";
const load = {
	state: {		// 记录需要刷新状态 例: home === true —— 首页需要刷新
		home: false,
		report: false
	},
	mutations: {
		/**
		 * 刷新首页
		 * @param {Bool} need 是否需要刷新首页 true: 刷新 false: 不刷新
		 * */
		loadHome(state, need) {
			state.home = need
		},
		/**
		 * 刷新报表
		 * @param {Bool} need 是否需要刷新报表 true: 刷新 false: 不刷新
		 * */
		loadReport(state, need) {
			state.report = need
		}
	},
	getters: {
		/**
		 * 是否刷新首页 true: 刷新 false: 不刷新
		 * */
		needLoadHome: state => {
	 		return state.home
	 	},
		/**
		 * 是否刷新报表 true: 刷新 false: 不刷新
		 * */
		needLoadReport: state => {
			return state.report
		}
	},
	actions: {}
}
export default load
