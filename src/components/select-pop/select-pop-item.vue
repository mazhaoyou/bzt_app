<template>
	<view class="select-pop-item-view" :class="{'item-center': align==='center'}" @tap="tapItem">
		<view class="pop-icon-view">
			<text class="pop-item-text" :class="{'select-color': selectd&&align==='center' }">{{item[labelKey]}}</text>
		</view>
		<view v-if="align === 'left'" v-show="selectd">
			<text class="iconfont">&#xe652;</text>
		</view>
	</view>
</template>

<script>
	export default {
		props: {
			/**
			 * 文字对齐方式
			 * */
			align: {
				type: String,
				default: 'left'
			},
			item: {
				type: Object,
				default: () => {
					return {
						label: '',
						value: ''
					}
				}
			},
			selectd: {
				type: Boolean,
				default: false
			},
			labelKey: {
				type: String,
				default: 'label'
			},
		},
		methods: {
			tapItem () {
				this.$emit('tapItem', this.item)
			}
		},
		mounted () {
			
		}
	}
</script>

<style scoped>
	.select-pop-item-view {
		padding-top: 20rpx;
		padding-bottom: 20rpx;
		padding-left: 20rpx;
		padding-right: 20rpx;
		display: flex;
		flex-direction: row;
		align-items: center;
		border-bottom-color: #F6F6F6;
		border-bottom-style: solid;
		border-bottom-width: 1rpx;
	}
	.iconfont {
		color: #4B4EFA;
	}
	.select-color {
		color: #4B4EFA !important;
	}
	.pop-icon-view {
		flex: 1;
	}
	.pop-item-text {
		font-size:28rpx;
		font-family:PingFangSC-Regular,PingFang SC;
		font-weight:400;
		color:rgba(0,0,0,0.65);
	}
	.item-center {
		text-align: center;
	}
</style>
