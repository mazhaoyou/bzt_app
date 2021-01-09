<!-- 报表-合同 -->
<template>
	<view class="re-sline">
		<!-- <select-date ref="selectDate" notiKey="reContract"></select-date> -->
		<view class="re-per-filter-view">
			<view class="re-per-filter-text-view" @tap="filterUserList">
				<text class="re-per-filter-text">人员筛选</text>
				<text class="iconfont">&#xe637;</text>
			</view>
			<view class="mid-view"></view>
			<select-date ref="selectDate" notiKey="reContract"></select-date>
		</view>
		<view class="re-checkbox-view re-tag-view" v-show="!isNoData">
			<view class="re-checkbox-view">
				<view class="tag-dot"></view>
				<text class="re-tag-text">按合同金额统计</text>
				<text class="re-contract-ml30 re-tag-text">单位：元</text>
			</view>
		</view>
		<view v-show="!isNoData">
			<bar-chart ref="reContact"></bar-chart>
		</view>
		<view class="re-no-data" v-if="isNoData">
			<no-data @reload="getData(true, false)" :isHint="true" :hint="$util.getPrivilegeById('p3000003') ? '' : '暂无权限'"></no-data>
		</view>
	</view>
</template>

<script>
	import selectDate from "../../components/select-date/select-date.vue"
	import barChart from "../../components/charts/contact-bar-chart.vue"
	import noData from "../../components/no-data/no-data.vue"
	import {
		mapState,
		mapGetters,
		mapMutations
	} from 'vuex'
	export default {
		components: {
			barChart,
			selectDate,
			noData
		},
		data () {
			return {
				userList: [],  		// 人员列表	默认自己
				isNoData: false,
				data: []
			}
		},
		computed: {
			...mapGetters(['getUserInfo'])
		},
		methods: {
			/**
			 * 获取展商报表数据
			 * @param {BOOL} lazyLoad 是否使用懒加载
			 * */
			getData (showLoading, lazyLoad) {
				if (!this.$util.getPrivilegeById('p3000003') || !this.$util.getPrivilegeById("p30000")) {
					this.isNoData = true
					return
				}
				var userList = this.getUserList()
				this.userList = userList.length == 0 ? [""] : this.$util.copyArray(userList)
				var startTime = this.$refs.selectDate.start
				var endTime = this.$refs.selectDate.end
				var params = {
					userIds: userList,
					startDateTime: startTime,
					endDateTime: endTime
				}
				if (showLoading) {
					uni.showLoading()
				}
				this.$http.biContactChartData(params).then(res => {
					uni.hideLoading()
					var code = res.data.code
					if (code !== 1000) {
						this.$util.toast(res.data.msg)
						this.isNoData = true
						return
					}
					var data = res.data.data
					this.data = data
					this.isNoData = false
					if (!lazyLoad) {
						this.loadData()
					}
				})
				.catch(err => {
					uni.hideLoading()
					this.isNoData = true
				})
			},
			/**
			 * 加载chart
			 * */
			loadData () {
				if (this.isNoData) {
					return
				}
				var chartData = [this.data.uncollectedAmount, this.data.receivedAmount]
				var xAxisData = ['未收金额', '已收金额']
				setTimeout(() => {
					this.$refs.reContact.init('contactChart', '', xAxisData, chartData)
				}, 30)
			},
			filterUserList () {
				var params = {
					popNotiKey: 'reContractUserPop',
					popValue: this.userList,
					mutable: true
				}
				uni.$emit('showSelectUserPop', params)
			},
			getUserList () {
				if (this.userList.length == 1 && this.userList[0] == '') {
					return []
				}
				var userList = this.userList.length == 0 ? [this.getUserInfo.stfId] : this.userList
				return userList
			}
		},
		mounted () {
			uni.$on('reContract', (value) => {
				this.getData(true, false)
			})
		}
	}
</script>

<style scoped>
	.re-no-data {
		margin-top: 106rpx;
	}
	.re-sline {
		border-top-style: solid;
		border-top-width: 16rpx;
		border-top-color: #F6F6F6;
	}
	.re-checkbox-view {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: flex-start;
	}
	.re-tag-text {
		font-size:24rpx;
		font-family:PingFangSC-Regular,PingFang SC;
		font-weight:400;
		color:rgba(0,0,0,0.65);
	}
	.re-tag-view {
		margin-left: 24rpx;
		margin-top: 40rpx;
		margin-bottom: 24rpx;
	}
	.re-contract-ml30 {
		margin-left: 30rpx;
	}
	.re-per-filter-view {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: center;
	}
	.re-per-filter-text-view {
		padding-top: 24rpx;
		margin-left: 24rpx;
		line-height: 26rpx;
	}
	.re-per-filter-text {
		font-size: 26rpx;
		font-family: PingFangSC-Regular, PingFang SC;
		font-weight: 400;
		color: rgba(0, 0, 0, 0.65);
	}
	.mid-view {
		flex: 1;
	}
	.iconfont {
		margin-right: 30rpx;
		margin-left: 16rpx;
		color: #BFBFBF;
		font-size: 23rpx;
	}
</style>
