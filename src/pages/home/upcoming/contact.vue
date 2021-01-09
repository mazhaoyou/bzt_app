<!-- 待办事项-联络 -->
<template>
	<mescroll :fixed="false" :down="downOption" @down="downCallback" :up="upOption" @up="upCallback" @init="mescrollInit">
		<view class="contact">
			<tag-line :text="$util.formatDate(date, 4) + '待联络'"></tag-line>
			<view class="re-no-data" v-if="isNoData">
				<no-data @reload="getData(date, 1, 10)"></no-data>
			</view>
			<card-list v-for="(item, index) in list" :key="index" v-if="!isNoData">
				<view slot="top" class="contract-card-tap">
					<text class="contract-card-tap-text">计划联络时间</text>
					<text class="contract-card-tap-time-text">{{item.thyNextLinkTime | formatDate(11)}}</text>
				</view>
				<view slot="content">
					<view class="contact-card-info">
						<view class="contact-name-line-h">
							<text class="contact-card-name">{{item.psnName | fieldProtaction('暂无')}}</text>
							<text class="contact-card-title contact-card-text-s1">{{item.psnDept | fieldProtaction('暂无')}}</text>
							<text class="contact-card-title contact-card-text-s1">{{item.psnRank | fieldProtaction('暂无')}}</text>
						</view>
						<view class="contact-card-text-s4 contact-phone-line-h">
							<text class="contact-card-phone">{{item.psnMobile | fieldProtaction('暂无')}}</text>
						</view>
						<view class="contact-card-company">
							<text class="contact-card-title">{{item.comName | fieldProtaction('暂无')}}</text>
							<view class="contact-card-text-s4 info-line-h">
								<text class="iconfont">&#xe61b;</text>
								<text class="contact-card-title contact-card-text-s3">{{item.comTel1 | fieldProtaction('暂无')}}</text>
								<text class="iconfont contact-card-text-s2">&#xe64d;</text>
								<text class="contact-card-title contact-card-text-s3">{{item.comEmail | fieldProtaction('暂无')}}</text>
							</view>
							<text class="contact-card-last-time contact-card-text-s4">上次联络时间：{{item.thyLinkTime | formatDate(11)}}</text>
						</view>
					</view>
					<view class="contact-card-bottom" @tap="addRecord(item)">
						<text class="contact-card-bottom-text">增加联络记录</text>
						<text class="iconfont contact-card-text-s3 arrowColor">&#xe636;</text>
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
			date (val, old) {
				if (val === '') {
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
		data() {
			return {
				// stfID (integer, optional): 工作人员Id ,
				// stfName (string, optional): 工作人员名称 ,
				// psnID (integer, optional): 联系人Id ,
				// psnName (string, optional): 联系人名称 ,
				// psnDept (string, optional): 部门 ,
				// psnRank (string, optional): 职位 ,
				// psnMobile (string, optional): 手机号 ,
				// psnTel (string, optional): 电话 ,
				// psnEmail (string, optional): email ,
				// comID (integer, optional): 公司Id ,
				// comName (string, optional): 公司名称 ,
				// thyLinkTime (string, optional): 上次联系时间 ,
				// thyNextLinkTime (string, optional): 下次联系时间
				isNoData: false,
				pageDate: '',
				list: [],
				mescroll: null,
				downOption: {
					use: true,
					auto: false, // 不自动加载
				},
				upOption: {
					use: true,
					auto: false, // 不自动加载
					noMoreSize: 4, //如果列表已无数据,可设置列表的总数量要大于半页才显示无更多数据;避免列表数据过少(比如只有一条数据),显示无更多数据会不好看; 默认5
					page: {
						num: 1, // 当前页码,默认0,回调之前会加1,即callback(page)会从1开始
						size: 10 // 每页数据的数量
					},
					textNoMore: '-- 我是有底线的 --',
					empty: {use: false}
				},
			}
		},
		created() {},
		methods: {
			/**
			 * 增加联络记录
			 * */
			addRecord(item) {
				if (!this.$util.getPrivilegeById('p20000020201')) {
					this.$util.showModal('提示', '暂无权限', () => {})
					return
				}
				uni.navigateTo({
					url: "/pages/append-contact/append-contact?atrId=" + item.atrId + "&stfId=" + item.stfId + "&stfName=" + item.stfName
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
				console.log("【test2】")
				this.getData(this.pageDate, mescroll.num, mescroll.size)
			},
			loadPage (date) {
				this.pageDate = date
				this.mescroll.triggerDownScroll()
			},
			getData(date, page, size) {
				var params = {
					date: date,
					pageIndex: page,
					pageSize: size
				}
				console.log("【test3】")
				// uni.showLoading()
				this.$http.getNeedLinkList(params).then(res => {
						console.log("【test4】")
						// uni.hideLoading()
						var code = res.data.code
						var data = res.data.data
						this.mescroll.endSuccess(data.items.length)
						if (code !== 1000) {
							this.$util.toast(res.data.msg)
							this.isNoData = true
							return
						}
						if (data.items.length === 0 && this.list.length === 0) {
							this.isNoData = true
							return
						}
						if (page == 1) {
							this.list = []
						}
						this.isNoData = false
						this.list = this.list.concat(data.items)
					})
					.catch(err => {
						console.log("【test5】")
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

	.contact {}

	.arrowColor {
		color: #BFBFBF !important;
	}

	.contact-align-stretch {
		align-self: stretch;
	}

	.contact-card-text-s1 {
		margin-left: 16rpx;
	}

	.contact-card-text-s2 {
		margin-left: 25rpx;
	}

	.contact-card-text-s3 {
		margin-left: 10rpx;
	}

	.contact-card-text-s4 {
		margin-top: 8rpx;
	}

	.contact-name-line-h {
		line-height: 36rpx;
	}

	.info-line-h {
		line-height: 24rpx;
	}

	.contact-phone-line-h {
		line-height: 30rpx;
	}

	.contract-card-tap {
		display: flex;
		width: 100vh;
		padding-top: 15rpx;
		padding-bottom: 15rpx;
		padding-left: 24rpx;
		padding-right: 24rpx;
		align-items: center;
		justify-content: flex-end;
	}

	.contract-card-tap-text {
		font-size: 22rpx;
		font-family: PingFangSC-Regular, PingFang SC;
		font-weight: 400;
		color: #9B9B9B;
		margin-right: 14rpx;
	}

	.contract-card-tap-time-text {
		font-size: 28rpx;
		font-family: PingFangSC-Medium, PingFang SC;
		font-weight: 500;
		color: rgba(0, 0, 0, 0.65);
	}

	.iconfont {
		line-height: 20rpx;
		font-size: 20;
		color: #A9A9A9;
	}

	.contact-card-name {
		font-size: 36rpx;
		font-family: PingFangSC-Regular, PingFang SC;
		font-weight: 400;
		color: rgba(0, 0, 0, 0.65);
	}

	.contact-card-title {
		font-size: 24rpx;
		line-height: 24rpx;
		font-family: PingFangSC-Regular, PingFang SC;
		font-weight: 400;
		color: rgba(0, 0, 0, 0.65);
	}

	.contact-card-phone {
		font-size: 30rpx;
		line-height: 30rpx;
		font-family: PingFangSC-Regular, PingFang SC;
		font-weight: 400;
		color: rgba(0, 0, 0, 0.65);
	}

	.contact-card-company {
		margin-top: 47rpx;
		display: flex;
		flex-direction: column;
	}

	.contact-card-last-time {
		font-size: 22rpx;
		font-family: PingFangSC-Regular, PingFang SC;
		font-weight: 400;
		color: rgba(155, 155, 155, 1);
	}

	.contact-card-bottom {
		padding-top: 15rpx;
		padding-bottom: 15rpx;
		padding-right: 15rpx;
		border-top-color: rgba(0, 0, 0, 0.05);
		;
		border-top-width: 1rpx;
		border-top-style: solid;
		display: flex;
		justify-content: flex-end;
		align-items: center;
	}

	.contact-card-bottom-text {
		font-size: 28rpx;
		font-family: PingFangSC-Regular, PingFang SC;
		font-weight: 400;
		color: #4B4EFA;
	}

	.contact-card-info {
		padding-top: 24rpx;
		padding-bottom: 24rpx;
		padding-left: 24rpx;
		padding-right: 24rpx;
		display: flex;
		flex-direction: column;
	}
</style>
