<!-- 报表-展商 -->
<template>
	<view class="re-sline">
		<view class="re-per-filter-view">
			<view class="re-per-filter-text-view" @tap="filterUserList">
				<text class="re-per-filter-text">人员筛选</text>
				<text class="iconfont">&#xe637;</text>
			</view>
		</view>
		<funnel-chart v-if="!isNoData" ref="funnel"></funnel-chart>
		<view class="re-no-data" v-if="isNoData">
			<no-data @reload='getData(true, false)' :isHint="true" :hint="$util.getPrivilegeById('p3000001') ? '' : '暂无权限'"></no-data>
		</view>
	</view>
</template>

<script>
	import funnelChart from "../../components/charts/funnel-chart.vue"
	import noData from "../../components/no-data/no-data.vue"
	import {
		mapState,
		mapGetters,
		mapMutations
	} from 'vuex'
	export default {
		data () {
			return {
				isNoData: false,
				userList: [],  		// 人员列表	默认自己
				data: []
			}
		},
		components: {
			funnelChart,
			noData
		},
		computed: {
			...mapGetters(['getUserInfo'])
		},
		mounted() {},
		methods: {
			/**
			 * 获取展商报表数据
			 * @param {BOOL} lazyLoad 是否使用懒加载
			 * */
			getData (showloading, lazyLoad) {
				if (!this.$util.getPrivilegeById('p3000001') || !this.$util.getPrivilegeById("p30000")) {
					this.isNoData = true
					return
				}
				var userList = this.getUserList()
				this.userList = userList.length == 0 ? [""] : this.$util.copyArray(userList)
				var params = {
					userIds: userList
				}
				if (showloading) {
					uni.showLoading()
				}
				this.$http.biActorStatics(params).then(res => {
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
				setTimeout(() => {
					this.$refs.funnel.init('reExhChart', '', this.data)
				}, 30)
			},
			filterUserList () {
				var params = {
					popNotiKey: 'reExhibitorUserPop',
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
		}
	}
</script>

<style scoped>
	.re-sline {
		border-top-style: solid;
		border-top-width: 16rpx;
		border-top-color: #F6F6F6;
	}
	.re-no-data {
		margin-top: 168rpx;
	}
	.re-per-filter-view {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: left;
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
	.iconfont {
		margin-right: 30rpx;
		margin-left: 16rpx;
		color: #BFBFBF;
		font-size: 23rpx;
	}
</style>
