<template>
	<view class="container">
		<!-- #ifdef APP-PLUS -->
		<view class="status-bar">
			<!-- 这里是状态栏 -->
		</view>
		<view class="nav-bar">选择展会</view>
		<!-- #endif -->
		<view class="select-content">
			<view class="select-title">
				<text class="select-number-Ex">请选择账号</text>
				<text class="select-number">{{getUserInfo.stfFullName}}</text>
				<text class="select-number-Ex">管理的展会</text>
			</view>
			<view class="select-container">
				<view class="select-items" @tap="selectEvent(item)" v-for="item in getExhList" :key="item.exhId">
					<text class="select-item" :class="{ active: item.exhId == exhInfo.exhId }">{{ item.exhName }}</text>
					<text class="iconfont" v-if="item.exhId == exhInfo.exhId">&#xe652;</text>
				</view>
			</view>
			<view class="login-bottom"><text class="login-button" @tap="login" :class="{'btnactive': checkout()}">确定</text></view>
		</view>
		<view class="botton-bg"></view>
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
				exhInfo: {
					exhId: ''
				},
			};
		},
		computed: {
			...mapGetters(['getExhInfo', 'getExhList', 'getUserInfo'])
		},
		onLoad(option) {
			this.$store.dispatch("getExhListRequest", true) // 获取展商列表
		},
		methods: {
			...mapMutations(['changeExhInfo', 'changeUserInfo']),
			/* 选展会操作 */
			selectEvent(item) {
				this.exhInfo = item
			},
			/**
			 * 登录
			 * */
			login() {
				if (!this.checkout()) {
					this.$util.toast("请选择展会")
					return
				}
				this.changeExhInfo(this.exhInfo)
				this.undateCurrentExh()
				this.$store.dispatch("getExhUserList", false) // 获取人员列表
				this.$store.dispatch("getPrivilegeList") 	  // 获取权限列表
				uni.switchTab({
					url: '/pages/tabs/home/home'
				})
			},
			/**
			 * 更新-展会信息
			 * */
			undateCurrentExh() {
				var exhId = this.exhInfo.exhId
				var accessToken = this.getUserInfo.access_token
				var alias = this.$util.getPushAlias(accessToken, true)
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
			/* 校验用户信息是否为空 */
			checkout() {
				if (this.exhInfo.exhId == '') {
					return false
				}
				return true
			}
		},
		watch: {}
	};
</script>

<style scoped>
	.container {
		display: flex;
		height: 100vh;
		flex-direction: column;
		background: linear-gradient(top, #3b9af3, #464bec);
		background: -webkit-linear-gradient(top, #3b9af3, #464bec);
		color: #ffffff;
		position: relative;
	}

	.nav-bar {
		display: flex;
		height: 44px;
		justify-content: center;
		align-items: center;
		width: 100%;
		/* #ifdef APP-PLUS */
		margin-top: var(--status-bar-height);
		/* #endif */
	}

	.botton-bg {
		display: flex;
		flex-direction: row;
		flex: 1;
		height: 590rpx;
		background: url('~@/static/login/login_bottom.png');
		background-position: bottom;
		background-repeat: no-repeat;
		background-size: 100% 590rpx;
		justify-content: flex-end;
		padding-top: 25px;
		margin-top: 27px;
	}

	.login-bottom {
		height: 180rpx;
	}

	.login-button {
		display: flex;
		flex-direction: column;
		width: 138rpx;
		height: 64rpx;
		font-size: 30upx;
		justify-content: center;
		align-items: center;
		border-radius: 32rpx;
		margin-right: 48rpx;
		font-weight: 500;
		background-color: rgba(255, 255, 255, 0.04);
		position: fixed;
		bottom: 48rpx;
		right: 28rpx;
		color: rgba(255, 255, 255, 0.4);
		border: 1px solid rgba(255, 255, 255, 0.4);
	}

	.btnactive {
		color: rgba(255, 255, 255, 1);
		border: 1px solid rgba(255, 255, 255, 1);
	}

	.select-title {
		margin-top: 30rpx;
		margin-bottom: 40rpx;
		padding-left: 30rpx;
	}

	.select-content {
		height: 100vh;
		display: flex;
		flex-direction: column;
		position: absolute;
		left: 0rpx;
		right: 0rpx;
		/* #ifdef APP-PLUS */
		top: calc(44px + var(--status-bar-height));
		/* #endif */
	}

	.select-container {
		flex-direction: row;
		width: 100%;
		flex: 1;
		overflow: scroll;
	}

	.select-item {
		font-size: 30rpx;
		font-family: PingFangSC-Regular, PingFang SC;
		font-weight: 400;
	}

	.select-number-Ex {
		font-size: 24rpx;
		font-family: PingFangSC-Regular, PingFang SC;
		font-weight: 400;
		color: rgba(255, 255, 255, 1);
	}

	.select-number {
		font-size: 24rpx;
		font-weight: 400;
		color: #2ff3a4;
	}

	.active {
		color: #2ff3a4;
	}

	.select-items {
		padding-left: 30rpx;
		padding-right: 30rpx;
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
		flex: 1;
		margin-bottom: 16rpx;
		color: rgba(255, 255, 255, 1);
	}

	.iconfont {
		font-size: 30rpx;
		color: #2ff3a4;
	}
</style>
