<!-- 自定义radio -->
<template>
	<view class="bzt-radio-view" @tap="clickRadio">
		<view class="bzt-radio-unselect">
			<view v-if="selectd" class="bzt-radio-selectd"></view>
		</view>
		<slot></slot>
	</view>
</template>

<script>
	export default {
		props: {
			selectd: {
				type: Boolean,
				default: false
			}
		},
		methods: {
			clickRadio () {
				this.$emit('change', this.selectd)
			}
		}
	}
</script>

<style scoped>
	.bzt-radio-view {
		display: flex;
		flex-direction: row;
		align-items: center;
		transition: all .5s;
	}
	.bzt-radio-unselect {
		width: 10px;
		height: 10px;
		border-width: 1px;
		border-color: #BFBFBF;
		border-style: solid;
		border-radius: 10px;
		padding-top: 1px;
		padding-left: 1px;
	}
	.bzt-radio-selectd {
		width: 9px;
		height: 9px;
		border-radius: 9px;
		background-color: #4B4EFA;
	}
</style>
