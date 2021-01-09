<template>
	<view class="tag-line-row">
		<view class="tag-dot"></view>
		<text class="tag-line-view tag-line-text">{{text}}</text>
	</view>
</template>

<script>
	export default {
		props: {
			// 文字
			text: {
				type: String,
				default: ''
			}
		},
		components: {},
		data(){
			return {}
		},
		methods: {},
	}
</script>

<style scoped>
	.tag-line-row {
		display: flex;
		flex-direction: row;
		background-color: #F6F6F6;
		height: 38rpx;
		padding-top: 24rpx;
		/* padding-bottom: 15rpx; */
		align-items: center;
		padding-left: 30rpx;
		padding-right: 30rpx;
	}
	.tag-line-view {
		flex: 1;
	}
	.tag-line-text {
		font-size:26rpx;
		font-family:PingFangSC-Regular,PingFang SC;
		font-weight:400;
		color:rgba(0,0,0,0.65);
	}
	.tag-dot {
		width:10rpx;
		height:10rpx;
		border-radius: 50%;
		background-color:#4B4EFA;
		display: inline-block;
		/* vertical-align: middle; */
		margin-right: 16rpx;
	}
</style>
