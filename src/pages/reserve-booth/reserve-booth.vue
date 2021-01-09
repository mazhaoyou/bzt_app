<!-- 展位预定 -->
<template>
	<view class="container">
		<view class="select-bar">
			<view class="select-bar-item" @tap='tapPop'>
				<text>选择展厅</text>
				<text class="iconfont">&#xe637;</text>
			</view>
		</view>
		<view class="card-list-container">
			<view v-for="(item,index) in dataList" :key="item.bthId">
				<card-list>
					<view slot="content" class="card-list" @tap="isCheckboxed(index)">
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
			<view v-if="dataList.length == 0">
				<no-data isHint="true"></no-data>
			</view>

		</view>
		<select-pop ref="selectPop" :show="showPop" @showchange='tapPop' @done="selectDone"  :sourceData="getRoomsList"   :mutable="false" labelKey="srmName" valueKey="srmId"></select-pop>
		<uni-load-more :status="status"></uni-load-more>
	</view>
</template>

<script>
	import slFilter from '@/components/sl-filter/sl-filter.vue';
	import cardList from '@/components/card-list/card-list.vue';
	import selectPop from "@/components/select-pop/select-pop.vue";
	import noData from "@/components/no-data/no-data.vue";
	import uniLoadMore from '@/components/uni-load-more/uni-load-more.vue';
	import {
		mapState,
		mapGetters,
		mapMutations
	} from 'vuex'
	export default {
		components: {
			slFilter,
			cardList,
			selectPop,
			noData,
			uniLoadMore
		},
		data() {
			return {
				timeout: null,
				checked: true,
				filterResult: '',
				dataList: [],
				srmId: 0,
				atrId: '',
				atrName: "",
				showPop:false,
				pageIndex:1,
				pageSize:10,
				isRefresh: false,
				hasNext: true,
				status: 'more',
			};
		},
		onLoad(options) {
			this.atrId = options.atrId;
			this.atrName = options.atrName;
			this.$store.dispatch("getExhBasicList");
		},
		onShow() {
			this.getBoothList();
		},
		computed: {
			...mapGetters(['getPriceList', 'getRoomsList'])
		},
		onPullDownRefresh() {
			this.pageIndex = 1;
			this.getBoothList();
			this.isRefresh = true;
		},
		onReachBottom() {
			this.isRefresh = false;
			if (this.hasNext){
				this.getBoothList();
			}
			
		},
		methods: {
			tapPop () {
				this.showPop = !this.showPop;
				this.$refs.selectPop.selectArr = [0];
			},
			selectDone(value){
				this.srmId = value;
				this.pageIndex = 1;
				this.getBoothList(value);
			},
			/* 选择预订的展会 */
			isCheckboxed(index) {
				if (this.dataList[index].checked) {
					this.$set(this.dataList[index], "checked", false)
				} else {
					this.$set(this.dataList[index], "checked", true)
				}
			},
			/* 保存数据 */
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
						uni.navigateBack();
					} else {
						_this.$util.toast(data.msg);
					}
				})
			},
			/* 获得可预订的展位列表 */
			getBoothList() {
				let _this = this;
				let arg = {
					srmId: this.srmId,
					bthCode:"",
					pageIndex:this.pageIndex,
					pageSize:this.pageSize
				}
				if (!_this.isRefresh) {
					_this.status = "loading";
				}
				this.$http.boothList(arg).then(res => {
					let data = res.data;
					if (data.code == "1000") {
						/* this.dataList = data.data; */
						uni.stopPullDownRefresh();
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
					} else {
						this.$util.toast(data.msg);
					}
				})
			}
		},
		onNavigationBarButtonTap(e) {
			if (e.index == 0) {
				var _this = this;
				clearTimeout(this.timeout);
				this.timeout = setTimeout(function() {
					_this.saveData();	//预订展位
					clearTimeout(_this.timeout);
				}, 1000);
			} else if (e.index == 1) {
				if (!this.$util.getPrivilegeById("p2000002050101")) {
					this.$util.showModal("您目前没有新增展位权限");
					return;
				}
				uni.navigateTo({
					url: `/pages/append-booth/append-booth?atrId=${this.atrId}&atrName=${this.atrName}`
				})
				
			} else if (e.index == 2) {
				uni.navigateTo({
					url: `/pages/booth-search/booth-search?atrId=${this.atrId}&atrName=${this.atrName}`
				})

			}
		}
	};
</script>

<style scoped>
	.container {
		display: flex;
		width: 100%;
		background-color: rgba(246, 246, 246, 1);
		flex-direction: column;
		flex: 1;
		min-height: 100vh;
	}

	.card-list-container {
		margin-top: 85rpx;
		margin-bottom: 24rpx;
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
