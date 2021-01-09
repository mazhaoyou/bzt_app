<!-- 报表-头部tab -->
<template>
	<view class="re-header">
	<view class="re-header-view">
		<view class="re-header-tabs-view">
			<view class="re-header-tab" v-for="(item, index) in tabs" :key="index" @tap="changeCurrent(index)">
				<text class="re-header-tab-text">{{item}}</text>
			</view>
		</view>
		<view class="re-header-tab-line" :style="getBoxStyle"></view>
		<!-- <view class="select-view" @tap="tapPop">
			<text class="re-header-tab-text">筛选</text>
			<text class="iconfont">&#xe637;</text>
		</view> -->
	</view>
	</view>
</template>
<script>
	import {
		mapState,
		mapGetters,
		mapMutations
	} from 'vuex'
	export default {
		name: 'repost-header',
		components: {},
		props: {
			tabs: {
				type: Array,
				default: () => {
					return []
				}
			}
		},
		computed: {
			...mapGetters(['getExhUserList']),
			getCurrent() {
				const current = Number(this.current);
				if (current > (this.getTabs.length - 1)) {
					return (this.getTabs.length - 1)
				}
				return current;
			},
			getTabs() {
				return this.tabs;
			},
			getLw() {
				const lineWidth = 100;
				const lw = Number(50) * (lineWidth / 100);
				return lw;
			},
			getBoxStyle() {
				const lw = this.getLw;
				const x = Number(187.5) * (this.getCurrent + 1) - Number(187.5) / 2 - lw / 2;
				return `transform:translate(${x}rpx, -100%);width:${this.getLw}rpx;`;
			},
		},
		data () {
			return {
				current: 0,
				showPop: false,
				popValue: [],
				page: 1,
				size: 10000,
				sourceData: [],
			}
		},
		onLoad () {},
		methods: {
			changeCurrent (index) {
				this.current = index
				this.$emit('change', index)
			}
		},
		mounted() {}
	}
</script>

<style>
	.re-header {
		position: fixed;
		top: calc(44px + var(--status-bar-height));
		border-bottom-style: solid;
		border-bottom-width: 1rpx;
		border-bottom-color: #FFFFFF;
		z-index: 990;
	}
	.re-header-view {
		display: flex;
		flex-direction: row;
		background-color: #FFFFFF;
		height: 85rpx;
		width: 750rpx;
		position: relative;
	}
	.re-header-tabs-view {
		width: 750rpx;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: center;
		transition: all .3s;
	}
	.re-header-tab {
		width: 187.5rpx;
		align-items: center;
		justify-content: center;
		height: 100%;
		text-align: center;
		display: flex;
		flex-direction: column;
	}
	.re-header-tab-text {
		font-size:26rpx;
		font-family:PingFangSC-Regular,PingFang SC;
		font-weight:400;
		color: rgba(0,0,0,0.65);
	}
	.select-view {
		flex: 1;
		align-items: center;
		display: flex;
		justify-content: flex-end;
	}
	.iconfont {
		margin-right: 30rpx;
		margin-left: 16rpx;
		color: #BFBFBF;
		font-size: 23rpx;
	}
	.re-header-tab-line {
		width: 50rpx;
		height: 4rpx;
		background: #6567FA;
		border-radius: 2rpx;
		pointer-events: none;
		position: absolute;
		bottom: 0;
		left: 0;
		transition-property: all;
		transition-duration: .5s;
	}
</style>
