<!-- 条形图-报表-展位 -->
<template>
	<view class="chart-h" @touchmove.stop.prevent="returnHandle">
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
				isShowInfo: false, // 是否展示info
				labelOption: {
				    show: true,
				    position: 'insideBottom',
				    distance: 15,
				    align: 'right',
				    verticalAlign: 'middle',
				    rotate: -90,
				    fontSize: 12,
				    color: '#FFFFFF',
				    fontWeight: 500,
				    fontFamily: 'PingFangSC-Medium,PingFang SC',
					formatter: (params) => {
						return this.isShowInfo ? params.data.value + ' (' +  params.data.info + ')' : params.data.value
					},
				},
				option: {
					title: {
						text: ''
					},
					legend: {
						data:[],
						left: 12,
						itemGap: 60,
					},
					animation: false,
					dataZoom: [{
						startValue: '',
						endValue: '',
						zoomLock: true,
					}, {
						type: 'inside'
					}],
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
					color: ['#4B2DF7', '#7173F7', '#C470FF'],
					series: []
				}
			}
		},
		methods: {
			returnHandle () {},
			init (chartID, title, xAxisData, data) {
			  this.chartID = chartID
			  this.option.title.text = title
			  this.option.xAxis.data = xAxisData
			  var legend = []
			  data.forEach((item, index) => {
				var option = {
					data: item.data,
					name: item.name,
					type: 'bar',
					barGap: 0,
					label: this.labelOption
				}
			    this.option.series[index] = option
				legend.push(item.name)
			  })
			  var startValue = ''
			  var endValue = ''
			  if (xAxisData.length >= 3) {
				  startValue = xAxisData[0]
				  endValue = xAxisData[2]
			  }
			  if (xAxisData.length > 1 && xAxisData.length < 3) {
				  startValue = xAxisData[0]
				  endValue = xAxisData[xAxisData.length - 1]
			  }
			  this.option.dataZoom[0].startValue = startValue
			  this.option.dataZoom[0].endValue = endValue
			  this.option.legend.data = legend
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
		mounted () {
			// var data = [
			// 				{
			// 					data: [{value:320, 'info': 20}, {value:332, 'info': 30}, {value:301, 'info': 10}, {value:334, 'info': 10}, {value:394, 'info': 50}],
			// 					name: '已预定',
			// 				},
			// 				{
			// 					data: [{value:220, 'info': 20}, {value:182, 'info': 30}, {value:191, 'info': 10}, {value:234, 'info': 10}, {value:290, 'info': 50}],
			// 					name: '已签合同',
			// 				},
			// 				{
			// 					data: [{value:98, 'info': 20}, {value:77, 'info': 30}, {value:101, 'info': 10}, {value:99, 'info': 10}, {value:40, 'info': 50}],
			// 					name: '已付款',
			// 				}
			// 			]
			// var xAxisData = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri']
			// this.init('testChart', '', xAxisData, data)
		}
	}
</script>

<style scoped>
	.chart-h {
		height: 600rpx;
	}
</style>
