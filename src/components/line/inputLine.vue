<template>
	<view class="line-row">
		<text v-show="text !== ''">{{text}}</text>
		<input class="line-row-input" placeholder="placeholder" :type="type" :password="password" :disabled="disabled" :value="value" />
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
			// 输入框默认文字
			placeholder: {
				type: String,
				default: ''
			},
			// input 的类型
			type: {
				type: String,
				default: 'text'
			},
			// 是否是密码类型
			password: {
				type: Boolean,
				default: false
			},
			// 是否禁用
			disabled: {
				type: Boolean,
				default: false
			},
			// 输入框的初始内容
			value: {
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
	.line-row-input {
		height: 50upx;
		padding: 15upx 25upx;
		line-height:50upx;
		font-size:28upx;
		background:#FFF;
		flex: 1;
	}
</style>
