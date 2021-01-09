<!-- 实现列表项，
isSelect 控制是否显示跳转箭头
title 左边标题
-->
<template>
		<view class="form-item" >
			<view class="item-title">
				<text class="sign" v-if="isSign">*</text>
				<text class="item-title">{{ title }}</text>
			</view>
			<view class="item-input-column"  v-if="!isSelect" >
				<input class="item-input" :type="isType" :placeholder="placeholder" v-model="inputValue" @input="inputed" :disabled="isDisabled" />
			</view>
			<view class="item-title" v-if="isSelect">
				<text class="item-title item-select" v-if="selectText != ''">{{ selectText }}</text>
				<text class="item-title" v-if="selectText == ''">{{ placeholder }}</text>
				<text class="iconfont icon-youjiantou">&#xe636;</text>
			</view>
		</view>
	
</template>

<script>
export default {
	props: {
		isSign: {
			type: Boolean,
			default: true
		},
		title: {
			type: String,
			default: '联络人'
		},
		placeholder: {
			type: String,
			default: ''
		},
		isType: {
			type: String,
			default: 'text'
		},
		isDisabled: {
			type: Boolean,
			default: true
		},
		isSelect: {
			type: Boolean,
			default: true
		},
		selectText: {
			type: String,
			default: ''
		},
		inValue:{
			type:String,
			default:''
		}
	},
	data() {
		return {
			inputValue: '..'
		};
	},
	onReady() {
		this.inputValue = this.inValue;
	},
	methods: {
		inputed(event) {
			/* console.log(this.inputValue);
			console.log(event.detail); */
		}
	}
};
</script>

<style scoped>
.form-item {
	display: flex;
	flex-direction: row;
	align-items: center;
	justify-content: space-between;
	border-bottom-style: solid;
	border-bottom-width: 4rpx;
	border-bottom-color: #f6f6f6;
	padding-left: 24rpx;
	padding-right: 24rpx;
	height: 88rpx;
}
.item-title {
	display: flex;
	flex-direction: row;
	align-items: center;
	font-size: 30rpx;
	font-family: PingFangSC-Regular, PingFang SC;
	font-weight: 400;
	color: rgba(0, 0, 0, 0.4);
}
.item-input-column {
	display: flex;
	flex: 1;
	flex-direction: row;
}
.item-input {
	width:100%;
	margin-left: 30rpx;
	text-align: right;
	margin-right: 30rpx;
	color: rgba(0, 0, 0, 0.65);
	border: none;
	font-size: 30rpx;
	font-family: PingFangSC-Regular, PingFang SC;
	font-weight: 400;
}
.item-select {
	color: rgba(0, 0, 0, 0.65);
}
.icon-youjiantou {
	margin-left: 24rpx;
	font-size: 24rpx;
	margin-top: 6rpx;
}
.sign {
	color: #d0021b;
}
</style>
