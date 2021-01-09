<!-- 展商 -->
<template>
	<view class="container">
		<view class="nav-bar">
			<!-- <view class="status-bar"></view>
			<view class="tab-bar-top"></view> -->
			<uni-nav-bar :fixed="true" :status-bar="true" :border="false"></uni-nav-bar>

			<view class="select-bar">
				<view class="select-bar-item" @tap="tapPop(0)">
					<text>状态</text>
					<text class="iconfont">&#xe637;</text>
					<!-- <text class="iconfont">&#xe63a;</text> -->
				</view>
				<view class="select-bar-item" @tap="tapPop(1)">
					<text>所有人</text>
					<text class="iconfont">&#xe637;</text>
				</view>
				<view class="select-bar-item" @tap="tapPop(2)">
					<text>销售进度</text>
					<text class="iconfont">&#xe637;</text>
				</view>
			</view>
		</view>

		<view class="card-list-item" v-for="(item, index) of exhibitorList" :key="index" @tap="goExhibitorDetail(item.atrId,item.atrName)">
			<card-list>
				<view slot="top" class="card-list-top">
					<text class="hint-titel uni-ellipsis">{{item.atrFiStatus | fieldProtaction}}</text>
					<text class="hint-schedule uni-ellipsis">销售进度{{ item.atrSaleIndex | fieldProtaction(0)}}%</text>
					<view class="contact-time uni-ellipsis">
						<text class="contact-title">联络时间</text>
						<text class="time uni-ellipsis">{{ item.atrLastLinkTime | formatDate(11) }}</text>
					</view>
				</view>
				<view slot="content" class="card-list-content">
					<text class="exhibitor-company">{{ item.atrName | fieldProtaction }}</text>
					<text class="exhibitor-number uni-ellipsis-2">展位号：{{ item.bthCode | fieldProtaction }}</text>
					<text class="exhibitor-salesman">业务员：{{ item.atrSaleName | fieldProtaction }}</text>
				</view>
			</card-list>
		</view>
		<view class="card-list-item" v-if="exhibitorList.length==0">
			<no-data isHint="true"></no-data>
		</view>
		<uni-load-more :status="status"></uni-load-more>
		<select-pop ref="selectPop" :show="showPop" @showchange='tapPop' @done="selectDone" @tapItem="tapItem" :sourceData="sourceData"
		 :mutable="mutable" :labelKey="labelKey" :selectArr="popValue" :valueKey="valueKey"></select-pop>
	</view>
</template>

<script>
	import cardList from '@/components/card-list/card-list.vue';
	import uniNavBar from '@/components/uni-nav-bar/uni-navi.vue';
	import selectPop from '@/components/select-pop/select-pop.vue';
	import noData from "@/components/no-data/no-data.vue"
	import uniLoadMore from '@/components/uni-load-more/uni-load-more.vue';
	export default {
		components: {
			cardList,
			uniNavBar,
			selectPop,
			noData,
			uniLoadMore
		},
		data() {
			return {
				showPop: false,
				exhibitorList: [
					/* {
										atrId: '',
										atrName: '',
										bthCode: '0',
										atrSaleName: '',
										atrFiStatus: '',
										atrLastLinkTime: new Date().getTime(),
										atrSaleIndex: ''
									} */
				],
				type: '',
				list: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'],
				sourceData: [],
				mutable: true,
				currIndex: 0,
				actorStatus: [],
				atrSaleIndex: [],
				seeSelfData: [],
				pageSize: 10,
				pageIndex: 1,
				labelKey: 'opt',
				valueKey: 'value',
				hasNext: true,
				status: 'more',
				isRefresh: false,
				popValue: []

			};
		},
		onShow() {
			if (!this.$util.getPrivilegeById("p20000")) {
				this.$util.showModal("", "您目前没有预览展商权限", () => {
					uni.switchTab({
						url: "../home/home"
					})
				});
				this.exhibitorList = []
				return;
			}
			this.pageIndex = 1;
			this.getExhibitorsList();
		},
		onPullDownRefresh() {
			this.pageIndex = 1;
			this.actorStatus = [];
			this.atrSaleIndex = [];
			this.seeSelfData = [];
			this.getExhibitorsList();
			this.isRefresh = true;
		},
		onReachBottom() {
			this.isRefresh = false;
			if (this.hasNext) {
				this.getExhibitorsList();
			}

		},
		onNavigationBarButtonTap(e) {
			if (e.index === 1) {
				uni.navigateTo({
					url: '/pages/exhibitor-search/exhibitor-search',
					animationType: 'fade-in'
				});
			} else {
				if (!this.$util.getPrivilegeById("p200000101")) {
					this.$util.showModal("", "您目前没有新增展商权限");
				} else {
					uni.navigateTo({
						url: '/pages/append-exhibitor/append-exhibitor',
						animationType: 'fade-in'
					});
				}

			}
		},
		methods: {
			/* 获得展商列表 */
			getExhibitorsList() {
				let _this = this;
				let data = {
					actorNameText: '',
					actorStatus: _this.actorStatus,
					seeSelfData: _this.seeSelfData,
					atrSaleIndex: _this.atrSaleIndex,
					pageSize: _this.pageSize,
					pageIndex: _this.pageIndex
				};
				if (!_this.isRefresh && _this.pageIndex != 1) {
					_this.status = "loading";
				}
				let exhibitorList = _this.$storage.getStorage('exhibitorList');
				if (_this.pageIndex == 1) {
					_this.exhibitorList = exhibitorList;
				}
				_this.$http
					.getActorListData(data)
					.then(res => {
						let data = res.data;
						if (data.code == '1000') {
							uni.stopPullDownRefresh();
							if (_this.pageIndex == 1 || _this.isRefresh) {
								if (!_this.$util.contrastArray(data.data.items, exhibitorList)) {
									_this.exhibitorList = data.data.items;
									_this.$storage.setStorage('exhibitorList', data.data.items);
								}
								//_this.exhibitorList = data.data.items;
							} else {
								let arr = [..._this.exhibitorList, ...data.data.items];
								_this.exhibitorList = [...new Set(arr)];
							}
							_this.hasNext = data.data.hasNext;
							if (_this.hasNext) {
								_this.pageIndex++;
							} else {
								_this.status = "noMore";
							}
						}
					})
					.catch(e => {});
			},
			goExhibitorDetail(id, atrName) {
				uni.navigateTo({
					url: `../../exhibitor/exhibitor-detail?atrId=${id}`
				});
			},
			tapPop(index) {
				this.currIndex = index;
				this.valueKey = "value"
				this.labelKey = "opt";
				this.popValue = [];
				if (index == 0) {
					this.mutable = false;
					this.sourceData = this.$json.exhibitorStatus;
					this.$refs.selectPop.selectArr = this.actorStatus.length == 0 ? [0] : this.actorStatus;
				} else if (index == 2) {
					this.mutable = true;
					this.valueKey = "values"
					this.sourceData = this.$json.rateProgress;
					this.$refs.selectPop.selectArr = this.atrSaleIndex.length == 0 ? [""] : this.atrSaleIndex;
				} else {
					this.mutable = true;
					this.labelKey = "userName";
					this.valueKey = "userId";
					this.sourceData = this.$store.state.common.exhUserList;
					this.$refs.selectPop.selectArr = this.seeSelfData.length == 0 ? [""] : this.seeSelfData;
				}
				this.showPop = !this.showPop;
				if (this.showPop) {
					uni.hideTabBar();
					return;
				}
				uni.showTabBar();
			},
			selectDone(value) {
				if (this.currIndex == 0) {
					this.actorStatus = [];
					this.actorStatus = this.actorStatus.concat(value);
				} else if (this.currIndex == 2) {
					this.atrSaleIndex = [];
					this.atrSaleIndex = this.atrSaleIndex.concat(value);
				} else {
					this.seeSelfData = [];
					this.seeSelfData = this.seeSelfData.concat(value);
				}
				this.pageIndex = 1;
				this.getExhibitorsList();
			},
			tapItem(item) {
				// if (item.value == 0) {
				// 	this.mutable = false;
				// 	this.$refs.selectPop.selectArr = [item.value]
				// } else {
				// 	this.mutable = true;
				// }
			}
		},
		onBackPress() {
			this.$refs['showpopup'].close();
		}
	};
</script>

<style scoped>
	.container {
		display: flex;
		width: 100%;
		background: rgba(246, 246, 246, 1);
		flex-direction: column;
		flex: 1;
		min-height: 100vh;
	}

	.nav-bar {
		margin-bottom: 85rpx;
	}

	.tab-bar-top {
		position: fixed;
		width: 100%;
		height: calc(88rpx + var(--status-bar-height));
		background: linear-gradient(270deg, rgba(88, 45, 233, 1) 0%, rgba(76, 89, 237, 1) 55%, rgba(59, 154, 243, 1) 100%);
		z-index: 1000;
	}

	.select-bar {
		display: flex;
		flex-direction: row;
		word-wrap: normal;
		width: 100%;
		height: 85rpx;
		justify-content: space-around;
		font-size: 26rpx;
		font-family: PingFangSC-Regular, PingFang SC;
		font-weight: 400;
		color: rgba(0, 0, 0, 0.65);
		background-color: #fff;
		align-items: center;
		flex: 1;
		position: fixed;
		/* top: calc(88rpx + var(--status-bar-height)); */
		z-index: 1000;
	}

	.iconfont {
		margin-left: 16rpx;
		color: #bfbfbf;
		font-size: 28rpx;
	}

	.card-list-top {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 16rpx 24rpx;
		flex: 1;
	}

	.hint-titel {
		padding: 10rpx;
		background: rgba(247, 247, 255, 1);
		border-radius: 4rpx;
		font-size: 22rpx;
		font-family: PingFangSC-Regular, PingFang SC;
		font-weight: 400;
		color: rgba(75, 78, 250, 1);
	}

	.hint-schedule {
		margin-left: 16rpx;
		padding: 10rpx;
		background: rgba(247, 247, 255, 1);
		border-radius: 4rpx;
		font-size: 22rpx;
		font-family: PingFangSC-Regular, PingFang SC;
		font-weight: 400;
		color: rgba(75, 78, 250, 1);
	}

	.contact-time {
		display: flex;
		flex-wrap: nowrap;
		align-items: center;
	}

	.contact-title {
		font-size: 22rpx;
		font-family: PingFangSC-Regular, PingFang SC;
		font-weight: 400;
		color: rgba(155, 155, 155, 1);
	}

	.time {
		font-size: 28rpx;
		font-family: PingFangSC-Medium, PingFang SC;
		font-weight: 500;
		color: rgba(0, 0, 0, 0.65);
		max-width: 220rpx;
		margin-left: 12rpx;
	}

	.card-list-content {
		display: flex;
		padding: 24rpx;
		flex-direction: column;
		overflow: hidden;
	}

	.exhibitor-company {
		font-size: 36rpx;
		font-family: PingFangSC-Regular, PingFang SC;
		font-weight: 400;
		color: rgba(0, 0, 0, 0.65);
	}

	.exhibitor-number {
		margin-top: 8rpx;
		font-size: 28rpx;
		font-family: PingFangSC-Regular, PingFang SC;
		font-weight: 400;
		color: rgba(0, 0, 0, 0.65);
		display: -webkit-box;
		overflow: hidden;
		text-overflow: ellipsis;
		word-wrap: break-word;
		white-space: normal !important;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
	
		
	}

	.exhibitor-salesman {
		font-size: 24rpx;
		font-family: PingFangSC-Regular, PingFang SC;
		font-weight: 400;
		color: rgba(155, 155, 155, 1);
		margin-top: 48rpx;
	}

	.popup-content {
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		background-color: #fff;
		border-top-color: #f6f6f6;
		border-top-style: solid;
		border-top-width: 1rpx;
		padding: 15px;
		font-size: 14px;
		margin-top: calc(172rpx + var(--status-bar-height));
	}

	/* .uni-popup{
   top: calc(173rpx + var(--status-bar-height));
}
.popup-content{
	
} */
</style>
