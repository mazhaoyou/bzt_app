<template>
	<view class="container">
		<uni-nav-bar :fixed="true" title="我的" :status-bar="true" :border="false"></uni-nav-bar>
		<view class="mine-list">
			<view class="mine-info">
				<text class="mine-name">{{getUserInfo.stfFullName}}</text>
				<text class="job-title">{{getUserInfo.position}}</text>
			</view>
			<view class="mine-exhibitor" @tap="tapPop">
				<text class="item-title">{{exhInfo.exhName}}</text>
				<view class="switch">
					<text class="item-title" >切换</text>
					<text class="iconfont icon-youjiantou">&#xe636;</text>
				</view>
			</view>
		</view>
		<view class="mine-list mine-list-item" v-show="$util.getPrivilegeById('p4000001')" @tap="contractManagement">
			<text class="item-title">合同管理</text>
			<text class="iconfont icon-youjiantou">&#xe636;</text>
		</view>
		<view class="mine-list login-quit" @tap="loginQuit"><text class="item-title login-quit-btn">退出</text></view>
		<select-pop ref="selectPop" :show="showPop" @showchange='tapPop' @done="selectDone" :sourceData="getExhList" valueType="item" :isLoadMore='false' :mutable="false" labelKey="exhName" valueKey="exhId"></select-pop>
	</view>
</template>
<script>
import uniNavBar from '@/components/uni-nav-bar/uni-navi.vue';
import selectPop from "@/components/select-pop/select-pop.vue"
import {mapState,mapGetters,mapMutations} from 'vuex'
export default {
	components: {
		uniNavBar,
		selectPop
	},
	data() {
		return {
			userInfo: {
				stfID: 212,
				stfFullName: '',
				stfType: 1,
				position: '',
				exhName: ''
			},
			showPop: false,
			exhList: [],
			exhInfo: {exhId: '', exhName: ''},
		};
	},
	onLoad(){
		// this.currentUserInfo();
	},
	computed:{
	    ...mapGetters(['getExhInfo', 'getExhList', 'getUserInfo'])
	},
	onShow() {
		// this.$store.dispatch("getExhListRequest", true) // 获取展商列表
		let exhInfo = this.getExhInfo
		this.exhInfo = exhInfo
		this.$refs.selectPop.setSelectArr([Number(exhInfo.exhId)])
	},
	methods: {
		...mapMutations(['changeExhInfo', 'loadHome', 'loadReport']),
		/* 退出 */
		loginQuit() {
			var _this = this
			uni.showModal({
			    title: '提示',
			    content: '是否确认退出登录',
			    success: (res) => {
			        if (res.confirm) {
			            _this.$util.loginOut()
			        }
			    }
			})
		},
		/* 合同管理 */
		contractManagement() {
			uni.navigateTo({
				url: `/pages/contract-management/contract-management`,
				animationType: 'slide-in-right'
			});
		},
		/* 获取当前用户信息 */
		currentUserInfo() {
			this.$http.getCurrentUserInfo().then(res => {
				let data = res.data;
				if (data.code == '1000') {
					this.userInfo =data.data;
				}
			});
		},
		tapPop () {
			this.showPop = !this.showPop
			if (this.showPop) {
				uni.hideTabBar()
				return
			}
			uni.showTabBar()
		},
		selectDone (value) {
			var selectExhInfo = value.item
			this.changeExhInfo(selectExhInfo)
			this.undateCurrentExh(selectExhInfo)
			this.loadHome(true)									// 记录状态 刷新首页
			this.loadReport(true)								// 记录状态 刷新报表页
			this.$store.dispatch("getExhUserList", true) 		// 获取人员列表
			this.$store.dispatch("getPrivilegeList") 	  		// 获取权限列表
		},
		/**
		 * 更新-展会信息
		 * */
		undateCurrentExh(exhInfo) {
			var exhId = exhInfo.exhId
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
	}
};
</script>
<style>
.tab-bar-top {
	display: flex;
	align-items: center;
	justify-content: center;
	position: fixed;
	width: 100%;
	height: calc(88rpx + var(--status-bar-height));
	background: linear-gradient(270deg, rgba(88, 45, 233, 1) 0%, rgba(76, 89, 237, 1) 55%, rgba(59, 154, 243, 1) 100%);
}
.mine-list {
	display: flex;
	flex-direction: column;
	background: rgba(255, 255, 255, 1);
	padding: 24rpx;
	font-family: PingFangSC-Regular, PingFang SC;
}
.mine-info {
	display: flex;
	flex-direction: row;
	align-items: flex-end;
}
.mine-exhibitor {
	display: flex;
	flex-direction: row;
	justify-content: space-between;
	margin-top: 22rpx;
	align-items: center;
	word-wrap: normal;
	
}
.switch{
	display: flex;
	flex-direction: row;
	width: 150rpx;
	justify-content: flex-end;
	}
.icon-youjiantou {
	margin-left: 24rpx;
	font-size: 22rpx;
	color: #bfbfbf;
}
.job-title {
	font-size: 24rpx;
	font-weight: 400;
	color: rgba(0, 0, 0, 0.65);
	margin-left: 16rpx;
}
.mine-name {
	font-size: 36rpx;
	font-weight: 400;
	color: rgba(0, 0, 0, 0.65);
}
.mine-list-item {
	display: flex;
	flex-direction: row;
	justify-content: space-between;
	align-items: center;
	margin-top: 8rpx;
}
.login-quit {
	display: flex;
	margin-top: 24rpx;
}
.login-quit-btn {
	display: flex;
	justify-content: center;
}
.item-title {
	font-size: 30rpx;
	font-weight: 400;
	color: rgba(0, 0, 0, 0.65);
}
</style>
