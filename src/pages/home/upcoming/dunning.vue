<!-- 待办事项-催款 -->
<template>
	<mescroll :fixed="false" :down="downOption" @down="downCallback" :up="upOption" @up="upCallback" @init="mescrollInit">
	<view class="dunning">
		<tag-line text="当前待催款"></tag-line>
		<view class="re-no-data" v-if="isNoData">
			<no-data @reload="getData(date, 1, 10)"></no-data>
		</view>
		<card-list v-for="(item, index) in list" :key="index" v-if="!isNoData">
			<view slot="top" class="dunning-card-tap">
				<text class="dunning-card-tap-text">付款截止日期</text>
				<text class="dunning-card-tap-time-text">{{item.ppnCreateTime | formatDate(12)}}</text>
			</view>
			<view slot="content">
				<view class="dunning-card-info">
					<view class="dunning-name-line-h">
						<text class="dunning-card-name">{{item.psjName | fieldProtaction('暂无')}}</text>
						<text class="dunning-card-title dunning-card-text-s1">{{item.psjDept | fieldProtaction('暂无')}}</text>
						<text class="dunning-card-title dunning-card-text-s1">{{item.psjRank | fieldProtaction('暂无')}}</text>
					</view>
					<view class="dunning-phone-line-h dunnin-card-text-s4">
						<text class="dunning-card-phone">{{item.psjMobile | fieldProtaction('暂无')}}</text>
					</view>
					<view class="info-line-h dunnin-card-text-s4">
						<text class="iconfont">&#xe61b;</text>
						<text class="dunning-card-title dunning-card-text-s3">{{item.psjTel | fieldProtaction('暂无')}}</text>
						<text class="iconfont dunning-card-text-s2">&#xe64d;</text>
						<text class="dunning-card-title dunning-card-text-s3">{{item.psjEmail | fieldProtaction('暂无')}}</text>
					</view>
					<view class="dunning-card-info-text dunning-card-info-view">
						<text>计划付款名称：</text><text>{{item.ppnName | fieldProtaction('暂无')}}</text>
					</view>
					<view class="dunning-card-info-text">
						<text>{{item.atrName | fieldProtaction('暂无')}}</text>
					</view>
					<view class="dunning-card-info-text">
						<text>计划金额：</text><text>{{$util.toQF(item.ppnAmountRmb) | fieldProtaction('暂无')}}</text>
					</view>
					<view class="dunning-card-info-text">
						<text>所属合同：</text><text>{{item.odrName | fieldProtaction('暂无')}}</text>
					</view>
					<view class="dunning-card-info-text">
						<text>付款状态：</text><text>{{item.state | fieldProtaction('暂无')}}</text>
					</view>
				</view>
				<view class="dunning-card-bottom" @tap="checkPlan(item)">
					<text class="dunning-card-bottom-text">查看付款计划</text>
					<text class="iconfont dunning-card-text-s3 arrowColor">&#xe636;</text>
				</view>
			</view>
		</card-list>
	</view>
	</mescroll>
</template>

<script>
	import tagLine from "../../../components/line/tag-line.vue"
	import cardList from "../../../components/card-list/card-list.vue"
	import mescroll from "../../../components/mescroll-uni/mescroll-uni.vue"
	import noData from "../../../components/no-data/no-data.vue"
	export default {
		components: {
			tagLine,
			cardList,
			mescroll,
			noData
		},
		props: {
			date: {
				type: String,
				default: ''
			}
		},
		watch: {
			/**
			 * 监听date被赋值
			 * */
			date (value, old) {
				if (value === '') {
					return
				}
				// this.mescroll.triggerDownScroll()
			},
			isNoData (val, old) {
				if (!val) {
					this.mescroll.optUp.use = true
					return
				}
				this.mescroll.optUp.use = false
			}
		},
		data(){
			return {
				pageDate: '',
				isNoData: false,
				list: [],
				mescroll: null,
				downOption:{
					use: true,
					auto:false, // 不自动加载
				},
				upOption:{
					use: true,
					auto:false, // 不自动加载
					page: {
						num: 1, // 当前页码,默认0,回调之前会加1,即callback(page)会从1开始
						size: 10 // 每页数据的数量
					},
					noMoreSize: 4, //如果列表已无数据,可设置列表的总数量要大于半页才显示无更多数据;避免列表数据过少(比如只有一条数据),显示无更多数据会不好看; 默认5
					textNoMore: '-- 我是有底线的 --',
					empty: {use: false}
				},
			}
		},
		created() {},
		methods: {
			/**
			 * 查看付款计划
			 * */
			checkPlan(item) {
				if (!this.$util.getPrivilegeById('p200000204')) {
					this.$util.showModal('提示', '暂无权限', () => {})
					return
				}
				// atrid : 展商ID
				uni.navigateTo({
					url: "/pages/exhibitor/exhibitor-detail?index=3&atrId=" + item.atrId
				})
			},
			// mescroll组件初始化的回调,可获取到mescroll对象
			mescrollInit(mescroll) {
				this.mescroll = mescroll;
				mescroll.hideTopBtn()
			},
			/*下拉刷新的回调 */
			downCallback(mescroll) {
				// 这里加载你想下拉刷新的数据, 比如刷新轮播数据
				// loadSwiper();
				// 下拉刷新的回调,默认重置上拉加载列表为第一页 (自动执行 mescroll.num=1, 再触发upCallback方法 )
				this.getData(this.pageDate, 1, 10)
				mescroll.setPageNum(2)
				mescroll.scrollTo(0, 0)
			},
			/*上拉加载的回调: mescroll携带page的参数, 其中num:当前页 从1开始, size:每页数据条数,默认10 */
			upCallback(mescroll) {
				this.getData(this.pageDate, mescroll.num, mescroll.size)
			},
			loadPage(date) {
				this.pageDate = date
				this.mescroll.triggerDownScroll()
			},
			getData(date, page, size) {
				var params = {
					queryDate: date,
					pageIndex: page,
					pageSize: size
				}
				// uni.showLoading()
				this.$http.getBenchPayPlan(params).then(res => {
						// uni.hideLoading()
						this.mescroll.endSuccess(res.data.data.items.length)
						var code = res.data.code
						if (code !== 1000) {
							this.$util.toast(res.data.msg)
							this.isNoData = true
							return
						}
						if (res.data.data.items.length === 0  && this.list.length === 0) {
							this.isNoData = true
							return
						}
						this.isNoData = false
						if (page == 1) {
							this.list = []
						}
						this.list = this.list.concat(res.data.data.items)
					})
					.catch(err => {
						// uni.hideLoading()
						this.mescroll.endErr()
						this.isNoData = true
					})
			}
		}
	}
</script>

<style scoped>
	.re-no-data {
		margin-top: 106rpx;
	}
	.dunning {}
	.arrowColor {
		color: #BFBFBF !important;
	}
	.dunning-card-text-s1 {
		margin-left: 16rpx;
	}
	.dunning-card-text-s2 {
		margin-left: 25rpx;
	}
	.dunning-card-text-s3 {
		margin-left: 10rpx;
	}
	.dunnin-card-text-s4 {
		margin-top: 8rpx;
	}
	.info-line-h {
		line-height: 24rpx;
	}
	.dunning-name-line-h {
		line-height: 36rpx;
	}
	.dunning-phone-line-h {
		line-height: 30rpx;
	}
	.dunning-card-tap {
		display: flex;
		width: 100vh;
		padding-top: 15rpx;
		padding-bottom: 15rpx;
		padding-left: 24rpx;
		padding-right: 24rpx;
		align-items: center;
		justify-content: flex-end;
	}
	.dunning-card-tap-text {
		font-size:22rpx;
		font-family:PingFangSC-Regular,PingFang SC;
		font-weight:400;
		color: #9B9B9B;
		margin-right: 14rpx;
	}
	.dunning-card-tap-time-text {
		font-size:28rpx;
		font-family:PingFangSC-Medium,PingFang SC;
		font-weight:500;
		color: rgba(0,0,0,0.65);
	}
	.dunning-card-info {
		padding-top: 24rpx;
		padding-bottom: 24rpx;
		padding-left: 24rpx;
		padding-right: 24rpx;
	}
	.dunning-card-bottom {
		padding-top: 15rpx;
		padding-bottom: 15rpx;
		padding-right: 15rpx;
		border-top-color: rgba(0,0,0,0.05);;
		border-top-width: 1rpx;
		border-top-style: solid;
		display: flex;
		justify-content: flex-end;
		align-items: center;
	}
	.dunning-card-bottom-text {
		font-size: 28rpx;
		font-family: PingFangSC-Regular,PingFang SC;
		font-weight: 400;
		color: #4B4EFA;
	}
	.iconfont {
		font-size: 20;
		color: #A9A9A9;
	}
	.dunning-card-name {
		font-size:36rpx;
		font-family:PingFangSC-Regular,PingFang SC;
		font-weight:400;
		color:rgba(0,0,0,0.65);
	}
	.dunning-card-title {
		font-size:24rpx;
		line-height: 24rpx;
		font-family:PingFangSC-Regular,PingFang SC;
		font-weight:400;
		color:rgba(0,0,0,0.65);
	}
	.dunning-card-phone {
		line-height: 30rpx;
		font-size:30rpx;
		font-family:PingFangSC-Regular,PingFang SC;
		font-weight:400;
		color:rgba(0,0,0,0.65);
	}
	.dunning-card-info-view {
		margin-top: 48rpx;
	}
	.dunning-card-info-text {
		font-size:24rpx;
		line-height: 24rpx;
		padding-top: 8rpx;
		font-family:PingFangSC-Regular,PingFang SC;
		font-weight:400;
		color:rgba(0,0,0,0.4);
	}
</style>
