import util from '@/common/util.js';
import storage from "@/common/storage/storage.js";
import http from "@/common/http/index.js";
const exh = {
	state: {
		exhInfo: '' || storage.getStorage("exhInfo"),
		exhList: '' || storage.getStorage("exhList"),
	},
	mutations: {
		/* 修改当前展商状态 */
		changeExhInfo(state, data) {
			var obj = state.exhInfo.length === 0 ? {} : state.exhInfo
			for (var key in data) {
				obj[key] = data[key]
			}
			state.exhInfo = obj
			storage.setStorage("exhInfo", obj)
		},
		/** 修改当前展商列表 */
		changeExhList(state, data) {
			state.exhList = data
			storage.setStorage("exhList", data)
		},
		/** 清除当前状态 */
		clearExh(state) {
			state.exhInfo = {
				exhName: '',
				exhId: '',
				ip: ''
			}
			state.exhList = ''
		}
	},
	getters: {
		getExhInfo: state => {
			if (state.exhInfo == '') {
				return {
					exhName: '',
					exhId: '',
					ip: ''
				}
			}
			return state.exhInfo
		},
		getExhList: state => {
			if (!state.exhList) {
				return []
			}
			return state.exhList
		}
	},
	actions: {
		/**
		 *  获取展会列表
		 *  @param {Bool} showLoading : 是否展示loading
		 * */
		getExhListRequest(context, showLoading) {
			if (showLoading) {
				uni.showLoading()
			}
			http.getExhibitionList().then(res => {
					if (showLoading) {
						uni.hideLoading()
					}
					var code = res.data.code
					if (code !== 1000) {
						util.toast(res.data.msg)
						return
					}
					context.commit("changeExhList", res.data.data);
				})
				.catch(err => {
					if (showLoading) {
						uni.hideLoading()
					}
				})
		},
	}
}
export default exh
