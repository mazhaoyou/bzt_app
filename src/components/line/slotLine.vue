<!-- 插槽line-常规样式 -->
<template>
	<view class="line-row" @tap="clickLine">
		<view class="slot-line-left-view" v-if="customAlign === 'text-left'">
			<slot></slot>
		</view>
		<text :class="customAlign === 'right' || customAlign === 'text-left' ? 'ub-1' : 'slot-line-text-width'" v-show="text !== ''">{{text}}</text>
		<view v-if="customAlign !== 'text-left'" :class="customAlign === 'left' ? 'ub-1' : ''">
			<slot></slot>
		</view>
	</view>
</template>

<script>
	export default {
		props: {
			// customView 对齐方式:left\right\text-left
			customAlign: {
				type: String,
				default: 'left'
			},
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
	.slot-line-text-width {
		width: 80upx;
	}
	.slot-line-left-view {
		margin-right: 10upx;
	}
</style>
