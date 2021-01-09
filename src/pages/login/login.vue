<template>
	<view class="content">
		<view class="status-bar">
			<!-- 这里是状态栏 -->
		</view>
		<!-- #ifdef APP-PLUS -->
		<!-- <view class="scan-code" @tap="scanCodes()">
			<text class="iconfont">&#xe617;</text>
			<text>扫描电脑端二维码登录</text>
		</view> -->
		<!-- #endif -->

		<view class="login-top">
			<view class="login-title"><text>欢迎来到展立方系统</text></view>
			<view class="uni-form-item uni-column">
				<input type="text" class="uni-input" v-model="userName" placeholder-style="color:rgba(255, 255, 255, 0.65)"
				 placeholder="请输入用户名" />
			</view>
			<view class="uni-form-item uni-column">
				<input type="password" class="uni-input" v-model="passWord" placeholder-style="color:rgba(255, 255, 255, 0.65)"
				 placeholder="请输入密码" />
			</view>
			<view class="uni-form-item uni-column">
				<input type="number" class="uni-input" v-model="confirCode" placeholder-style="color:rgba(255, 255, 255, 0.65)"
				 placeholder="请输入确认码" />
			</view>
		</view>

		<view class="botton-bg">
			<view class="login-button" @tap="login" :loading="isLoading" :class="{ btnactive: isActive }">登录</view>
		</view>
	</view>
</template>

<script>
	import permision from '@/common/permission.js';
	import {
		mapState,
		mapGetters,
		mapMutations
	} from 'vuex'
	export default {
		data() {
			return {
				result: '', //二维码扫码结果
				userName: '',
				passWord: '',
				confirCode: '',
				isabled: true,
				isLoading: false, //点击按钮控制加载动画
				isActive: false
			};
		},
		computed: {
			...mapGetters(['getExhInfo', 'getUserInfo'])
		},
		onLoad(option) {
			var forWord = option['forWord'] || ''
			if (forWord !== '') {	// forWord 有值 将跳转页面
				uni.navigateTo({
					url: forWord
				})
			}
		},
		methods: {
			...mapMutations(['changeExhInfo', 'changeUserInfo']),
			/**
			 * 查询展商信息（获取IP、展商ID）
			 * */
			searchExhInfo() {
				var params = {
					exhibitionCode: this.confirCode,
					// exhibitionCode: '100001',
				}
				uni.showLoading()
				this.$http.searchExhInfo(params).then(res => {
						var code = res.data.code
						if (code !== '0000') {
							this.$util.toast(res.data.msg)
							return
						}
						var data = res.data.data
						if (data == null || !data) {
							this.$util.toast("确认码错误")
							return
						}
						data['exhId'] = data.bid
						data['exhName'] = data.exhibitionName
						this.changeExhInfo(data)
						this.requestLogin()
					})
					.catch(err => {
						uni.hideLoading()
					})
			},
			/**
			 * 登录
			 * */
			requestLogin() {
				var params = {
					grant_type: 'password',
					username: this.userName,
					password: this.passWord,
					// username: 'wmh',
					// password: 'TTec902',
					dbName: this.getExhInfo['databaseName'],
					exhId: this.getExhInfo.exhId
				}
				this.$http.loginApi(params).then(res => {
						uni.hideLoading()
						var code = res.data.code
						if (code === 1501) { // 无权限，跳转选择展会选择其他展会
							var userInfo = res.data.data
							this.noAuthority(userInfo)
							return
						}
						if (code !== 1000) {
							this.$util.toast(res.data.msg)
							return
						}
						var userInfo = res.data.data
						this.changeUserInfo(userInfo)
						this.updateCurrentExh()
						this.currentUserInfo()
						this.$store.dispatch("getExhListRequest", false) 	// 获取展商列表
						this.$store.dispatch("getExhUserList") 				// 获取人员列表
						this.$store.dispatch("getPrivilegeList") 			// 获取权限列表
						uni.switchTab({
							url: '/pages/tabs/home/home'
						})
					})
					.catch(err => {
						uni.hideLoading()
					})
			},
			/**
			 * 无权限处理
			 * */
			noAuthority (userInfo) {
				var exhInfo = {exhId: ''}
				this.changeExhInfo(exhInfo)		// 当前确认码没权限，但是有其他展会权限，将展会ID 置空，直到用户选择完展会才将其赋值
				this.changeUserInfo(userInfo)
				this.currentUserInfo()
				uni.showModal({
					title: "提示",
					content: "您登录的账号未开通当前展会的招展权限，请联系管理员或者切换其他展会。",
					confirmText: "切换展会",
					success: (res) => {
					    if (res.confirm) {
					        uni.navigateTo({
					        	url: '/pages/select-exhibition/select-exhibition'
					        })
					    }
					}
				})
			},
			/* 获取当前用户信息 */
			currentUserInfo() {
				this.$http.getCurrentUserInfo().then(res => {
					let data = res.data
					if (data.code == '1000') {
						this.changeUserInfo(data.data)
					}
				})
			},
			/**
			 * 更新当前-alias
			 * */
			updateCurrentExh () {
				var exhId = this.getExhInfo.exhId
				var alias = this.$util.getPushAlias(this.getUserInfo['access_token'], true)
				var params = {
					exhId: exhId,
					registrationId: alias
				}
				this.$http.upDateCurrentExh(params).then(res => {
					var code = res.data.code
					if (code === 1000) {
						return
					}
					util.toast(res.data.msg)
				})
				.catch(err => {})
			},
			async scanCodes() {
				// #ifdef APP-PLUS
				let status = await this.checkPermission();
				if (status !== 1) {
					return;
				}
				// #endif
				uni.scanCode({
					success: res => {
						this.result = res.result;
					},
					fail: err => {
						// #ifdef MP
						uni.getSetting({
							success: res => {
								let authStatus = res.authSetting['scope.camera'];
								if (!authStatus) {
									uni.showModal({
										title: '授权失败',
										content: '需要使用您的相机，请在设置界面打开相关权限',
										success: res => {
											if (res.confirm) {
												uni.openSetting();
											}
										}
									});
								}
							}
						});
						// #endif
					}
				});
			},
			// #ifdef APP-PLUS

			async checkPermission(code) {
				let status = permision.isIOS ? await permision.requestIOS('camera') : await permision.requestAndroid(
					'android.permission.CAMERA');
				if (status === null || status === 1) {
					status = 1;
				} else {
					uni.showModal({
						content: '需要相机权限',
						confirmText: '设置',
						success: function(res) {
							if (res.confirm) {
								permision.gotoAppSetting();
							}
						}
					});
				}
				return status;
			}, // #endif

			login() {
				uni.hideKeyboard()
				if (!this.isCheckout()) {
					return
				}
				this.searchExhInfo()
			},
			isCheckout() {
				if (!this.isActive) {
					return false;
				}
				if (!this.userName) {
					this.$util.toast('用户名不能为空');
					return false;
				}
				if (!this.passWord) {
					this.$util.toast('密码不能为空');
					return false;
				}
				if (!this.confirCode) {
					this.$util.toast('确认码不能为空');
					return false;
				}
				this.isabled = false;
				return true;
			},
			/* 校验用户信息是否为空 */
			checkout() {
				if (!this.userName) {
					return false;
				}
				if (!this.passWord) {
					return false;
				}
				if (!this.confirCode) {
					return false;
				}

				this.isabled = false;
				this.isActive = true;
				return true;
			}
		},
		watch: {
			userName() {
				if (this.checkout()) {
					this.isabled = false;
				}
			},
			passWord() {
				if (this.checkout()) {
					this.isabled = false;
				}
			},
			confirCode() {
				if (this.checkout()) {
					this.isabled = false;
				}
			}
		}
	};
</script>

<style lang="scss" scoped>
	.content {
		display: flex;
		height: 100vh;
		overflow: hidden;
		flex-direction: column;
		background: linear-gradient(top, #3b9af3, #464bec);
		background: -webkit-linear-gradient(top, #3b9af3, #464bec);
		flex: 1;
		color: #ffffff;
	}

	.scan-code {
		display: flex;
		flex-direction: row;
		margin-top: 70rpx;
		font-size: 24rpx;
		justify-content: center;
		align-items: center;
		align-self: flex-end;
		padding-right: 24rpx;
		align-content: center;
	}

	.iconfont {
		font-size: 38rpx;
		margin-right: 10rpx;
	}

	.login-top {
		padding-left: 82rpx;
		padding-right: 82rpx;
	}

	.login-title {
		font-size: 36rpx;
		padding-top: 146rpx;
		justify-content: flex-start;
		margin-bottom: 80rpx;
	}

	.uni-form-item {
		margin-bottom: 40upx;
		padding: 0;
		border-bottom-style: solid;
		border-bottom-width: 1rpx;
		border-bottom-color: #FFFFFF;
	}

	.uni-input {
		font-size: 30rpx;
		padding: 24rpx 0;
		color: rgba(255, 255, 255, 1);
		background: transparent;
		caret-color: rgba(255, 255, 255, 1);
	}

	.botton-bg {
		display: flex;
		flex-direction: row;
		flex: 1;
		height: 592rpx;
		background: url('~@/static/login/login_bottom.png');
		background-position: bottom;
		background-repeat: no-repeat;
		background-size: 100% 100%;
		justify-content: flex-end;
		padding-top: 50rpx;
		margin-top: 54rpx;
	}

	.login-button {
		display: flex;
		width: 138rpx;
		height: 64rpx;
		font-size: 30upx;
		justify-content: center;
		align-items: center;
		border-radius: 32rpx;
		margin-right: 48rpx;
		border: 1px solid rgba(255, 255, 255, 0.15);
		color: rgba(255, 255, 255, 0.25);
		font-weight: 500;
		background-color: rgba(255, 255, 255, 0.04);
	}

	.btnactive {
		color: rgba(255, 255, 255, 1);
		border: 1px solid rgba(255, 255, 255, 1);
	}
</style>
