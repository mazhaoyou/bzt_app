<template>
	<view class="nodata-view">
		<view @tap="reload">
			<image mode="aspectFit" class="nodata-img" src="/static/noData.png"></image>
			<view class="hint-border" v-if="isHint"><text class="hint">{{hint}}</text></view>
		</view>
	</view>
</template>

<script>
	export default {
		name: 'no-data',
		props: {
			hint: {
				type: String,
				default: "暂无数据"
			},
			isHint: {
				type: Boolean,
				default: false
			}
		},
		methods: {
			/**
			 * 点击刷新
			 * */
			reload() {
				this.$emit('reload')
			}
		}
	}
</script>

<style scoped>
	.nodata-view {
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.nodata-img {
		width: 369rpx;
	}

	.hint-border {
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.hint {
		font-size: 30rpx;
		font-family: PingFangSC-Medium, PingFang SC;
		font-weight: 500;
		color: rgba(0, 0, 0, 0.4);
	}
</style>
