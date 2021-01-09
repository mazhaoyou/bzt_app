<template>
	<view class="line-row" @tap="clickLine">
		<text v-show="text !== ''" class="line-row-text">{{text}}</text>
		<text v-show="subText !== ''">{{subText}}</text>
		<text v-show="arrow" class="line-icon line-row-icon">&#xe470;</text>
	</view>
</template>

<script>
	export default {
		props: {
			// 左边文字
			text: {
				type: String,
				default: ''
			},
			// 右边文字
			subText: {
				type: String,
				default: ''
			},
			// 是否显示箭头
			arrow: {
				type: Boolean,
				default: false
			}
		},
		components: {},
		data(){
			return {
				
			}
		},
		methods: {
			// 点击
			clickLine () {
				this.$emit('clickLine')
			}
		},
	}
</script>

<style scoped>
	@font-face {
		font-family: uniicons;
		font-weight: normal;
		font-style: normal;
		src: url('../../static/uni.ttf') format('truetype');
	}
	
	.line-row-text {
		flex: 1;
	}
	
	.line-row-icon {
		margin-left: 15px;
		color: #999999;
		font-size: 14px;
		font-weight: normal;
	}
	
	.line-icon {
		font-family: uniicons;
		font-weight: normal;
	}
</style>
