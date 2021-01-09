<!-- 报表-业绩 -->
<template>
	<view class="re-sline">
		<view class="re-per-filter-view">
			<view class="re-per-filter-text-view" @tap="filterUserList">
				<text class="re-per-filter-text">人员筛选</text>
				<text class="iconfont">&#xe637;</text>
			</view>
			<view class="re-per-filter-text-view" @tap="clickPop">
				<text class="re-per-filter-text">{{popValue === '' ? '全部' : popValue}}</text>
				<text class="iconfont">&#xe637;</text>
			</view>
			<view class="mid-view"></view>
			<select-date ref="selectDate" notiKey="rePerformance"></select-date>
		</view>
		<view class="radio-view">
			<custom-radio @change="clickJob" :selectd="radioValue === 0" class="radio-mr32"><text class="radio-text">工作量</text></custom-radio>
			<custom-radio @change="clickExhibitor" :selectd="radioValue === 1" class="radio-mr32"><text class="radio-text">展商数</text></custom-radio>
			<custom-radio @change="clickContract" :selectd="radioValue === 2" class="radio-mr32"><text class="radio-text">合同金额</text></custom-radio>
			<view class="radio-ml32"></view>
			<text class="radio-text ">单位：{{unit}}</text>
		</view>
		<h-bar-chart v-if="radioValue === 0 && !isNoData" ref="jobChart"></h-bar-chart>
		<h-bar-chart v-if="radioValue === 1 && !isNoData" ref="exhibitorChart"></h-bar-chart>
		<h-bar-chart v-if="radioValue === 2 && !isNoData" ref="contactChart"></h-bar-chart>
		<no-data v-if="isNoData" @reload="getData(true, false)"  :isHint="true" :hint="$util.getPrivilegeById('p3000004') ? '' : '暂无权限'"></no-data>
	</view>
</template>

<script>
	import customRadio from "../../components/radio/custom-radio.vue"
	import selectDate from "../../components/select-date/select-date.vue"
	import hBarChart from "../../components/charts/horizontal-bar-chart.vue"
	import noData from "../../components/no-data/no-data.vue"
	import {
		mapState,
		mapGetters,
		mapMutations
	} from 'vuex'
	export default {
		components: {
			selectDate,
			customRadio,
			hBarChart,
			noData
		},
		data() {
			return {
				data: [],
				isNoData: false,
				jobData: null,		// 工作量数据
				actorData: null,		// 展商数据
				contactData: null,	// 合同数据
				userList: [],  		// 人员列表	默认自己
				radioValue: 0, 		// 0: 工作量 1: 展商数 2: 合同金额
				unit: '个',
				showPop: false,
				popValue: '',
				popSource: [{
					label: '全部',
					value: ''
				},{
					label: '电话',
					value: '电话'
				},{
					label: '传真',
					value: '传真'
				},{
					label: 'Email',
					value: 'Email'
				}]
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
				if (!this.$util.getPrivilegeById('p3000004') || !this.$util.getPrivilegeById("p30000")) {
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
					endDateTime: endTime,
					linkType: this.popValue
				}
				if (showLoading) {
					uni.showLoading()
				}
				this.$http.biPhoneChartData(params).then(res => {
					uni.hideLoading()
					var code = res.data.code
					if (code !== 1000) {
						this.$util.toast(res.data.msg)
						this.isNoData = true
						return
					}
					this.data = res.data.data
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
				this.filterData(this.data)
				if (this.radioValue === 0) {
					this.clickJob(true)
				}
				if (this.radioValue === 1) {
					this.clickExhibitor(true)
				}
				if (this.radioValue === 2) {
					this.clickContract(true)
				}
			},
			// 清洗数据
			filterData (data) {
				var job = data.tel
				var actor = data.actor
				var contact = data.contract
				this.jobData = {
					data: [{
						data: job.one,
						name: '',
					}],
					xAxis: job.userNames
				}
				this.actorData = {
					data: [{
						data: actor.three,
						name: '全部'
					}, {
						data: actor.one,
						name: '已签约'
					}],
					xAxis: actor.userNames
				}
				this.contactData = {
					data: [{
						data: contact.three,
						name: '已收金额'
					}, {
						data: contact.two,
						name: '未收金额'
					}],
					xAxis: contact.userNames
				}
			},
			/**
			 * 选择-工作量
			 * */
			clickJob(value) {
				this.radioValue = 0
				this.unit = '个'
				this.isNoData = false
				if (this.jobData === null) {
					this.isNoData = true
					return
				}
				if (this.jobData['xAxis'].length === 0) {
					this.isNoData = true
					return
				}
				setTimeout(() => {
					this.$refs.jobChart.init('jobChart', '', this.jobData['xAxis'], this.jobData['data'])
				}, 100)
			},
			/**
			 * 选择-展商数
			 * */
			clickExhibitor(value) {
				this.radioValue = 1
				this.unit = '个'
				this.isNoData = false
				if (this.actorData === null) {
					this.isNoData = true
					return
				}
				if (this.actorData['xAxis'].length === 0) {
					this.isNoData = true
					return
				}
				setTimeout(() => {
					this.$refs.exhibitorChart.init('exhibitorChart', '', this.actorData['xAxis'], this.actorData['data'])
				}, 100)
			},
			/**
			 * 选择-合同金额
			 * */
			clickContract(value) {
				this.radioValue = 2
				this.unit = '元'
				this.isNoData = false
				if (this.contactData === null) {
					return
				}
				if (this.contactData['xAxis'].length === 0) {
					this.isNoData = true
					return
				}
				setTimeout(() => {
					this.$refs.contactChart.init('contactChart', '', this.contactData['xAxis'], this.contactData['data'])
				}, 100)
			},
			/**
			 * 选择弹框相关
			 * */
			clickPop () {
				var params = {
					popSource: this.popSource,
					popNotiKey: 'rePerformancePop',
					popValue: [this.popValue],
					mutable: false
				}
				uni.$emit('showSelectPop', params)
			},
			filterUserList () {
				var params = {
					popNotiKey: 'rePerformanceUserPop',
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
		mounted() {
			// 监听-选择日期
			uni.$on('rePerformance', (value) => {
				this.getData(true, false)
			})
			// 监听-选择框完成
			uni.$on('rePerformancePop', (value) => {
				this.popValue = value
				this.getData(true, false)
			})
		}
	}
</script>

<style scoped>
	.re-sline {
		border-top-style: solid;
		border-top-width: 16rpx;
		border-top-color: #F6F6F6;
	}

	.iconfont {
		margin-right: 30rpx;
		margin-left: 16rpx;
		color: #BFBFBF;
		font-size: 23rpx;
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

	.radio-view {
		margin-top: 40rpx;
		margin-left: 24rpx;
		display: flex;
		flex-direction: row;
		align-items: center;
		margin-bottom: 24rpx;
	}

	.radio-mr32 {
		margin-right: 32rpx;
	}

	.radio-text {
		margin-left: 8rpx;
		font-size: 24rpx;
		font-family: PingFangSC-Regular, PingFang SC;
		font-weight: 400;
		color: rgba(0, 0, 0, 0.65);
	}
</style>
