<template>
	<view @tap="clickItem">
		<view class="e-pop-item-view">
			<text :class="select ? 'e-pop-text-select' : 'e-pop-text-def'">{{item.exhName}}</text>
			<text v-if="select" class="iconfont e-pop-icon">&#xe652;</text>
		</view>
	</view>
</template>

<script>
	export default {
		components: {},
		props: {
			item: {
				type: Object,
				default: () => {
					return {
						exhName: '',
						exhId: ''
					}
				}
			},
			select: {
				type: Boolean,
				default: false
			}
		},
		data(){
			return {}
		},
		created() {},
		methods: {
			clickItem () {
				this.$emit('clickItem', this.item)
			}
		}
	}
</script>

<style scoped>
	.e-pop-item-view {
		flex-direction: row;
		margin-top: 16rpx;
		height: 42rpx;
	}
	.iconfont {
		font-size: 36rpx;
		color: #2FF3A4;
	}
	.e-pop-icon {
		padding-right: 30rpx;
	}
	.e-pop-text-def {
		flex: 1;
		padding-left: 24rpx;
		font-size:30rpx;
		font-family:PingFangSC-Regular,PingFang SC;
		font-weight:400;
		color: #FFFFFF;
	}
	.e-pop-text-select {
		flex: 1;
		padding-left: 24rpx;
		font-size:30rpx;
		font-family:PingFangSC-Regular,PingFang SC;
		font-weight:400;
		color: #3AF4A9;
	}
	
</style>
