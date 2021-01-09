<!-- 我的模块合同管理-->
<template>
	<view class="container">
		<view class="select-bar">
			<view class="select-bar-item" @tap="tapPop">
				<text>筛选</text>
				<text class="iconfont">&#xe637;</text>
			</view>
		</view>
		<view class="card-list">
			<view v-for="item in dataList" :key="item.odrID">
				<card-list>
					<view class="exhibitor-contract-titel" slot="top">
						<text class="contract-date-title">合同日期 </text>
						<text class="contract-date-time">{{item.odrCreateTime | formatDate(11)}}</text>
					</view>
					<view class="exhibitor-item-material" slot="content">
						<text class="contract-item headline">合同基本信息</text>
						<text class="contract-item contract-name">合同名称：{{item.odrname}}</text>
						<text class="contract-item customer-name">客户名称：{{item.odrComName}}</text>
						<text class="contract-item-details">合同金额：{{item.odrReceive }}</text>
						<text class="contract-item-details">已收金额：{{item.odrMoney}}</text>
						<text class="contract-item-details">业务员:{{item.stfFullName}}</text>
						<text class="contract-item headline headlines ">合同项目信息</text>
						<view style="display: flex; flex-direction: column;" v-for="list in item.dataList" :key="list.odrid">
							<text class="contract-item">项目名称：{{list.oddsourceid}}</text>
							<text class="contract-item">服务大类：{{list.oddsource}}</text>
							<text class="contract-item">服务类别：{{list.oddTypName}}</text>
							<text class="contract-item">单价：{{list.oddsaleprice | toDecimal2}}</text>
							<text class="contract-item">销售价格：{{list.oddprice | toDecimal2}}</text>
							<text class="contract-item">数量：{{list.oddnum}}</text>
							<text class="contract-item">小计：{{list.oddEndPrice | toDecimal2}}</text>
						</view>

					</view>
				</card-list>
			</view>
			<view class="" v-if="dataList.length == 0">
				<no-data isHint="true"></no-data>
			</view>
			<uni-load-more :status="status"></uni-load-more>

		</view>
		<select-pop ref="selectPop" :show="showPop" @showchange='tapPop' @done="selectDone"
		 :sourceData="selectList" :value="popValue" :isLoadMore='false' :mutable="mutable" labelKey="userName" valueKey="userId"></select-pop>

	</view>
</template>

<script>
	import cardList from '@/components/card-list/card-list.vue';
	import selectPop from '@/components/select-pop/select-pop.vue';
	import uniLoadMore from '@/components/uni-load-more/uni-load-more.vue';
	import noData from "@/components/no-data/no-data.vue"

	export default {
		components: {
			cardList,
			selectPop,
			uniLoadMore,
			noData
		},
		data() {
			return {
				dataList: [],
				selectList: [],
				showPop: false,
				popNotiKey: "",
				seeSelfData: [],
				pageSize: 10,
				pageIndex: 1,
				hasNext: true,
				status: 'more',
				isRefresh: false,
				mutable:true

			};
		},
		onLoad() {
			this.getContractList();
			console.log(JSON.stringify(this.$store.state.common.exhUserList))
			this.selectList = this.$store.state.common.exhUserList;
		},
		onPullDownRefresh() {
			this.pageIndex = 1;
			this.getContractList();
			this.isRefresh = true;
		},
		onReachBottom() {
			this.isRefresh = false;
			if (this.hasNext) {
				this.getContractList();
			}
			
		},
		methods: {
			getContractList() {
				let _this = this;
				let arg = {
					seeSelfData: this.seeSelfData,
					pageSize: this.pageSize,
					pageIndex: this.pageIndex,
					atrId: ""
				}
				if (!_this.isRefresh) {
					_this.status = "loading";
				}

				this.$http.getContractListData(arg).then(res => {
					let data = res.data;
					if (data.code == "1000") {
						if (_this.pageIndex == 1 || _this.isRefresh) {
							_this.dataList = data.data.items;
						} else {
							let arr = [..._this.dataList, ...data.data.items];
							_this.dataList = [...new Set(arr)];
						}
						_this.hasNext = data.data.hasNext;
						if (_this.hasNext) {
							_this.pageIndex++;
						} else {
							_this.status = "noMore";
						}
						uni.stopPullDownRefresh();
					} else {
						this.$util.toast(data.msg);
					}
				})
			},
			selectDone(value) {
				console.log(value)
				this.seeSelfData = value;
				this.getContractList();
			},
			tapPop() {
				this.pageIndex = 1;
				this.$refs.selectPop.selectArr = [""];
				this.showPop = !this.showPop
			},
			/* tapItem(item) {
				console.log(item)
				if (item.userId == "") {
					this.mutable = false;
					this.$refs.selectPop.selectArr = "";
				} else {
					this.mutable = true;
				}
			}, */
			getUserList(size, page) {
				let params = {
					pageSize: size,
					pageIndex: page
				}

				this.$http.getExhUserList(params).then(res => {
					let data = res.data

					if (data.code == "1000") {
						this.$refs.selectPop.loadSuccessCallback(data.data.length)
						this.selectList = this.selectList.concat(data.data)
						if (this.popValue.length === 0) {
							this.popValue.push(this.sourceData[0].userId)
							this.$refs.selectPop.setSelectArr(this.popValue)
							this.selectDone(this.popValue)
						}

					} else {
						this.$util.toast(res.data.msg)
						this.$refs.selectPop.loadErrorCallback()
					}

				})

			},
			loadCallback(params) {
				this.getUserList(params.size, params.page)
			}
		}
	};
</script>

<style>
	.exhibitor-details {
		margin-right: 30rpx;
		margin-left: 30rpx;
		font-family: PingFangSC-Regular, PingFang SC;
	}

	.select-bar {
		display: flex;
		flex-direction: row;
		word-wrap: normal;
		width: 100%;
		height: 85rpx;
		justify-content: flex-start;
		font-size: 26rpx;
		font-family: PingFangSC-Regular, PingFang SC;
		font-weight: 400;
		color: rgba(0, 0, 0, 0.65);
		background-color: #fff;
		align-items: center;
		flex: 1;
		position: fixed;
		z-index: 1000;
	}

	.select-bar-item {
		margin-left: 30rpx;
	}

	.card-list {
		margin-top: 116rpx;
		margin-bottom: 24rpx;
	}

	.exhibitor-contract-titel {
		display: flex;
		flex-direction: row;
		padding: 16rpx;
		padding-right: 24rpx;
		justify-content: flex-end;
		flex: 1;
		align-items: center;
	}

	.contract-date-title {
		font-size: 22rpx;
		font-weight: 400;
		color: rgba(155, 155, 155, 1);
	}

	.contract-date-time {
		font-size: 28rpx;
		font-weight: 500;
		color: rgba(0, 0, 0, 0.65);
		margin-right: 16rpx;
		margin-left: 10rpx;
		padding-top: 6rpx;
	}

	.exhibitor-item-material {
		display: flex;
		flex-direction: column;
		padding: 24rpx;
		font-family: PingFangSC-Regular, PingFang SC;
		color: rgba(0, 0, 0, 0.65);
	}

	.contract-item {
		font-size: 30rpx;
		font-family: PingFangSC-Regular, PingFang SC;
		font-weight: 400;
		color: rgba(0, 0, 0, 0.65);
		margin-bottom: 8rpx;
	}

	.customer-name {
		font-size: 30rpx;
	}

	.contract-item-details {
		font-size: 24rpx;
		font-family: PingFangSC-Regular, PingFang SC;
		font-weight: 400;
		color: rgba(0, 0, 0, 0.4);
	}

	.headline {
		font-size: 28rpx;
		font-weight: 500;
		color: rgba(0, 0, 0, 0.65);
		margin-bottom: 16rpx;
	}

	.headlines {
		margin-top: 16rpx;
	}
</style>
