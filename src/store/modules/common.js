import util from '@/common/util.js';
import storage from "@/common/storage/storage.js";
import http from "@/common/http/index.js";
const user = {
	state: {
		countryList: "" || storage.getStorage("countryList"), //国家
		provinceList: "" || storage.getStorage("provinceList"), //身份
		cityList: "" || storage.getStorage("cityList"), //城市
		countyList: "" || storage.getStorage("countyList"), //县城
		priceTypesList: [], //价格类型
		boothTypesList: [], //展位类型
		roomsList: [], // 展厅
		exhUserList: [], // 展会人员列表
		privilegeList: "" || storage.getStorage("provolegeList"), // 权限列表

	},
	mutations: {
		/* 改变国家*/
		changeCountryList(state, data) {
			storage.setStorage("countryList", data);
			state.countryList = data;
		},
		/* 改变省份*/
		changeProvinceList(state, data) {
			storage.setStorage("provinceList", data);
			state.provinceList = data;
		},
		/* 改变城市*/
		changeCityList(state, data) {
			storage.setStorage("cityList", data);
			state.cityList = data;
		},
		/* 改变县城*/
		changeCountyList(state, data) {
			storage.setStorage("countyList", data);
			state.countyList = data;
		},
		/* 展厅*/
		changeRoomsList(state, data) {
			state.roomsList = data;
		},
		/* 展位类型*/
		changeBoothTypes(state, data) {
			state.boothTypesList = data;
		},
		/*价格类型*/
		changePriceTypes(state, data) {
			state.priceTypesList = data;
		},
		/* 人员列表 */
		changeExhUserList(state, data) {
			state.exhUserList = data;
		},
		/** 权限列表 */
		changePrivilegeList(state, data) {
			storage.setStorage("provolegeList", data);
			state.privilegeList = data
		}
	},
	getters: {
		/* 获得价格类型 */
		getPriceList: state => {
			return state.priceTypesList;
		},
		getRoomsList: state => {
			return state.roomsList
		},
		getExhUserList: state => {
			return state.exhUserList
		},
		getProvolegeList: state => {
			return state.privilegeList
		}
	},
	actions: {
		/* 获得城市 */
		getCountry(context) {
			http.getCountry().then(res => {
				let data = res.data;
				if (data.code == "1000") {
					context.commit("changeCountryList", data.data);
				}
			})
		},
		/* 获得省份 */
		getProvince(context, args) {
			let data = {
				country: args.country
			}
			http.getProvince(data).then(res => {
				let data = res.data;
				if (data.code == "1000") {
					context.commit("changeProvinceList", data.data);
				}
			})
		},
		/* 获得城市 */
		getCity(context, args) {
			let data = {
				province: args.province
			}
			http.getCity(data).then(res => {
				let data = res.data;
				if (data.code == "1000") {
					context.commit("changeCityList", data.data);
				}
			})
		},
		/* 获得县城*/
		getCounty(context, args) {
			let data = {
				city: args.city
			}
			http.getInfoCi(data).then(res => {
				let data = res.data;
				if (data.code == "1000") {
					context.commit("changeCountyList", data.data);
				}
			})
		},
		/* 获得位类型/价格类别/展馆/展厅*/
		getExhBasicList(context) {
			http.getExhBasicInfo().then(res => {
				let data = res.data;
				if (data.code == "1000") {
					context.commit("changePriceTypes", data.data.priceTypes);
					let rooms = [{
						srmId:0,
						srmName: "不限"
					}]
					rooms = [...rooms,...data.data.pavilions[0].rooms]
					context.commit("changeRoomsList",rooms);
				}
			})
		},
		/**
		 * 获取人员列表
		 * @param {Bool} loading : 是否需要使用loading
		 * */
		getExhUserList(context, loading = false) {
			var params = {
				pageSize: 10000,
				pageIndex: 1
			}
			if (loading) {
				uni.showLoading()
			}
			http.getExhUserList(params).then(res => {
					if (loading) {
						uni.hideLoading()
					}
					var code = res.data.code
					if (code !== 1000) {
						util.toast(res.data.msg)
						return
					}
					let userInfo = [{
						userId: '',
						userName: "所有可见数据",
						userType: 1
					}];
					userInfo = [...userInfo, ...res.data.data];
					context.commit("changeExhUserList", userInfo)
				})
				.catch(err => {
					if (loading) {
						uni.hideLoading()
					}
				})
		},
		/**
		 * 获取权限列表
		 * */
		getPrivilegeList(context) {
			http.getPrivilegeList().then(res => {
					var code = res.data.code
					if (code !== 1000) {
						util.toast(res.data.msg)
						return
					}
					var data = res.data.data
					var privilegeMap = {}
					data.forEach((item) => {
						/* console.log( new String(item.privilegeCode) instanceof Number) */
						privilegeMap[item.privilegeCode] = item.privilegeName
						privilegeMap['p' + item.privilegeCode] = item.privilegeName
					})
					context.commit("changePrivilegeList", privilegeMap)
				})
				.catch(err => {})
		}
	}
}
export default user
