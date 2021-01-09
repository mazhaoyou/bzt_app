<template>
	<view @tap="clickLine">
		<view class="home-top-line"></view>
		<view class="home-line-view home-line-text">
			<view class="ub-1 ub ub-align-center">
				<view class="tag-dot"></view>
				<text>{{text}}</text>
			</view>
			<view class="ub ub-align-center">
				<slot></slot>
				<text class="iconfont">&#xe636;</text>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		props: {
			// 左边文字
			text: {
				type: String,
				default: ''
			}
		},
		components: {},
		data(){
			return {}
		},
		methods: {
			clickLine () {
				this.$emit('clickLine')
			}
		},
	}
</script>

<style scoped>
	.home-top-line {
		height:8rpx;
		background-color:#F6F6F6;
	}
	/* #ifndef APP-PLUS-NVUE */
	.home-line-view {
		height: 90rpx;
		display: flex;
		align-items: center;
		padding-left: 46rpx;
		padding-right: 24rpx;
	}
	/* #endif */
	.home-line-text {
		font-size:30rpx;
		font-family:PingFangSC-Regular,PingFang SC;
		font-weight:400;
		color:rgba(0,0,0,0.65);
	}
	.iconfont {
		font-size:32rpx;
		margin-left: 24rpx;
		color: #BFBFBF;
	}
</style>
