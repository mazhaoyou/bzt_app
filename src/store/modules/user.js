import util from '@/common/util.js';
import storage from "@/common/storage/storage.js";
const user = {
	state:{
		userInfo: "" || storage.getStorage("userInfo"),
		token:"xaaaa"
	},
	 mutations:{
		 /* 登录完成改变用户状态*/
		 changeUserInfo(state, data) {
		 // 	storage.setStorage("userInfo", data);
		 // 	state.userInfo = data;
			var obj = state.userInfo.length === 0 ? {} : state.userInfo
			for (var key in data) {
				obj[key] = data[key]
			}
			state.userInfo = obj
			storage.setStorage("userInfo", obj)
		 },
		 /** 清楚当前状态 */
		 clearUserInfo (state) {
		 	state.userInfo = ''
		 }
	 },
	 getters: {
	 	getUserInfo: state => {
	 		if (state.userInfo === '') {
	 			return {
	 				access_token: '',
	 				expires_in: '',
					token_type: '',
					refresh_token: '',
					stfId: ''
	 			}
	 		}
	 		return state.userInfo
	 	}
	 },
	 actions:{
		 
	 }
}
export default user