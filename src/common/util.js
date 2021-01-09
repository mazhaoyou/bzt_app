import http from "@/common/http/"
import storage from "@/common/storage/storage.js"
import store from "@/store/"
import md5 from "./md5.js"
/* 时间格式化 */
function formatTime(time) {
	if (typeof time !== 'number' || time < 0) {
		return time
	}

	var hour = parseInt(time / 3600)
	time = time % 3600
	var minute = parseInt(time / 60)
	time = time % 60
	var second = time

	return ([hour, minute, second]).map(function(n) {
		n = n.toString()
		return n[1] ? n : '0' + n
	}).join(':')
}

function formatLocation(longitude, latitude) {
	if (typeof longitude === 'string' && typeof latitude === 'string') {
		longitude = parseFloat(longitude)
		latitude = parseFloat(latitude)
	}

	longitude = longitude.toFixed(2)
	latitude = latitude.toFixed(2)

	return {
		longitude: longitude.toString().split('.'),
		latitude: latitude.toString().split('.')
	}
}
var dateUtils = {
	UNITS: {
		'年': 31557600000,
		'月': 2629800000,
		'天': 86400000,
		'小时': 3600000,
		'分钟': 60000,
		'秒': 1000
	},
	humanize: function(milliseconds) {
		var humanize = '';
		for (var key in this.UNITS) {
			if (milliseconds >= this.UNITS[key]) {
				humanize = Math.floor(milliseconds / this.UNITS[key]) + key + '前';
				break;
			}
		}
		return humanize || '刚刚';
	},
	format: function(dateStr) {
		var date = this.parse(dateStr)
		var diff = Date.now() - date.getTime();
		if (diff < this.UNITS['天']) {
			return this.humanize(diff);
		}
		var _format = function(number) {
			return (number < 10 ? ('0' + number) : number);
		};
		return date.getFullYear() + '/' + _format(date.getMonth() + 1) + '/' + _format(date.getDay()) + '-' +
			_format(date.getHours()) + ':' + _format(date.getMinutes());
	},
	parse: function(str) { //将"yyyy-mm-dd HH:MM:ss"格式的字符串，转化为一个Date对象
		var a = str.split(/[^0-9]/);
		return new Date(a[0], a[1] - 1, a[2], a[3], a[4], a[5]);
	}
};
/* 判断json数组是否相等 */
const contrastArray = (array1, array2) => {
	if (!array1 || !array2) {
		return false;
	}
	if (array1.length != array2.length) {
		return false;
	}
	if (JSON.stringify(array1) != JSON.stringify(array2)) {
		return false;
	}
	for (var i = 0, l = array1.length - 1; i < l; i++) {
		if (Array.isArray(array1) && Array.isArray(array2)) {
			if (!array1[i] === (array2[i])) {
				return false;
			}
		}
	}
	return true;
}
/*
 * JSON数组去重
 * @param: [array] json Array
 * @param: [string] 唯一的key名，根据此键名进行去重
 */

const uniqueArray = (array, key) => {
	let rarray = [];
	let tjson = {};
	array.map(function(item) {
		if (typeof item == 'object') {
			if (!tjson[item[key]]) {
				tjson[item[key]] = true;
				rarray.push(item);
			}
		} else {
			if (!tjson[item]) {
				tjson[item] = true;
				rarray.push(item);
			}
		}
	})
	return rarray;
}

/* 获取当前时间戳 */
const getUnix = () => {
	var date = new Date();
	return date.getTime();
}

/* 获取今天0点0分0秒的时间戳 */
const getTodayUnix = () => {
	var date = new Date();
	date.setHours(0);
	date.setMinutes(0);
	date.setSeconds(0);
	date.setMilliseconds(0);
	return date.getTime();
}

/* 获取今年1月1日0点0分0秒的时间戳 */
const getYearUnix = () => {
	var date = new Date();
	date.setMonth(0);
	date.setDate(1);
	date.setHours(0);
	date.setMinutes(0);
	date.setSeconds(0);
	date.setMilliseconds(0);
	return date.getTime();
}

/* 获取标准年月日 */
const getLastDate = (time) => {
	var date = new Date(parseInt(time));
	var month = date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1;
	var day = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
	return date.getFullYear() + '/' + month + "/" + day;
}

/* 
	转换消息时间直接调用此函数
	调用此方法就可以转换
*/
const getFormatTime = (timestamp) => {
	var now = getUnix(); //当前时间戳
	var today = getTodayUnix(); //今天0点时间戳
	var year = getYearUnix(); //今年0点时间戳
	var timer = (now - timestamp) / 1000; // 转换为秒级时间戳
	var tip = '';

	if (timer <= 0) {
		tip = '刚刚';
	} else if (Math.floor(timer / 60) <= 0) {
		tip = '刚刚';
	} else if (timer < 3600) {
		tip = Math.floor(timer / 60) + '分钟前';
	} else if (timer >= 3600 && (timestamp - today >= 0)) {
		tip = Math.floor(timer / 3600) + '小时前';
	} else if (timer / 86400 <= 31) {
		tip = Math.ceil(timer / 86400) + '天前';
	} else {
		tip = getLastDate(timestamp);
	}
	return tip;
}
/* 
	轮播图跳转 
	index:图片索引
	type:跳转类型 0无跳转 1内链非tarBar 2外链 3内部链接tarBar
	url: 图片链接
*/
const bannerLink = (index, type, url, _this) => {
	if (type == 0) {
		// 不跳转
		return false;
	} else if (type == 1) {
		// 跳转到非tarBar页面
		uni.navigateTo({
			url: url
		});
	} else if (type == 2) {
		// 跳转到外部链接
		uni.navigateTo({
			url: '/pages/banner-external-link/banner-external-link?externalLink=' + url
		})
	} else if (type == 3) {
		// 跳转到tabBar页面
		uni.switchTab({
			url: url
		})
	} else if (type == 4) {
		let data = {
			activityNo: url
		}
		_this.$api.getActivityId(data)
			.then(res => {
				res = res.data;
				if (res.code == '0001') {
					let activityId = res.data.activityId;
					let snapshotId = res.data.snapshotId;

					if (activityId && snapshotId) {
						uni.navigateTo({
							url: '/pages/auction-detailsed/auction-detailsed?activityId=' + activityId + '&snapshotId=' + snapshotId
						})
					} else {
						uni.navigateTo({
							url: '/pages/auction-detailsing/auction-detailsing?activityId=' + activityId
						})
					}
				} else {
					uni.showToast({
						title: res.message,
						icon: 'none'
					})
				}
			})
			.catch(err => {

			})
	}
}
/* 
	改变收藏关注状态函数
	status 2 已关注  1未关注 
	tips 0不提示 1提示
	_this 对应页面this
*/
const getFollow = (status, tips, _this) => {
	// #ifdef APP-PLUS
	let currentWebview = _this.$mp.page.$getAppWebview();
	// #endif
	if (currentWebview) {
		if (status == 1) {
			currentWebview.setTitleNViewButtonStyle(0, {
				text: '\ue61b'
			});

			if (tips == 1) {
				uni.showToast({
					title: "您已取消关注",
					icon: 'none',
					duration: 2000
				});
			}
		} else if (status == 2) {
			currentWebview.setTitleNViewButtonStyle(0, {
				text: '\ue666'
			});
			if (tips == 1) {
				uni.showToast({
					title: "您已关注",
					icon: 'none',
					duration: 2000
				});
			}
		}
	}
}

// 计算剩余开始时间的天数
const getDaysNum = (currentTime, endTime) => {
	//计算出相差天数
	let dateDiff = Number(endTime) - Number(currentTime);
	// console.log(dateEnd.getTime(),dateBegin.getTime())
	let days = parseInt(dateDiff / (24 * 3600 * 1000));
	//计算出小时数
	let leave1 = dateDiff % (24 * 3600 * 1000); //计算天数后剩余的毫秒数
	let hours = Math.floor(leave1 / (3600 * 1000));
	//计算相差分钟数
	let leave2 = leave1 % (3600 * 1000); //计算小时数后剩余的毫秒数
	let minutes = Math.floor(leave2 / (60 * 1000)) < 10 ? '0' + Math.floor(leave2 / (60 * 1000)) : Math.floor(leave2 / (
		60 * 1000));
	//计算相差秒数
	let leave3 = leave2 % (60 * 1000); //计算分钟数后剩余的毫秒数
	let seconds = Math.round(leave3 / 1000) < 10 ? '0' + Math.round(leave3 / 1000) : Math.round(leave3 / 1000);
	let time = {
		days,
		hours,
		minutes,
		seconds
	};
	return time;
}

const getNowTime = () => {
	var date = new Date();
	var month = date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1;
	var day = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
	return date.getFullYear() + month + day;
}

const formatDate = (date, fmt) => {
	if (!date || date == null) {
		return '无';
	}
	date = date.replace(/-/g, '/')
	var date = new Date(date);

	if (fmt == 0) {
		fmt = "yyyy-MM-dd hh:mm:ss"
	} else if (fmt == 1) {
		fmt = "yyyy-MM-dd"
	} else if (fmt == 2) {
		fmt = "hh:mm:ss"
	} else if (fmt == 3) {
		fmt = "yyyy年MM月dd日 hh时mm分ss秒"
	} else if (fmt == 4) {
		fmt = "yyyy年MM月dd日"
	} else if (fmt == 5) {
		fmt = "hh时mm分ss秒"
	} else if (fmt == 6) {
		fmt = "yyyy年MM月"
	} else if (fmt == 7) {
		fmt = "yyyy"
	} else if (fmt == 8) {
		fmt = "yyyy/MM/dd"
	} else if (fmt == 9) {
		fmt = "hh:mm"
	} else if (fmt == 10) {
		fmt = "MM-dd hh:mm"
	} else if (fmt == 11) {
		fmt = "yyyy.MM.dd hh:mm"
	} else if (fmt == 12) {
		fmt = "yyyy.MM.dd"
	}
	if (/(y+)/.test(fmt)) {
		fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
	}
	let o = {
		'M+': date.getMonth() + 1,
		'd+': date.getDate(),
		'h+': date.getHours(),
		'm+': date.getMinutes(),
		's+': date.getSeconds()
	};
	for (let k in o) {
		if (new RegExp(`(${k})`).test(fmt)) {
			let str = o[k] + '';
			fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? str : padLeftZero(str));
		}
	}
	return fmt;
};

/* 将时间戳转为 数组  2018','09','10','12','48','45' */
const timestampToArr = (timestamp) => {
	console.log(timestamp)
	let date = new Date(timestamp);
	let Y = date.getFullYear();
	let M = padding0(date.getMonth() + 1, 2);
	let D = padding0(date.getDate(), 2);
	let h = padding0(date.getHours(), 2);
	let m = padding0(date.getMinutes(), 2);
	let s = padding0(date.getSeconds(), 2);
	let result = Y + ',' + M + ',' + D + ',' + h + ',' + m + ',' + s
	let arr = [Y, M, D, h, m, s]
	return arr;
}

const padding0 = (num, length) => {
	for (var len = (num + "").length; len < length; len = num.length) {
		num = "0" + num;
	}
	return num;
}

/* 一位数两位数转换 */
let padLeftZero = (str) => {
	return ('00' + str).substr(str.length);
};

/** 转换千分符 */
const toQF = (num) => {
	num = num + ''
	num = num.replace(/[ ]/g, '')
	if (num === '') {
		return
	}
	if (isNaN(num)) {
		return
	}
	var index = num.indexOf('.')
	var reg = /(-?\d+)(\d{3})/
	if (index === -1) {
		while (reg.test(num)) {
			num = num.replace(reg, '$1,$2')
		}
	} else {
		var intPart = num.substring(0, index)
		var pointPart = num.substring(index + 1, num.length)
		while (reg.test(intPart)) {
			intPart = intPart.replace(reg, '$1,$2')
		}
		num = intPart + '.' + pointPart
	}
	return num
}

/** 浅copy */
const copy = (initalObj) => {
	var obj = {}
	for (var i in initalObj) {
		obj[i] = initalObj[i]
	}
	return obj
}

/** 浅copy-Array */
const copyArray = (initalObj) => {
	var obj = []
	for (var i in initalObj) {
		obj[i] = initalObj[i]
	}
	return obj
}

/** 深拷贝 */
const deepClone = (obj) => {
	var _obj = JSON.stringify(obj)
	var objClone = new Date(JSON.parse(_obj))
	return objClone
}

/** 最简单数组去重法 */
const duplicateRemove = (array) => {
	var n = []
	for (var i = 0; i < array.length; i++) {
		if (n.indexOf(array[i]) === -1) n.push(array[i])
	}
	return n
}

/** 展示popup框
 *  title：标题
 *  content：内容
 */
const showPop = (title, content) => {
	// #ifdef APP-PLUS
	uni.$emit('page-popup', {
		title: title,
		content: content
	});
	const subNVue = uni.getSubNVueById('popup')
	subNVue.show('slide-in-top', 250)
	// #endif
}

/**
 * 版本控制
 * */
const versionControlAPI = () => {
	plus.runtime.getProperty(plus.runtime.appid, function(widgetInfo) {
		var type = 3
		if (uni.getSystemInfoSync().platform == "ios") {
			type = 1
		}
		if (uni.getSystemInfoSync().platform == "android") {
			type = 2
		}
		var params = {
			version: widgetInfo.version,
			type: type
		}
		http.versionControl(params).then(res => {
				var data = res.data.data
				var versioncode = data.versioncode
				var update = data.update
				var updateflag = data.updateflag		// -1: 不需要更新 0: 非强制整包更新 1: 强制整包更新 2: 非强制热更新
				if (!update) {
					return
				}
				if (updateflag == 0) {	//	非强制整包更新
					updateApp(data.pkgUrl, data.versionDesc, false, versioncode)
				}
				if (updateflag == 1) {	//	强制整包更新
					updateApp(data.pkgUrl, data.versionDesc, true, versioncode)
				}
				if (updateflag == 2) {	//	非强制热更新
					fix(data.wgtUrl)
				}
			})
			.catch(err => {})
	})
}

/**
 * 整包更新逻辑
 * */
const updateApp = (url, desc, force, version) => {
	var modalOption = {
		content: desc,
		confirmText: "确定",
		showCancel: false,
		success: (params) => {
			console.log(params)
			if (params.confirm) {
				plus.runtime.openURL(url)
			}
		}
	}
	if (force == false) {	// 非强制更新
		modalOption['showCancel'] = true
	}
	var tag = force ? "force" : 'unforce'
	var updateUrl = url + '/' + version + '/' + tag
	var lastUrl = storage.getStorage('UPDATEURL', 2)
	if (updateUrl === lastUrl) {		// 是否展示model框
		return
	}
	if (force == false) {				// 非强制更新 只弹一次 更新弹框
		storage.setStorage('UPDATEURL', updateUrl, 2)
	}
	uni.showModal(modalOption)
}

/** 
 * 处理fix更新包
 * */
const fix = (fixUrl) => {
	var lastUrl = storage.getStorage('FIXURL', 2)
	// 跟上次记录的URL进行比较
	if (lastUrl === fixUrl) {
		return
	}
	uni.downloadFile({
		url: fixUrl,
		success: (downloadResult) => {
			if (downloadResult.statusCode === 200) {
				plus.runtime.install(downloadResult.tempFilePath, {
					force: false
				}, function() {
					console.log('install success...');
					storage.setStorage('FIXURL', fixUrl, 2)
					plus.runtime.restart();
				}, function(e) {
					console.error('install fail...');
				});
			}
		},
	})
}
/* Toast提示框
 *title：提示内容 duration：显示时长 position：显示位置 支持 top、center、bottom
 */
const toast = (title, duration = "1500", position = "bottom") => {
	uni.showToast({
		title: title,
		icon: "none",
		position: position
	})
}
/* 弹出框 类型 alert */
const showModal = (title ="",content="暂无该权限",confirmCallack=null,cancelCallack=null) => {
	if(!title){
		title = "B展通";
	}
	uni.showModal({
	    title:title,
	    content: content,
		showCancel:false,
	    success: function (res) {
	        if (res.confirm) {
	            confirmCallack();
	        } else if (res.cancel) {
				 if (cancelCallack) {
				 	cancelCallack();
				 } else {
					 confirmCallack();
				 }
	            
	        }
	    }
	});
}

function friendlyDate(timestamp) {
	var formats = {
		'year': '%n% 年前',
		'month': '%n% 月前',
		'day': '%n% 天前',
		'hour': '%n% 小时前',
		'minute': '%n% 分钟前',
		'second': '%n% 秒前',
	};

	var now = Date.now();
	var seconds = Math.floor((now - timestamp) / 1000);
	var minutes = Math.floor(seconds / 60);
	var hours = Math.floor(minutes / 60);
	var days = Math.floor(hours / 24);
	var months = Math.floor(days / 30);
	var years = Math.floor(months / 12);

	var diffType = '';
	var diffValue = 0;
	if (years > 0) {
		diffType = 'year';
		diffValue = years;
	} else {
		if (months > 0) {
			diffType = 'month';
			diffValue = months;
		} else {
			if (days > 0) {
				diffType = 'day';
				diffValue = days;
			} else {
				if (hours > 0) {
					diffType = 'hour';
					diffValue = hours;
				} else {
					if (minutes > 0) {
						diffType = 'minute';
						diffValue = minutes;
					} else {
						diffType = 'second';
						diffValue = seconds === 0 ? (seconds = 1) : seconds;
					}
				}
			}
		}
	}
	return formats[diffType].replace('%n%', diffValue);
}

/**
 * 获取任意时间
 * date: 参考时间
 * AddDayCount: 间隔数 
 * str: 间隔类型 : day/week/month/year
 * symbol: 日期间隔符号
 */
function getBeforeDate(date, AddDayCount = 0, str = 'day', symbol = '-') {
	if (typeof date !== 'object') {
		date = date.replace(/-/g, '/')
	}
	const dd = new Date(date)
	switch (str) {
		case 'day':
			dd.setDate(dd.getDate() + AddDayCount) // 获取AddDayCount天后的日期
			break
		case 'week':
			dd.setDate(dd.getDate() + AddDayCount * 7) // 获取AddDayCount天后的日期
			break
		case 'month':
			dd.setMonth(dd.getMonth() + AddDayCount) // 获取AddDayCount天后的日期
			break
		case 'year':
			dd.setFullYear(dd.getFullYear() + AddDayCount) // 获取AddDayCount天后的日期
			break
	}
	const y = dd.getFullYear()
	const m = dd.getMonth() + 1 < 10 ? '0' + (dd.getMonth() + 1) : dd.getMonth() + 1 // 获取当前月份的日期，不足10补0
	const d = dd.getDate() < 10 ? '0' + dd.getDate() : dd.getDate() // 获取当前几号，不足10补0
	return y + symbol + m + symbol + d
}

/**
 * 格式化时间
 * timestamp: 需要格式化的时间戳
 * symbol: 日期间隔符号
 * */
function formatByDayTimeStamp(timestamp, symbol = '-') {
	var time = new Date(timestamp)
	var y = time.getFullYear()
	var m = time.getMonth() + 1
	var d = time.getDate()
	return y + symbol + add0(m) + symbol + add0(d)
}

function add0(m) {
	return m < 10 ? '0' + m : m
}

/**
 * 设置推送别名
 * @param {String} userid 用户ID
 * @param {Bool}  reset 是否重置 默认false(不重置)
 */
function getPushAlias(userid, reset = false) {
	// 直接获取alias
	if (!reset) {
		var alias = ''
		try {
			alias = storage.getStorage('alias', 2)
		} catch (e) {}
		return alias
	}
	// 重置alias
	var resetAlias = md5(userid + '-' + new Date().getTime());
	const jyJPush = uni.requireNativePlugin('JY-JPush');
	try {
		storage.clearCloneStorage('alias')
		// 删除alias
		jyJPush.deleteJYJPushAlias({}, result => {
			// 设置alias
			console.log("[ 删除别名 ]:" + JSON.stringify(result))
			jyJPush.setJYJPushAlias({
				userAlias: resetAlias
			}, result => {
				console.log("[ 设置别名 ]:" + JSON.stringify(result))
			})
		})
	} catch (e) {}
	storage.setStorage('alias', resetAlias, 2)
	return resetAlias
}

/*校验手机号*/
const checkoutPhone = (phone) => {
	let regEx = /^1[3|4|5|6|7|8|9]\d{9}$/;
	if (!regEx.test(phone)) {
		toast('手机号格式不正确');
		return false;
	}
	return true;
}

/* 校验身份证号 */
const checkoutCardNo = (card) => {
	let reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
	if (!reg.test(card)) {
		toast("身份证号格式不正确");
		return false;
	}
	return true
}
/* 校验邮箱 */
const checkoutEmail = (email) => {
	let reg = /\w[-\w.+]*@([A-Za-z0-9][-A-Za-z0-9]+\.)+[A-Za-z]{2,14}/;
	if (!reg.test(email) && email) {
		toast('邮箱格式不正确');
		return false;
	}
	return true
}


/**
 * 空字段保护
 * @param {any} field 需要检测的字段
 * @param {any} pField 待替换字段
 * */
const fieldProtaction = (field, pField) => {
	if (!field) {
		if (pField || pField == 0){
			return pField
		} else {
			return "无"
		}
	}
	return field
}


/**
 * 退出登录
 * */
function loginOut() {
	http.logoutApi().then(res => {}).catch(err => {})
	store.commit('clearUserInfo')
	store.commit('clearExh')
	store.commit('loadHome', true)
	store.commit('loadReport', true)
	var clearList = ['userInfo', 'exhInfo', 'exhList', 'provolegeList']
	clearList.forEach((d) => {
		uni.removeStorageSync(d)
	})
	uni.redirectTo({
		url: '/pages/login/login',
		animationType: 'none'
	})
}
/* 钱格式化，保留两位小数 */
 const toDecimal2 = (x = 0) => {
	let fs = parseFloat(x);
	if (isNaN(fs)) {
		return 0.00;
	}
	if(fs <= 0) {
		return 0.00;
	}
	let f = Math.round(x * 100) / 100;
	let s = f.toString();
	let rs = s.indexOf('.');
	if (rs < 0) {
		rs = s.length;
		s += '.';
	}
	while (s.length <= rs + 2) {
		s += '0';
	}
	return s;
}

/**
 * 获取权限
 * @param {string} pid : 权限ID
 * @return {Bool} true: 有权限 false: 没有该权限
 * IDMap:
 * {
    "p20000":"展商",
    "p30000":"报表",
    "p1000001":"首页.查看最近一周待办事项",
    "p1000002":"首页.查看数据概要",
    "p2000001":"展商.展商列表",
    "p3000001":"报表.展商统计",
    "p3000002":"报表.展位统计",
    "p3000003":"报表.合同统计",
    "p3000004":"报表.业绩统计",
    "p4000001":"我的.合同管理",
    "p200000101":"展商.展商列表.新增",
    "p200000201":"展商.展商列表.展商信息中心.资料",
    "p200000202":"展商.展商列表.展商信息中心.联络",
    "p200000203":"展商.展商列表.展商信息中心.合同",
    "p200000204":"展商.展商列表.展商信息中心.付款",
    "p200000205":"展商.展商列表.展商信息中心.预订",
    "p20000020101":"展商.展商列表.展商信息中心.资料.编辑",
    "p20000020102":"展商.展商列表.展商信息中心.资料.新增联络人",
    "p20000020201":"展商.展商列表.展商信息中心.联络.新增",
    "p20000020202":"展商.展商列表.展商信息中心.联络.新增联络人",
    "p20000020501":"展商.展商列表.展商信息中心.预订.预订展位",
    "p2000002050101":"展商.展商列表.展商信息中心.预订.预订展位.新增展位",
    "p20000020502":"展商.展商列表.展商信息中心.预订.服务预订"
}
 * */
const getPrivilegeById = (pid) => {
	var privilegeMap = store.getters.getProvolegeList
	return privilegeMap.hasOwnProperty(pid)
}

/**
 * 防抖
 * @param {function} fn  	调用函数
 * @param {number}   wait   等待时间
 * */
const debounce = (fn, wait) => {
    let timeout = null
    return function() {
        if(timeout !== null) {
			clearTimeout(timeout)
		}
        timeout = setTimeout(fn, wait)
    }
}

module.exports = {
	getUnix,
	getTodayUnix,
	getYearUnix,
	getLastDate,
	formatTime,
	formatLocation,
	dateUtils,
	contrastArray,
	uniqueArray,
	getFormatTime,
	bannerLink,
	getFollow,
	getDaysNum,
	getNowTime,
	formatDate,
	toQF,
	copy,
	copyArray,
	deepClone,
	duplicateRemove,
	showPop,
	versionControlAPI,
	toast,
	friendlyDate,
	getBeforeDate,
	formatByDayTimeStamp,
	getPushAlias,
	timestampToArr,
	loginOut,
	checkoutPhone,
	checkoutCardNo,
	checkoutEmail,
	fieldProtaction,
	toDecimal2,
	getPrivilegeById,
	showModal,
	debounce
}
