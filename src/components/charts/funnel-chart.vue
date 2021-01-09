<!-- 漏斗图 -->
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
				option: {
					title: {
						text: '',
						subtext: ''
					},
					toolbox: {
						feature: {
							dataView: {readOnly: false},
							restore: {},
							saveAsImage: {}
						}
					},
					calculable: true,
					color: ['#C470FF', '#4B2DF7', '#4B4EFA', '#6988FF', '#BFCBFC'],
					series: [
						{
							name:'漏斗图',
							type:'funnel',
							left: '10%',
							top: 60,
							//x2: 80,
							bottom: 60,
							width: '60%',
							// min: 0,
							// max: 100,
							minSize: '0%',
							maxSize: '100%',
							sort: 'descending',
							gap: 1,
							label: {
								show: true,
								formatter: '{b}: {c}'
							},
							labelLine: {
								length: 10,
								lineStyle: {
									width: 1,
									type: 'solid'
								}
							},
							itemStyle: {
								borderColor: '#fff',
								borderWidth: 1
							},
							data: []
						}
					]
				}
			}
		},
		methods: {
			init (chartID, title, data) {
			  this.chartID = chartID
			  this.option.series[0].data = data
			  this.option.title.text = title
			  this.$refs.mpvuecharts.init(this.chartID)
			},
			initChart(e) {
			 //  return chart; // 返回 chart 后可以自动绑定触摸操作
			 let { width, height } = e
			 let canvas = this.$refs.mpvuecharts.canvas
			 this.echarts.setCanvasCreator(() => canvas)
			 let funnelChart = this.echarts.init(canvas, null, {
				 width: width,
				 height: height
			 });
			 canvas.setChart(funnelChart)
			 funnelChart.setOption(this.option)
			 this.$refs.mpvuecharts.setChart(funnelChart)
			}
		},
		onLoad () {},
		created () {},
		mounted () {}
	}
</script>

<style scoped>
	.chart-h {
		height: 700rpx;
	}
</style>
