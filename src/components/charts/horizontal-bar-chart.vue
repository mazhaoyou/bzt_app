<!-- 横向-条形图 -->
<template>
	<view v-show="show">
		<view :style="{'height': chartH + 'px;'}">
			<mpvue-echarts ref="mpvuecharts" lazyLoad :echarts="echarts" @onInit="initChart" :canvasId="chartID" :throttleTouch="true"></mpvue-echarts>
		</view>
	</view>
</template>

<script>
	import * as echart from "../echarts/echarts.min.js"
	import mpvueEcharts from "../mpvue-echarts/src/echarts.vue"
	export default {
		name: 'barChart',
		components: {
			mpvueEcharts
		},
		props: {
			show: {
				type: Boolean,
				default: true
			}
		},
		data() {
			return {
				echarts: echart,
				chartID: '',
				chart: '',
				chartH: 600,
				load: false,
				labelOption: {
					show: true,
					position: 'right',
					distance: 15,
					align: 'left',
					verticalAlign: 'bottom',
					fontSize: 12,
					color: '#474747',
					fontWeight: 500,
					fontFamily: 'PingFangSC-Medium,PingFang SC',
					formatter: (params) => {
						return this.$util.toQF(params.data.value)
					},
				},
				option: {
					title: {
						text: ''
					},
					legend: {
						data: [],
						left: 12,
						itemGap: 60,
					},
					color: ['#7173F7', '#BFCBFC'],
					grid: {
						containLabel: true
					},
					yAxis: {
						type: 'category',
						data: [],
						axisLine: {
							show: false
						},
						axisTick: {
							show: false
						},
						splitLine: {
							show: false
						},
						axisLabel: {
							color: '#474747',
							fontSize: 12,
							fontFamily: 'PingFangSC-Regular,PingFang SC',
							fontWeight: 400
						}
					},
					xAxis: {
						type: 'value',
						position: 'top',
						axisLine: {
							show: false
						},
						axisTick: {
							show: false
						},
						splitLine: {
							show: false
						},
						axisLabel: {
							color: '#474747',
							fontSize: 12,
							fontFamily: 'PingFangSC-Regular,PingFang SC',
							fontWeight: 400
						}
					},
					series: [{
						name: '',
						type: 'bar',
						data: [],
						barWidth: '60px'
					}]
				}
			}
		},
		methods: {
			init(chartID, title, xAxisData, data) {
				this.option.yAxis.data = []
				this.option.series = []
				var legend = []
				var barW = data.length === 1 ? 30 : 60 / data.length
				// chart高度 = bar总高度 + 总间距 + 150 （其余高度）
				this.chartH = (barW * data.length * xAxisData.length) + (15 * xAxisData.length) + 150
				this.chartID = chartID
				this.option.title.text = title
				this.option.yAxis.data = xAxisData
				data.forEach((item, index) => {
					var option = {
						data: item.data,
						name: item.name,
						type: 'bar',
						barGap: 0,
						label: this.labelOption,
						barWidth: barW
					}
					this.option.series[index] = option
					legend.push(item.name)
				})
				this.option.legend.data = data.length === 1 ? [] : legend
				setTimeout(() => {
					this.$refs.mpvuecharts.init(this.chartID)
				}, 100)
			},
			initChart(e) {
				//  return chart; // 返回 chart 后可以自动绑定触摸操作
				let {
					width,
					height
				} = e
				let canvas = this.$refs.mpvuecharts.canvas
				this.echarts.setCanvasCreator(() => canvas)
				let barChart = this.echarts.init(canvas, null, {
					width: width,
					height: height
				});
				canvas.setChart(barChart)
				barChart.setOption(this.option)
				return barChart
			},
			reloadChart () {}
		},
		onLoad() {},
		created() {},
		mounted() {}
	}
</script>

<style scoped>
	.chart-h {
		height: 600rpx;
	}
</style>
