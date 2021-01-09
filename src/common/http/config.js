
import storage from '../storage/storage.js';
import store from '../../store/index.js'
import * as util from "../util.js"
/* 加密所需秘钥 */
const secretKey = "lVHtuCOfgXffjNQt";
let loginOutLock = false;		// 退出登录锁, 解决同时请求多个接口401跳转问题
/** 
 * prodUrl: 生产环境BaseURL
 * mockUrl: MOCK环境BaseURL
 * */
let baseUrl = "http://10.20.16.76:5005/api";
let mockUrl = "http://10.20.16.63:3000/mock/26/api";
// var baseUrl = mockUrl
if (process.env.NODE_ENV === 'development') {
	baseUrl = baseUrl
}
export default {
	config: {
		/* 请求接口通用地址 */
		baseUrl: baseUrl,
		/* baseUrl: '', */
		header: {
			'Content-Type': 'application/json',
			// TODO: 测试TOKEN
			/* 'Authorization': 'Bearer P_6VF0T-S5lIF4Oy1RUfrgQlNcgIKDE5K5bPcjbH_cprkWkbOHu0ETw5n4WlSiIPsUZ85jp8xJO6C-chmKShtRBTwkl5sSp3iQ_w9dMec1PbCcLLAZi0beUvkYhvnweg5twdF3u_gOpNmwEBktmw6T-PV6x3-oSj7tgMsVrYOFo2okLg1cGwD_wH_8XLUzcpvI7qt8LvSsX80qDNYpQlVEO9TywBiXnTvaE326c65p5YqG7qtHLPyyKFxGbPygWdqyJZGA_e5Ey2Cl-l89etCmue_zp4iMg0RI3YmBlkz-28YvV2ZIow1kmyHTlj0hWa',
			// TODO: 测试展商ID
			'exhid': 6 */
			'Authorization': '',
			'exhid': ''
		},
		data: {},
		method: "post",
		dataType: "json",
		responseType: "text",
		timeout: 6000,
		success() {},
		fail() {},
		complete() {}
	},
	interceptor: {
		request: null,
		response: null
	},
	request(options) {
		if (!options) {
			options = {}
		}
		/** 动态赋值 */
		let ipUrl = storage.getStorage("exhInfo")['ip'] || ''
		let token = storage.getStorage("userInfo")['access_token'] || ''
		let exhId = storage.getStorage("exhInfo")['exhId'] || 0
		this.config.baseUrl = ipUrl
		this.config.header.Authorization = "Bearer " + token
		this.config.header.exhid = exhId
		
		options.baseUrl = options.baseUrl || this.config.baseUrl
		options.dataType = options.dataType || this.config.dataType
		options.url = options.baseUrl + options.url
		options.method = options.method || this.config.method
		/* 	let [timestamp, jsonKey] = [_currentTime(), jsonSort(options.data)];
			let shaStr = timestamp + "&" + jsonKey + secretKey;
			let secretStr = sha1.hex_sha1(shaStr);
			let reqStr = {
				"timestamp": timestamp,
				"signature": secretStr,
				"data": options.data
			} */
		options.data = options.data || {};
		return new Promise((resolve, reject) => {
			let _config = null

			options.complete = (response) => {
				let statusCode = response.statusCode;
				response.config = _config;
				if (process.env.NODE_ENV === 'development') {
					if (statusCode === 200) {
						//console.log("【" + _config.requestId + "】 结果：" + JSON.stringify(response.data))
					}
				}
				if (this.interceptor.response) {
					let newResponse = this.interceptor.response(response)
					if (newResponse) {
						response = newResponse;
					}
				}
				// 统一的响应日志记录

				_reslog(response)
				if (statusCode === 200) { //成功
					resolve(response);
					// if (response.data.code == "1000" || response.data.code == "0000") {
					// 	resolve(response);
					// } else {
					// 	uni.showToast({
					// 		title: response.data.msg,
					// 		position: 'bottom'
					// 	})
					// }

				} else {
					reject(response)
				}
			}
			options.fail = (response) => {
				uni.showToast({
					title: '网络异常，请检查网络',
					position: 'bottom'
				})
			}

			_config = Object.assign({}, this.config, options)
			_config.requestId = new Date().getTime()
			_config.header = this.config.header
			_config.timeout = 6000

			if (this.interceptor.request) {
				this.interceptor.request(_config)
			}

			// 统一的请求日志记录
			//_reqlog(_config)

			if (process.env.NODE_ENV === 'development') {
				//console.log("【" + _config.requestId + "】 地址：" + _config.url)
				if (_config.data) {
					//console.log("【" + _config.requestId + "】 参数：" + JSON.stringify(_config.data))
				}
			}
			uni.request(_config);
		});
	},
	get(url, data, options) {
		if (!options) {
			options = {}
		}
		options.url = url
		options.data = data
		options.method = 'GET'
		return this.request(options)
	},
	post(url, data, options) {
		if (!options) {
			options = {}
		}
		options.data = data
		options.method = 'POST'
		return this.request(options)
	}
}

/* 加密方法 */
const encrypt = (data) => {
	var sha = sha1.hex_sha1(data);
	return sha;
}
/* 根据请求参数获得key，并且通过升序排序 */
const jsonSort = (data) => {
	let arr = [];
	for (var key in data) {
		arr.push(key.toLowerCase())
	}
	arr.sort();
	let str = '';
	for (var i in arr) {
		str += arr[i] + "&";
	}
	return str;
}
/* 获得当前时间 
 *以getTime形式返回
 */
const _currentTime = () => {
	var timestamp = new Date().getTime();
	return timestamp;
}

/**
 * 日志记录
 */
function _reqlog(req) {
	if (process.env.NODE_ENV === 'development') {
		console.log("【" + req.requestId + "】 地址：" + req.url)
		if (req.data) {
			console.log("【" + req.requestId + "】 请求参数：" + JSON.stringify(req.data))
		}
	}
}

/**
 * 响应接口日志记录
 */
function _reslog(res) {
	let _statusCode = res.statusCode;

	if (process.env.NODE_ENV === 'development') {
		console.log("【" + res.config.requestId + "】 地址：" + res.config.url)
		if (res.config.data) {
			console.log("【" + res.config.requestId + "】 请求参数：" + JSON.stringify(res.config.data))
		}
		console.log("【" + res.config.requestId + "】 响应结果：" + JSON.stringify(res))
	}
	//TODO 除了接口服务错误外，其他日志调接口异步写入日志数据库
	switch (_statusCode) {
		case 200:
			break;
		case 401:
			forLoginOut();
			break;
		case 404:
		case 403:
			statusCode403();
			break;
		case 500:
		case 502:
		case 503:
		case 504:
			statusCode50x();
		case 304:
			break;
		default:
			break;
	}
}
const statusCode403 = () => {

	/* uni.showToast({
		title:"服务器拒绝请求,请联系管理客服",
		icon:"none"
	}) */
}
const statusCode50x = () => {
	uni.showToast({
		title: "服务器拒绝请求,请联系管理客服",
		icon: "none"
	})
}
/* 状态码401 token失效 */
const forLoginOut = () => {
	if (loginOutLock) {
		return
	}
	loginOutLock = true
	uni.hideLoading()
	uni.showToast({
		title: '身份过期,请重新登录',
		position: 'bottom'
	})
	store.commit('clearUserInfo')
	store.commit('clearExh')
	store.commit('loadHome', true)
	store.commit('loadReport', true)
	var clearList = ['userInfo', 'exhInfo', 'exhList', 'provolegeList']
	clearList.forEach((d) => {
		uni.removeStorageSync(d)
	})
	var lockTimer = setTimeout(d => {
		clearInterval(lockTimer)
		loginOutLock = false
	}, 5000)
	uni.redirectTo({
		url: '/pages/login/login',
		animationType: 'none'
	})
}


export {
	jsonSort,
	encrypt,
	_currentTime

}
