<!-- 实现边框圆角功能
slot name="top" 为标题部分
slot name="content" 为内容部分 -->
 
<template>
	<view>
		<view class="card-list-title">
			<slot name="top"></slot>
		</view>
		<view class="card-list-content">
			<slot name="content"></slot>
		</view>
	</view>
</template>

<script>
	export default {
		name: 'cardList',
		data() {
			return {

			};
		}
	}
</script>

<style lang="scss" scoped>
	.card-list-title {
		display: flex;
		flex-direction: row;
		margin-left: 30rpx;
		margin-right: 30rpx;
		margin-top: 16rpx;
		background: rgba(255, 255, 255, 1);
		border-radius: 10rpx;
		align-items: center;
	}

	.card-list-content {
		margin-left: 30rpx;
		margin-right: 30rpx;
		margin-top: 2rpx;
		background: rgba(255, 255, 255, 1);
		border-radius: 10rpx 8rpx 8rpx 8rpx;
	}
</style>
