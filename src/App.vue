<script>
	import util from "./common/util.js"
	import storage from "./common/storage/storage.js"
	import http from "./common/http/"
	import { mapMutations } from 'vuex'
	import store from './store'
	
	let fristLoad = true
	
	export default {
		onLaunch: function() {
			// #ifdef APP-PLUS
			// 锁定屏幕方向
			plus.screen.lockOrientation('portrait-primary'); //锁定
			// #endif
			this.checkLoginStatus()
		},
		onShow: function() {
			// #ifdef APP-PLUS
			util.versionControlAPI()
			// #endif
			console.log('App Show')
			try{
				const jyJPush = uni.requireNativePlugin('JY-JPush')
				jyJPush.addJYJPushReceiveOpenNotificationListener(result => {			//  监听推送消息点击事件（推送来了以后，手机会有弹窗或通知栏提示，点击消息时，会触发这个方法；并且会进入APP，如果APP进程被杀死也会打开；）
					console.log(JSON.stringify(result));
					this.toPageByPushInfo(result)
				})
				jyJPush.addJYJPushReceiveNotificationListener(result => {				// 监听消息推送事件（后台发送消息，前端即可实时监听接受到消息的内容）
					console.log(JSON.stringify(result));
				})
				jyJPush.getLastPushInfo(result => {										// 监听消息点击事件（APP进程被杀死后，消息还存在通知栏的时候，点击消息会出触发这个方法）
					console.log(JSON.stringify(result))
					this.toPageByPushInfo(result)
				})
				jyJPush.addJYJPushCustomReceiveNotificationListener(result => {			// 监听自定义消息（穿透消息）
					console.log(JSON.stringify(result))
				})
				jyJPush.addJYJPushReceiveBackgroudNotificationListener(result => {
					console.log(JSON.stringify(result))
				})
				plus.runtime.setBadgeNumber(0)											 //  消除小红点
			}catch(e){
				//TODO handle the exception
			}
			var isAuthed = storage.isAuthed()
			if (!fristLoad && isAuthed) {
				store.dispatch("getPrivilegeList")		// 获取权限列表
			}
			fristLoad = false
		},
		onHide: function() {
			console.log('App Hide')
		},
		methods: {
			...mapMutations(['changeUserInfo']),
			toPageByPushInfo (result) {
				var isAuthed = storage.isAuthed()
				if (!isAuthed) {						// 未登录不跳转
					return
				}
				if (result.errorCode == '1') {
					return
				}
				var path = ''
				var stfId = ''
				if (uni.getSystemInfoSync().platform == "ios") {
					path = result.path
					stfId = result.stfId
				}
				if (uni.getSystemInfoSync().platform == "android") {
					var notificationExtras = JSON.parse(result.data.lastPush.notificationExtras)
					path = notificationExtras.path
					stfId = notificationExtras.stfId
				}
				var currentStfId = store.getters.getUserInfo.stfId
				if (stfId != currentStfId) {							// 非当前账号的推送
					return
				}
				// 对比当前路由
				try{
					var pages = getCurrentPages()
					console.log(pages)
					var page = (pages[pages.length - 1]).route
					console.log(path)
					if (path.indexOf(page) !== -1) {
						// 要跳转的页面就是当前页
						uni.redirectTo({
							url: path
						})
						return
					}
					uni.navigateTo({
						url: path
					})
				}catch(e){
					uni.navigateTo({
						url: path
					})
				}
			},
			/**
			 * 检测登录
			 * */
			checkLoginStatus () {
				var isAuthed = storage.isAuthed()
				var exhId = storage.getStorage("exhInfo")['exhId'] || ''
				if (exhId == '' && isAuthed) {	// 如果当前展会ID为空 && 用户已登录 ==> 跳转：登录 => 选择展会
					uni.redirectTo({		//  未登录 跳转登录页面
						url: '/pages/login/login?forWord=/pages/select-exhibition/select-exhibition',
						animationType: 'none'
					})
					return
				}
				if (isAuthed) { // 已登录，更换token
					this.upDateToken()
					return
				}
				uni.redirectTo({		//  未登录 跳转登录页面
					url: '/pages/login/login',
					animationType: 'none'
				})
			},
			/** 更新Token */
			upDateToken () {
				let refreshToken = storage.getStorage("userInfo")['refresh_token'] || ''
				var params = {
					grant_type: 'refresh_token',
					refresh_token: refreshToken
				}
				http.loginApi(params).then(res => {
					var code = res.data.code
					if (code !== 1000) {
						uni.switchTab({
							url: '/pages/login/login'
						})
						return
					}
					var userInfo = res.data.data
					this.changeUserInfo(userInfo)
					uni.switchTab({
						url: '/pages/tabs/home/home'
					})
					store.dispatch("getExhUserList", false) // 获取人员列表
					store.dispatch("getPrivilegeList")		// 获取权限列表
				})
				.catch(err => {
					uni.switchTab({
						url: '/pages/tabs/home/home'
					})
					store.dispatch("getExhUserList", false) // 获取人员列表
					store.dispatch("getPrivilegeList")		// 获取权限列表
				})
			}
		}
	}
</script>

<style>
	@import './common/common.css';

	@font-face {
		font-family: iconfont;
		font-weight: normal;
		font-style: normal;
		src: url('https://at.alicdn.com/t/font_1503209_44ahpf3yvgu.ttf') format('truetype');
	}

	.iconfont {
		font-family: iconfont;
		font-size: 26upx;
	}
	/* #ifdef APP-PLUS-NVUE */
	.status-bar {
		height: var(--status-bar-height);
		width: 100%;
	}
	.uni-ellipsis {overflow: hidden; white-space: nowrap; text-overflow: ellipsis;}

	/* #endif */
	
</style>
