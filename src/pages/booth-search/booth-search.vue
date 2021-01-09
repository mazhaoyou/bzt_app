<!-- 展位搜索 -->
<template>
	<view class="container">
		<view v-if="isHistory" class="history-box">
			<view v-if="dataList.length > 0">
				<view class="history-title">
					<text>搜索历史</text>
					<text class="uni-icon uni-icon-trash" @click="clearSearch">清除历史</text>
				</view>
				<view class="history-content">
					<view class="history-item" v-for="(item, index) in dataList" :key="index">
						{{ item.atrName }}
					</view>
				</view>
			</view>
			<view v-else class="no-data">您还没有历史记录</view>
		</view>
		<view v-else class="history-box">
			<view v-if="dataList.length > 0" class="history-list-box">

				<view class="card-list-container" v-for="(item,index) in dataList" :key="item.bthId">
						<card-list>
							<view slot="content" class="card-list" @tap="listTap(index)">
								<view class="checkbox-group">
									<text class="iconfont checkbox-group active" v-if="item.checked">&#xe61d;</text>
									<text class="iconfont checkbox-group" v-else>&#xe65e;</text>
								</view>
								<text class="card-list-id">展位号: {{item.bthCode}}</text>
								<text class="card-list-item">所属展厅：{{item.room}}</text>
								<text class="card-list-item">展位类别：{{item.bthType}}</text>
								<text class="card-list-item">展位面积(㎡)：{{item.bthArea}}</text>
								<text class="card-list-item">展位价格：{{item.bthTotal | toDecimal2}}</text>
								<text class="card-list-item">价格单位：{{item.unit}}</text>
							</view>
						</card-list>
					</view>

				</view>
				<view v-else class="no-data">没有搜索到相关内容</view>
			</view>
		</view>
</template>

<script>
	import cardList from '@/components/card-list/card-list.vue';
	export default {
		components: {
			cardList
		},
		data() {
			return {
				dataList: [],
				isHistory: true,
				list: [],
				flng: true,
				timer: null,
				checked: true,
				atrId:"",
				pageIndex:1,
				pageSize:50
			};
		},
		onLoad(option) {
			this.atrId = option.atrId;
			// 本示例用的是高德 sdk ，请根据具体需求换成自己的服务器接口。
			this.dataList = uni.getStorageSync('search:history');
		},
		methods: {
			/**
			 * 列表点击
			 */
			listTap(index) {
				if (this.dataList[index].checked) {
					this.$set(this.dataList[index], "checked", false)
				} else {
					this.$set(this.dataList[index], "checked", true)
				}
			},
			/**
			 * 清理历史搜索数据
			 */
			clearSearch() {
				uni.showModal({
					title: '提示',
					content: '是否清理全部搜索历史？该操作不可逆。',
					success: res => {
						if (res.confirm) {
							/* 						this.dataList = util.removeHistory();
							 */
						}
					}
				});
			},
			/* 获得可预订展位*/
			getBoothList(text) {

				let arg = {
					srmId:0,
					bthCode:text,
					pageIndex:this.pageIndex,
					pageSize:this.pageSize
				}
				this.$http.boothList(arg).then(res => {
					let data = res.data;
					if (data.code == "1000") {
						this.dataList = data.data.items;
					} else {
						this.$util.toast(data.msg);
					}
				})
			},
			saveData() {
				let _this = this;
				let arr = _this.dataList.filter(function(item) {
					return item.checked == true;
				})
				let results = arr.map(item => item.bthId);
				if (results.length == 0) {
					this.$util.toast("请选择要预定的展位");
					return;
				}
				let data = {
					atrId: this.atrId,
					bthIds: results
				}
				_this.$http.subscribeBooth(data).then(res => {
					let data = res.data;
					console.log(data)
					if (data.code == "1000") {
						this.$util.toast("预定完成");
						uni.hideKeyboard();
						uni.navigateBack({
							    delta: 2
						});
					} else {
						_this.$util.toast(data.msg);
					}
				})
			},
		},

		/**
		 * 当 searchInput 输入时触发
		 */
		onNavigationBarSearchInputChanged(e) {
			let _this = this;

			let text = e.text;
			if (!text) {
				this.isHistory = true;
				this.dataList = [];
				this.dataList = uni.getStorageSync('search:history');
				return;
			} else {
				this.isHistory = false;
				clearTimeout(this.timer);
				_this.timer = setTimeout(function() {
					_this.getBoothList(text);
				}, 500)
			}
		},
		/**
		 * 点击软键盘搜索按键触发
		 */
		onNavigationBarSearchInputConfirmed(e) {
			let text = e.text;
			if (!text) {
				this.isHistory = true;
				this.dataList = [];
				this.dataList = uni.getStorageSync('search:history');
				uni.showModal({
					title: '提示',
					content: '请输入内容。',
					success: res => {
						if (res.confirm) {}
					}
				});
				return;
			} else {
				this.getBoothList(text);
			}
		},
		/**
		 *  点击导航栏 buttons 时触发
		 */
		onNavigationBarButtonTap() {
			this.saveData();
		}
	};
</script>

<style>
	.container {
		display: flex;
		width: 100%;
		background-color: rgba(246, 246, 246, 1);
		flex-direction: column;
		flex: 1;
		min-height: 100vh;
	}
	.history-title {
		display: flex;
		justify-content: space-between;
		padding: 20upx 30upx;
		padding-bottom: 0;
		font-size: 34upx;
		color: #333;
	}

	.history-title .uni-icon {
		font-size: 40upx;
	}

	.history-content {
		display: flex;
		flex-wrap: wrap;
		padding: 15upx;
	}

	.history-item {
		padding: 4upx 35upx;
		border: 1px #f1f1f1 solid;
		background: #fff;
		border-radius: 50upx;
		margin: 12upx 10upx;
		color: #999;
	}

	.history-list-box {
		/* margin: 10upx 0; */
	}

	.history-list-item {
		padding: 30upx 0;
		margin-left: 30upx;
		border-bottom: 1px #EEEEEE solid;
		font-size: 28upx;
	}

	.no-data {
		text-align: center;
		color: #999;
		margin: 100upx;
	}

	.select-bar-item {
		margin-left: 30rpx;
	}

	.card-list {
		display: flex;
		flex-direction: column;
		padding: 24rpx;
	}

	.card-list-id {
		font-size: 28rpx;
		font-weight: 400;
		color: rgba(0, 0, 0, 0.65);
		margin-bottom: 34rpx;
		margin-top: -26rpx;
	}

	.card-list-item {
		font-size: 24rpx;
		font-weight: 400;
		color: rgba(0, 0, 0, 0.4);
		margin-top: 8rpx;
	}

	.checkbox-group {
		display: flex;
		align-self: flex-end;
		font-size: 30rpx;
		color: rgba(0, 0, 0, 0.15);
		margin-top: -6rpx;
		margin-right: -6rpx;
	}

	.active {
		color: #4b4efa;
	}
</style>
