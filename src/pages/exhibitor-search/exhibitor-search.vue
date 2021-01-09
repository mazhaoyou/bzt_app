<template>
	<view class="wrapper">
		<view v-if="isHistory" class="history-box">
			<view v-if="historyList.length > 0">
				<view class="history-title">
					<text>搜索历史</text>
					<text class="uni-icon uni-icon-trash" @click="clearSearch">清除历史</text>
				</view>
				<view class="history-content">
					<view class="history-item" v-for="(item, index) in historyList" :key="index">
						{{ item.atrName }}
					</view>
				</view>
			</view>
			<view v-else class="no-data">您还没有历史记录</view>
		</view>
		<view v-else class="history-box">
			<view v-if="historyList.length > 0" class="history-list-box">
				<view
					class="history-list-item"
					v-for="(item, index) in historyList"
					:key="index"
					@click="listTap(item)"
				>
				<text>{{item.atrName}}</text>
					<!-- <rich-text :nodes="item.nameNodes"></rich-text> -->
				</view>
				
			</view>
			<view v-else class="no-data">没有搜索到相关内容</view>
		</view>
	</view>
</template>

<script>

export default {
	data() {
		return {
			historyList: [],
			isHistory: true,
			list: [],
			flng: true,
			timer: null,
			exhibitorList:""
		};
	},
	onLoad() {
		// 本示例用的是高德 sdk ，请根据具体需求换成自己的服务器接口。
		this.historyList = uni.getStorageSync('search:history');
	},
	methods: {
		/**
		 * 列表点击
		 */
		listTap(item) {
		    uni.navigateTo({
		    	url:`/pages/exhibitor/exhibitor-detail?atrId=${item.atrId}`
		    })
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
/* 						this.historyList = util.removeHistory();
 */					}
				}
			});
		},
	   /* 获得展商列表*/
		getExhibitorsList(text) {
			console.log(22)
			let data = {
				actorNameText:text,
				actorStatus: [],
				seeSelfData: [],
				atrSaleIndex: [],
				pageSize: '20',
				pageIndex: '1'
			};
			this.$http
				.getActorListData(data)
				.then(res => {
					console.log(22)
					let data = res.data;
					if (data.code == '1000') {
						this.historyList = data.data.items;
					}
				})
				.catch(e => {});
		}
	},
	
	/**
	 * 当 searchInput 输入时触发
	 */
	onNavigationBarSearchInputChanged(e) {
		let _this = this;

		let text = e.text;
		if (!text) {
			this.isHistory = true;
			this.historyList = [];
			this.historyList = uni.getStorageSync('search:history');
			return;
		} else {
			this.isHistory = false;
			clearTimeout(this.timer);
			_this.timer = setTimeout(function(){
				console.log(222)
				_this.getExhibitorsList(text);
			},500)
		}
	},
	/**
	 * 点击软键盘搜索按键触发
	 */
	onNavigationBarSearchInputConfirmed(e) {
		let text = e.text;
		if (!text) {
			this.isHistory = true;
			this.historyList = [];
			this.historyList = uni.getStorageSync('search:history');
			uni.showModal({
				title: '提示',
				content: '请输入内容。',
				success: res => {
					if (res.confirm) {
					}
				}
			});
			return;
		} else {
			this.getExhibitorsList(text);
		}
	},
	/**
	 *  点击导航栏 buttons 时触发
	 */
	onNavigationBarButtonTap() {
		uni.hideKeyboard();
		uni.navigateBack();
	}
};
</script>

<style>
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
</style>
