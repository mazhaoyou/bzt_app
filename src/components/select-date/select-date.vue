<!-- 选择时间组件|报表使用 -->
<template>
	<view class="select-date-view">
		<view @tap="showRange" class="select-date-center">
			<text class="iconfont">&#xe654;</text>
			<text class="select-date-text">{{changeDateFormat(start, '-', '.')}}-{{changeDateFormat(end, '-', '.')}}</text>
		</view>
		<!-- <range-picker
		:show="showPicker"
		@change="change"
		:value="[start, end]"
		@cancel="cancel"
		fields="day"
		@showchange="showRange"
		themeColor="#4B4EFA"
		></range-picker> -->
	</view>
</template>

<script>
	import rangePicker from "../range-dtpicker/range-dtpicker.vue"
	export default {
		components: {
			rangePicker
		},
		props: {
			// 默认天数 （ 30 - 今天 ）
			defDay: {
				type: Number,
				default: -30
			},
			notiKey: {
				type: String,
				default: ''
			}
		},
		data() {
			return {
				start: this.$util.getBeforeDate(new Date(), this.defDay, 'day', '-'),
				end: this.$util.formatByDayTimeStamp(new Date().getTime(), '-'),
				showPicker: false
			}
		},
		methods: {
			showRange () {
				// this.showPicker = !this.showPicker
				// this.showPicker ? uni.hideTabBar() : uni.showTabBar()
				var value = [this.start, this.end]
				var params = {
					value: value,
					notiKey: this.notiKey
				}
				uni.$emit('showDatePop', params)
			},
			change (value) {
				this.start = value[0]
				this.end = value[1]
			},
			cancel () {},
			// 日期格式转换 dateStr：原始串 before： 原始连接符号 after：使用连接符号
			changeDateFormat (dateStr, before, after) {
				var arr = dateStr.split(before)
				return arr.join(after)
			}
		},
		mounted () {
			uni.$on(this.notiKey, (value) => {
				this.change(value)
			})
		}
	}
</script>

<style scoped>
	.select-date-view {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: flex-end;
		padding-top: 24rpx;
		padding-right: 24rpx;
		z-index: 3000;
	}
	.select-date-center {
		display: flex;
		align-items: center;
	}
	.iconfont {
		color: #4B4EFA;
		font-size: 20rpx;
		margin-right: 8rpx;
	}
	.select-date-text {
		font-size:24rpx;
		font-family:PingFangSC-Regular,PingFang SC;
		font-weight:400;
		color: #4B4EFA;
	}
</style>
