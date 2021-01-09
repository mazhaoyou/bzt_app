<template>
	<div class="calendar-pop-view">
		<calendar ref="calendar" :insert="true" :range="true" :disableFold="true" />
	</div>
</template>

<script>
	import calendar from "./uni-calendar.vue"
	export default {
		components: {
			calendar
		},
		mounted () {
			this.$refs.calendar.setFlodStatus(false)
		},
		methods: {}
	}
</script>

<style scoped>
	.calendar-pop-view {
		position: fixed;
		width: 690rpx;
		height: 642rpx;
		top: 50%;
		left: 50%;
		margin-top: -321rpx;
		margin-left: -345rpx;
		box-shadow: 16px 16px 20px 16px rgba(0,0,0,0.3);
		background-color: #FFFFFF;
		border-radius: 10px;
	}
</style>
