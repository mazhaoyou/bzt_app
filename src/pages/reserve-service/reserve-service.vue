<!-- 服务预定 -->
<template>
	<view class="reserve-booth">
		<view v-for="item in serviceList" :key="item.srjID">
			<card-list>
				<view slot="content" class="card-list">
					<text class="reserve-booth-item">服务名称: {{item.srjName}}</text>
					<text class="reserve-booth-item">服务类别: {{item.typName }}</text>
					<text class="reserve-booth-item">价格: {{item.srjSalePrice |toDecimal2 }}</text>
					<view class="booth-number">
						<text class="reserve-booth-item">预定数量:</text>
						<input placeholder="0" type="number" v-model="item.num" @input="inputData(item)" class="booth-number-input" />
					</view>
				</view>
			</card-list>
		</view>
		<view v-if="serviceList.length == 0">
			<no-data isHint="true"></no-data>
		</view>
		
	</view>
</template>

<script>
	import cardList from '@/components/card-list/card-list.vue';
	import noData from "@/components/no-data/no-data.vue"
	export default {
		components: {
			cardList,
			noData
		},
		data() {
			return {
				timeout: null,
				serviceList: [],
				atrId: "",
				dataList: []
			};
		},
		onLoad(options) {
			this.atrId = options.atrId;
			this.getServiceBookList();
		},
		onNavigationBarButtonTap(e) {
			if (e.index === 0) {
				var _this = this;
				clearTimeout(this.timeout);
				this.timeout = setTimeout(function() {
					_this.submitBoot();
					clearTimeout(_this.timeout);
				}, 1000);
			}
		},
		methods: {
			/* 提交实际 */
			submitBoot() {
				//数据过滤
				let arr = this.serviceList.filter(function(item) {
					return item.num > 0;
				})
				arr = JSON.stringify(arr, ['srjID', 'num']);
				let arg = {
					atrId: this.atrId,
					items: JSON.parse(arr)
				}
				this.$http.saveServiceBook(arg).then(res => {
					let data = res.data;
					if (data.code == "1000") {
						this.$util.toast("预定完成");
						uni.navigateBack();
					} else {
						this.$util.toast(data.msg);
					}
				})
			},
			inputData(item) {
				let _this = this;
					if (item.num > item.srjTotalNum && item.srjTotalNum >0  ) {
						this.$util.toast("目前最多只能预订" + item.srjTotalNum + "个");
						this.$set(item, "num", item.srjTotalNum)
					}
				_this.dataList.push({
					srjID: item.srjID,
					num: item.num
				})

			},
			/* 获取列表 */
			getServiceBookList() {
				let arg = {
					AtrID: this.atrId
				}
				this.$http.serviceBook(arg).then(res => {
					let data = res.data;
					if (data.code == '1000') {
						this.serviceList = data.data;
					} else {
						this.$util.toast(data.msg)
					}
				})
			}
		}
	};
</script>

<style>
	/* #ifdef APP-PLUS */
	page {
		width: 100%;
		min-height: 100%;
		display: flex;
	}
	/* #endif */
	.reserve-booth {
		width: 100%;
		flex: 1;
		flex-direction: column;
		overflow: hidden;
		background-color: #f6f6f6;
		/* #ifdef MP-ALIPAY || MP-BAIDU */
		height: 100vh;
		/* #endif */
	}
	.card-list {
		display: flex;
		flex-direction: column;
		padding: 24rpx;

	}
	.reserve-booth-item {
		font-size: 28rpx;
		font-weight: 400;
		color: rgba(0, 0, 0, 0.65);
		margin-bottom: 8rpx;
	}
	.booth-number {
		display: flex;
		flex-direction: row;
		margin-top: 8rpx;
		align-items: center;
	}
	.booth-number-input {
		border-bottom-width: 1rpx;
		border-bottom-color: rgba(0, 0, 0, 0.15);
		border-bottom-style: solid;
		margin-left: 8rpx;
		padding: 0;
		width: 260rpx;
		margin-top: -16rpx;
		font-size: 28rpx;
	}
</style>
