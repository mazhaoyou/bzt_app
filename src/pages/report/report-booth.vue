<!-- 报表-展位 -->
<template>
	<view class="re-sline">
		<!-- <select-date ref="selectDate" notiKey="reBooth"></select-date> -->
		<view class="re-per-filter-view">
			<view class="re-per-filter-text-view" @tap="filterUserList">
				<text class="re-per-filter-text">人员筛选</text>
				<text class="iconfont">&#xe637;</text>
			</view>
			<view class="mid-view"></view>
			<select-date ref="selectDate" notiKey="reBooth"></select-date>
		</view>
		<view  v-if="!isNoData" class="re-checkbox-view re-tag-view">
			<view class="re-checkbox-view">
				<view class="tag-dot"></view>
				<text class="re-tag-text">按展位面积（平米）</text>
			</view>
			<view class="re-checkbox-view" @tap="changeCheckValue">
				<checkbox class="re-checkbox" style="transform:scale(0.5)" :checked="showBoothNum" color="#4B4EFA"></checkbox>
				<text class="re-tag-text">展示展位数</text>
			</view>
		</view>
		<bar-chart  v-if="!isNoData" ref="barChart"></bar-chart>
		<scroll-view v-if="!isNoData" scroll-x class="re-bottom-scroll">
			<checkbox-group class="re-checkbox-view">
				<view v-for="(item, index) in filterList" :key="index" class="re-checkbox-view" @tap="clickRoomCheckBox(item, index)">
					<checkbox class="re-checkbox" style="transform:scale(0.5)" :value="item.name" :checked="item.checked" color="#4B4EFA"></checkbox>
					<view class="re-checkbox-bottom-view"><text class="re-tag-text">{{item.name}}</text></view>
				</view>
			</checkbox-group>
		</scroll-view>
		<view class="re-no-data" v-if="isNoData">
			<no-data @reload="getData(true, false)" :isHint="true" :hint="$util.getPrivilegeById('p3000002') ? '' : '暂无权限'"></no-data>
		</view>
	</view>
</template>

<script>
	import barChart from "../../components/charts/booth-bar-chart.vue"
	import selectDate from "../../components/select-date/select-date.vue"
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
				isNoData: false,
				showBoothNum: false, // 是否显示展位数
				userList: [],  		// 人员列表	默认自己
				data: [],
				filterList: []
			}
		},
		computed: {
			...mapGetters(['getUserInfo'])
		},
		methods: {
			/**
			 * 显示展位数
			 * */
			changeCheckValue () {
				this.showBoothNum = !this.showBoothNum
				this.$refs.barChart.isShowInfo = this.showBoothNum
				this.setChartData()
			},
			/**
			 * 获取数据
			 * @param {BOOL} lazyLoad 是否使用懒加载
			 * */
			getData (showLoading, lazyLoad) {
				if (!this.$util.getPrivilegeById('p3000002') || !this.$util.getPrivilegeById("p30000")) {
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
				this.$http.biBoothChartData(params).then(res => {
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
				if (this.data.length === 0) {
					this.isNoData = true
					return
				}
				this.isNoData = false
				this.setFilterData(this.data)
				this.setChartData()
			},
			setFilterData (data) {
				this.filterList = [{name: '全部', checked: true}]
				var list = data.map(d => {
					var obj = {name: d.room, checked: true, subscribe: d.subscribe, contract: d.contract, pay: d.pay}
					return obj
				})
				this.filterList = this.filterList.concat(list)
			},
			setChartData () {
				var chartData = [
					{
						data: [],
						name: '已预定',
					},
					{
						data: [],
						name: '已签合同',
					},
					{
						data: [],
						name: '已付款',
					}
				]
				var chartXAios = []
				var selectList = this.filterList.filter(d => {
					if ( d['name'] === '全部' ) {
						return false
					}
					return d['checked']
				})
				selectList.forEach((item, index) => {
					chartXAios.push(item['name'])
					var subscribe = item.subscribe
					var contract = item.contract
					var pay = item.pay
					chartData[0]['data'].push({value: subscribe.area, info: subscribe.num})
					chartData[1]['data'].push({value: contract.area, info: contract.num})
					chartData[2]['data'].push({value: pay.area, info: pay.num})
				})
				setTimeout(() => {
					this.$refs.barChart.init('booth', '', chartXAios, chartData)
				}, 30)
			},
			/**
			 * 处理点击checkbox
			 * */
			clickRoomCheckBox (item, index) {
				this.setRoomCheckStatus(item, index)
				this.setChartData()
			},
			setRoomCheckStatus (item, index) {
				var allStatus = this.filterList[0]['checked']
				// 点击全部 checkbox
				if (index === 0) {
					this.filterList = this.filterList.map(d => {
						d['checked'] = allStatus ? false : true
						return d
					})
					return
				}
				// 点击非全部 checkbox && 当前处于全选状态
				if (index !== 0 && allStatus) {
					this.filterList[0]['checked'] = false
					this.filterList[index]['checked'] = !this.filterList[index]['checked']
				}
				// 点击非全部 checkbox && 当前未处于全选状态
				if (index !== 0 && !allStatus) {
					this.filterList[index]['checked'] = !this.filterList[index]['checked']
					// 用于判断数组中是否还有未选中元素
					var status = true
					for (var i = 1 ; i < this.filterList.length ; i++ ) {
						if ( !this.filterList[i]['checked'] ) {
							return
						}
					}
					this.filterList[0]['checked'] = true
				}
			},
			filterUserList () {
				var params = {
					popNotiKey: 'reBoothUserPop',
					popValue: this.userList,
					mutable: true
				}
				uni.$emit('showSelectUserPop', params)
			},
			getUserList () {
				console.log("【this.userList】")
				console.log(this.userList)
				if (this.userList.length == 1 && this.userList[0] == '') {
					return []
				}
				var userList = this.userList.length == 0 ? [this.getUserInfo.stfId] : this.userList
				return userList
			}
		},
		mounted() {
			uni.$on('reBooth', (value) => {
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
		width: 750rpx;
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
	.re-checkbox {
		margin-left: 32rpx;
	}
	.re-tag-view {
		margin-left: 24rpx;
		margin-top: 40rpx;
		margin-bottom: 24rpx;
	}
	.re-checkbox-bottom-view {
		display: flex;
		flex-wrap: nowrap;
		min-width: 100rpx;
	}
	.re-bottom-scroll {
		margin-top: 50rpx;
		height: 200rpx;
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
