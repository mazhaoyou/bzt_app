<!-- 首页 -->
<template>
	<view>
		<view class="home-bg">
			<view class="home-select-view">
				<view @tap="showSelect">
					<text class="home-select-text">{{getExhInfo.exhName}}</text><text class="iconfont home-select-icon">&#xe64b;</text>
				</view>
			</view>
		</view>
		<view class="home-calender-view">
			<view class="ub home-calender-text">
				<text class="ub-1">{{fold ? '最近一个月待办事项' : '最近一周待办事项'}}</text>
				<text>{{month}}</text>
			</view>
			<calender :insert="true" :selected="selected" @change="change" />
			<view class="ub ub-align-center">
				<view class="ub-1 ub ub-align-center">
					<view class="tag-dot"></view>
					<text class="home-exhibitor-num">当前有{{exhibitorCount | fieldProtaction(0)}}条待联络信息</text>
				</view>
				<view class="ub ub-align-center" @tap="toContact">
					<text class="home-exhibitor-btn">前往联络</text>
					<text class="iconfont">&#xe636;</text>
				</view>
			</view>
		</view>
		<view class="home-calender-top"></view>
		<home-line text="催款" @clickLine="toDunning">
			<text>当前有<text class="main-color">{{promptCount | fieldProtaction(0)}}</text>份合同到付款截止日期</text>
		</home-line>
		<!-- <home-line text="合同审批">
			<text>有<text class="main-color">{{data.examineCount}}</text>份待审批合同</text>
		</home-line> -->
		<view class="home-spacing-line"></view>
		<view class="home-bottom-view">
			<view class="ub ub-align-center" @tap="toReport">
				<view class="ub-1"><text class="home-bottom-title-text">数据概要</text></view>
				<view class="ub ub-align-center">
					<text class="home-exhibitor-btn">更多</text>
					<text class="iconfont">&#xe636;</text>
				</view>
			</view>
			<!-- 四张卡片 -->
			<view class="mt24 ub">
				<view class="home-bottom-card ub-1 home-left-card home-card-color-1">
					<view class="home-card-text-1">展商数量</view>
					<view class="home-card-text-view-2"><text class="home-card-text-2">{{$util.toQF(actorNum) | fieldProtaction(0)}}个</text></view>
				</view>
				<view class="home-bottom-card ub-1 home-right-card home-card-color-2">
					<view class="home-card-text-1">销售展位面积</view>
					<view class="home-card-text-view-2"><text class="home-card-text-2">{{$util.toQF(totalArea) | fieldProtaction(0)}}平方米</text></view>
				</view>
			</view>
			<view class="mt24 ub">
				<view class="home-bottom-card ub-1 home-left-card home-card-color-3">
					<view class="home-card-text-1">合同数量</view>
					<view class="home-card-text-view-2"><text class="home-card-text-2">{{$util.toQF(odrNum) | fieldProtaction(0)}}份</text></view>
				</view>
				<view class="home-bottom-card ub-1 home-right-card home-card-color-4">
					<view class="home-card-text-1">合同金额</view>
					<view class="home-card-text-view-2"><text class="home-card-text-2">{{$util.toQF(odrMoney) | fieldProtaction(0)}}元</text></view>
				</view>
			</view>
		</view>
		<e-pop ref="epop"></e-pop>
	</view>
</template>

<script>
	import uniNavBar from '../../../components/uni-nav-bar/uni-nav-bar.vue'
	import calender from "../../../components/uni-calendar/uni-calendar.vue"
	import homeLine from "../../../components/line/homeLine.vue"
	import ePop from "./exhibition-pop"
	import {
		mapState,
		mapGetters,
		mapMutations
	} from 'vuex'
	export default {
		components: {
			uniNavBar,
			calender,
			homeLine,
			ePop
		},
		data() {
			return {
				needReload: false, // 是否需要刷新
				selected: [], // 打点日期数组，期待格式[{date: '2019-06-27', info: '签到', data: { custom: '自定义信息', name: '自定义消息头',xxx:xxx... }}]
				fold: true,
				lastDate: '--', // 记录上次请求日期
				date: '--', // 格式： '2019-06-27'
				month: '--', // 格式 '2019-06'
				exhibitorCount: 0, // 展商数
				promptCount: 0, // 催款数
				actorNum: '--', // 展商数量
				totalArea: '--', // 展位面积
				odrMoney: '--', // 合同金额
				odrNum: '--', // 合同数量
			}
		},
		computed: {
			...mapGetters(['getExhInfo', 'needLoadHome'])
		},
		onLoad() {
			this.getData()
		},
		mounted() {
			// 选择展会回调
			uni.$on('e-pop', (data) => {
				switch (data.type) {
					case 'done':
						uni.getSubNVueById('selectPop').hide()
						setTimeout(() => {
							this.getData()
							this.reloadBenchPayPlan()
							this.loadReport(true) // 记录状态 刷新报表页
							this.$store.dispatch("getExhUserList", false) // 获取人员列表
							this.$store.dispatch("getPrivilegeList") // 获取权限列表
						}, 400)
						break;
					default:
						break;
				}
			})
		},
		onShow() {
			if (this.needLoadHome) { // 是否需要刷新数据
				this.loadHome(false)
				uni.showLoading()
			}
			/** ==【该为频繁请求】== */
			this.getData()
			this.reloadBenchPayPlan()
		},
		onHide() {
			uni.hideLoading()
		},
		methods: {
			...mapMutations(['loadHome', 'loadReport']),
			/**
			 * 获取数据
			 * */
			getData() {
				var isAuthed = this.$storage.isAuthed() // 判断是否登录
				if (!isAuthed && !this.getExhInfo.exhId) { // 当没有展会ID 或未登录 拦截请求 防止多余请求
					return
				}
				this.getCalender()
				this.getDateDetail()
			},
			/**
			 * 刷新催款数
			 * */
			reloadBenchPayPlan() {
				this.lastDate = ''
				this.getBenchPayPlan()
			},
			/**
			 * 获取催款数
			 * */
			getBenchPayPlan() {
				var isAuthed = this.$storage.isAuthed() // 判断是否登录
				if (!isAuthed && !this.getExhInfo.exhId) { // 当没有展会ID 或未登录 拦截请求 防止多余请求
					return
				}
				if (this.lastDate === this.date) {
					return
				}
				if (this.date == "--") {
					return
				}
				var params = {
					queryDate: this.date,
					pageIndex: 1,
					pageSize: 1,
				}
				// uni.showLoading()
				this.$http.getBenchPayPlan(params).then(res => {
						var code = res.data.code
						// uni.hideLoading()
						if (code !== 1000) {
							this.$util.toast(res.data.msg)
							return
						}
						this.lastDate = this.date
						this.promptCount = res.data.data.total
					})
					.catch(err => {
						// uni.hideLoading()
					})
			},
			/**
			 * 获取数据详情
			 * */
			getDateDetail() {
				// uni.showLoading()
				this.$http.getIndexDataDetail().then(res => {
						uni.hideLoading()
						var code = res.data.code
						if (code !== 1000) {
							this.$util.toast(res.data.msg)
							return
						}
						var data = res.data.data
						this.actorNum = data.actorNum
						this.totalArea = data.totalArea
						this.odrMoney = data.odrMoney
						this.odrNum = data.odrNum
					})
					.catch(err => {
						uni.hideLoading()
					})
			},
			/**
			 * 获取日历信息
			 * */
			getCalender() {
				this.$http.getCalenderData().then(res => {
						var code = res.data.code
						if (code !== 1000) {
							this.$util.toast(res.data.msg)
							return
						}
						this.selected = res.data.data
					})
					.catch(err => {})
			},
			change(e) {
				this.fold = e.fold
				this.date = e.fulldate
				this.month = e.year + '年' + e.month + '月'
				this.getBenchPayPlan()
				if (e.clockinfo.have === false) {
					this.exhibitorCount = 0
					return
				}
				this.exhibitorCount = e.clockinfo.data.count
			},
			/**
			 * 页面跳转相关
			 * */
			toContact() {
				if (!this.$util.getPrivilegeById('p1000001')) {
					this.$util.showModal('提示', '暂无权限', () => {})
					return
				}
				uni.navigateTo({
					url: "/pages/home/upcoming/upcoming?current=0&date=" + this.date
				})
			},
			toDunning() {
				if (!this.$util.getPrivilegeById('p1000001')) {
					this.$util.showModal('提示', '暂无权限', () => {})
					return
				}
				uni.navigateTo({
					url: "/pages/home/upcoming/upcoming?current=1&date=" + this.date
				})
			},
			toReport() {
				uni.switchTab({
					url: '/pages/tabs/report/report'
				})
			},
			/**
			 * 切换展商相关
			 * */
			showSelect() {
				// #ifdef APP-PLUS
				const selectPop = uni.getSubNVueById('selectPop')
				uni.$emit('showSelectExhPop')
				selectPop.show()
				// #endif
				// #ifndef APP-PLUS
				this.$refs.epop.show = true
				// #endif
			}
		}
	}
</script>

<style>
	/* #ifndef APP-PLUS-NVUE */
	/* 	page {
		width: 100%;
		min-height: 100%;
	} */
	.home-bg {
		background-image: linear-gradient(to left, rgba(88, 45, 233, 1) 0%, rgba(76, 89, 237, 1) 36%, rgba(59, 154, 243, 1) 100%, rgba(64, 123, 235, 1) 100%);
		height: calc(204rpx + var(--status-bar-height));;
		width: 100%;
		position: fixed;
		z-index: 100;
		padding-top: calc(22rpx + var(--status-bar-height));
	}

	/* #endif */
	.home-select-view {
		align-items: center;
		justify-content: flex-end;
		display: flex;
	}

	.home-select-text {
		font-size: 36rpx;
		color: #FFFFFF;
		font-family: PingFangSC-Medium, PingFang SC;
		font-weight: 500;
	}

	.home-select-icon {
		font-size: 24rpx !important;
		margin-left: 16rpx;
		color: #FFFFFF !important;
		margin-right: 30rpx;
	}

	.home-calender-view {
		width: 642rpx;
		/* height:365rpx; */
		background-color: rgba(255, 255, 255, 1);
		box-shadow: 0px 16px 20px 0px rgba(0, 0, 0, 0.05);
		border-radius: 8rpx;
		margin: 0 auto;
		position: relative;
		top: calc(108rpx + var(--status-bar-height));
		left: 50%;
		margin-left: -345rpx;
		z-index: 1000;
		padding: 24rpx;
	}

	.home-calender-top {
		padding-top: calc(148rpx + var(--status-bar-height));
	}

	.home-calender-text {
		font-size: 26rpx;
		font-family: PingFangSC-Regular, PingFang SC;
		font-weight: 400;
		color: rgba(0, 0, 0, 0.65);
		margin-bottom: 24rpx;
	}

	.iconfont {
		font-size: 32rpx;
		margin-left: 24rpx;
		color: #BFBFBF;
	}

	.home-exhibitor-num {
		font-size: 26rpx;
		font-family: PingFangSC-Regular, PingFang SC;
		font-weight: 400;
		color: rgba(0, 0, 0, 0.65);
	}

	.home-exhibitor-btn {
		font-size: 28rpx;
		font-family: PingFangSC-Regular, PingFang SC;
		font-weight: 400;
		color: rgba(0, 0, 0, 0.65);
	}

	.main-color {
		color: #4B4EFA;
	}

	.home-spacing-line {
		height: 8rpx;
		background-color: #F6F6F6;
	}

	.home-bottom-view {
		padding: 24rpx;
	}

	.home-bottom-title-text {
		font-size: 34rpx;
		font-family: PingFangSC-Regular, PingFang SC;
		font-weight: 400;
		color: rgba(0, 0, 0, 0.85);
	}

	.home-bottom-card {
		border-radius: 8rpx;
		height: 135rpx;
		color: #ffffff;
	}

	.home-left-card {
		margin-right: 12rpx;
	}

	.home-right-card {
		margin-left: 12rpx;
	}

	.home-card-color-1 {
		background: linear-gradient(315deg, rgba(107, 92, 255, 1) 0%, rgba(124, 105, 255, 1) 37%, rgba(157, 112, 254, 1) 100%, rgba(64, 123, 235, 1) 100%);
	}

	.home-card-color-2 {
		background: linear-gradient(315deg, rgba(63, 243, 223, 1) 0%, rgba(62, 225, 221, 1) 37%, rgba(42, 202, 228, 1) 100%, rgba(64, 123, 235, 1) 100%);
	}

	.home-card-color-3 {
		background: linear-gradient(315deg, rgba(241, 93, 135, 1) 0%, rgba(246, 119, 138, 1) 37%, rgba(250, 133, 134, 1) 100%, rgba(64, 123, 235, 1) 100%);
	}

	.home-card-color-4 {
		background: linear-gradient(135deg, rgba(198, 165, 103, 1) 0%, rgba(212, 182, 123, 1) 63%, rgba(236, 209, 156, 1) 100%);
	}

	.home-card-text-1 {
		font-size: 28rpx;
		font-family: PingFangSC-Regular, PingFang SC;
		font-weight: 400;
		color: #FFFFFF;
		margin-top: 18rpx;
		margin-left: 16rpx;
	}

	.home-card-text-2 {
		font-size: 36rpx;
		font-family: PingFangSC-Medium, PingFang SC;
		font-weight: 500;
		color: #FFFFFF;
	}

	.home-card-text-view-2 {
		text-align: right;
		margin-top: 11rpx;
		margin-right: 18rpx;
	}
</style>
