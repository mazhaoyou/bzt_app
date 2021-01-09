<!-- 条形图-报表-合同 -->
<template>
	<view class="chart-h">
		<mpvue-echarts ref="mpvuecharts" lazyLoad :echarts="echarts" @onInit="initChart" :canvasId="chartID" :throttleTouch="true"></mpvue-echarts>
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
		data() {
			return {
				echarts: echart,
				chartID: '',
				chart: '',
				colors: ['#4B4EFA', '#C470FF'],
				labelOption: {
				    show: true,
				    position: 'insideTop',
				    distance: 15,
				    align: 'middle',
				    verticalAlign: 'middle',
				    fontSize: 12,
				    color: '#FFFFFF',
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
					grid: {
						left: '15%',
						width: '70%',
						containLabel: true
					},
					xAxis: {
						type: 'category',
						data: [],
						axisLine: { show: false },
						axisTick: { show: false },
						splitLine: { show: false },
						axisLabel: {
							color: '#474747',
							fontSize: 12,
							fontFamily: 'PingFangSC-Regular,PingFang SC',
							fontWeight: 400
						}
					},
					yAxis: {
						type: 'value',
						axisLine: { show: false },
						axisTick: { show: false },
						splitLine: { show: false },
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
			init (chartID, title, xAxisData, data) {
			  this.chartID = chartID
			  this.option.title.text = title
			  this.option.xAxis.data = xAxisData
			  var seriesData = data.map((d, index) => {
				  var obj = {value: d, itemStyle: {color: this.colors[index]}}
				  return obj
			  })
			  this.option.series[0].data = seriesData
			  this.option.series[0].label = this.labelOption
			  this.$refs.mpvuecharts.init(this.chartID)
			},
			initChart(e) {
			 //  return chart; // 返回 chart 后可以自动绑定触摸操作
			 let { width, height } = e
			 let canvas = this.$refs.mpvuecharts.canvas
			 this.echarts.setCanvasCreator(() => canvas)
			 let barChart = this.echarts.init(canvas, null, {
				 width: width,
				 height: height
			 });
			 canvas.setChart(barChart)
			 barChart.setOption(this.option)
			 this.$refs.mpvuecharts.setChart(barChart)
			}
		},
		onLoad () {},
		created () {},
		mounted () {}
	}
</script>

<style scoped>
	.chart-h {
		height: 600rpx;
	}
</style>

