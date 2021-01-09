<template>
	<view class="select-pop-box">
		<view :class="{'select-pop-mask':showPicker}" @tap="maskClick" catchtouchmove="true"></view>
		<view class="select-pop-view" :class="{'select-pop-show':showPicker}">
			<view class="pop-btn" catchtouchmove="true" @tap.stop="returnHandle">
				<view @tap="cancel">取消</view>
				<view :style="{color:themeColor}" @tap="done">确定</view>
			</view>
			<view v-if="!isLoadMore" class="content-view" @tap.stop="returnHandle">
				<select-pop-item v-for="item in sourceData" :key="item[valueKey]" :align='align' :valueKey='valueKey' :labelKey='labelKey'
				 :item="item" :selectd="selectArr.indexOf(item[valueKey]) !== -1" @tapItem="tapItem"></select-pop-item>
			</view>
			<view v-if="isLoadMore" class="content-view" @tap.stop="returnHandle">
				<mescoll :fixed="false" :down="downOption" @down="downCallback" :up="upOption" @up="upCallback" @init="mescrollInit">
					<select-pop-item v-for="item in sourceData" :key="item[valueKey]" :align='align' :valueKey='valueKey' :labelKey='labelKey'
					 :item="item" :selectd="selectArr.indexOf(item[valueKey]) !== -1" @tapItem="tapItem"></select-pop-item>
				</mescoll>
			</view>
		</view>
	</view>
</template>

<script>
	import selectPopItem from "./select-pop-item.vue"
	import mescoll from "../mescroll-uni/mescroll-uni.vue"
	export default {
		name: 'select-pop',
		components: {
			selectPopItem,
			mescoll
		},
		props: {
			/**
			 * 是否启用懒加载 true: 初始化后自动加载数据 false：初始化完成后需调用reload()方法加载数据 （只在isLoadMore==true的情况有效）
			 * */
			lazyLoad: {
				type: Boolean,
				default: true
			},
			/**
			 * 值类型：value：只返回 value，item：返回 {value: any, item: Objact}. 默认 value
			 * */
			valueType: {
				type: String,
				default: 'value'
			},
			/**
			 * 文字对齐方式
			 * */
			align: {
				type: String,
				default: 'left'
			},
			/**
			 * 是否开启加载更多 默认关闭
			 * */
			isLoadMore: {
				type: Boolean,
				default: false
			},
			/**
			 * 自定义 value-key
			 * */
			valueKey: {
				type: String,
				default: 'value'
			},
			/**
			 * 自定义 label-key
			 * */
			labelKey: {
				type: String,
				default: 'label'
			},
			/**
			 * 是否开启多选
			 * */
			mutable: {
				type: Boolean,
				default: true
			},
			/**
			 * 数据源 Array : [ { label: '展示项', value: '携带数据value' }, ... ]
			 * */
			sourceData: {
				type: Array,
				default: () => {
					return []
				}
			},
			/**
			 * 默认展示的值
			 */
			value: {
				type: Array,
				default () {
					return []
				}
			},
			//是否显示
			show: {
				type: Boolean,
				default: false
			},
			/**
			主题色
			*/
			themeColor: {
				type: String,
				default: '#4C83D6'
			}
		},
		created() {},
		data() {
			return {
				selectArr: this.value,
				showPicker: this.show,
				mescroll: null,
				downOption: {
					use: false,
					auto: this.lazyLoad, // 自动加载
				},
				upOption: {
					use: true,
					auto: false, // 不自动加载a
					page: {
						num: 1, // 当前页码,默认0,回调之前会加1,即callback(page)会从1开始
						size: 10 // 每页数据的数量
					},
					noMoreSize: 4, //如果列表已无数据,可设置列表的总数量要大于半页才显示无更多数据;避免列表数据过少(比如只有一条数据),显示无更多数据会不好看; 默认5
					textNoMore: '-- 我是有底线的 --'
				}
			}
		},
		watch: {
			show(isShow) {
				this.showPicker = isShow
			}
		},
		computed: {},
		methods: {
			tapItem(item) {
				if (!this.mutable || item[this.valueKey] === "") {
					this.selectArr = []
				}
				var idx = this.selectArr.indexOf("")
				if (item[this.valueKey] !== "" && idx != -1) {
					this.selectArr.splice(idx, 1)
				}
				var index = this.selectArr.indexOf(item[this.valueKey])
				if (index === -1) {
					this.selectArr.push(item[this.valueKey])
					this.$emit('tapItem', item)
					return
				}
				this.selectArr.splice(index, 1)
				this.$emit('tapItem', item)
			},
			/**
			 * 赋值方法-选中数组
			 * */
			setSelectArr(arr) {
				this.selectArr = arr
			},
			returnHandle() {},
			maskClick() {
				this.$emit("showchange", false)
			},
			/**
			 * 完成方法 多选状态下返回数组，非多选状态下返回值
			 * */
			done() {
				if (this.selectArr == '') {
					this.selectArr = []
				}
				var selectArr = this.selectArr.filter(d => {		// 剔除空字符串项
					return d !== ""
				})
				if (this.valueType === 'item') { // valueType 为item 模式
					var valueMap = {}
					this.sourceData.map(d => {
						valueMap[d[this.valueKey]] = d
					})
					var itemValue = selectArr.map(d => {
						var obj = {
							value: d,
							item: valueMap[d]
						}
						return obj
					})
					var value = this.mutable ? itemValue : itemValue[0]
					this.$emit('done', value)
				}
				if (this.valueType === 'value') { // valueType 为value 模式
					var onceValue = this.selectArr.length == 0 ? '' : this.selectArr[0]
					var value = this.mutable ? selectArr : onceValue
					this.$emit('done', value)
				}
				this.maskClick()
			},
			/**
			 * 取消方法
			 * */
			cancel() {
				this.maskClick()
			},
			// mescroll组件初始化的回调,可获取到mescroll对象
			mescrollInit(mescroll) {
				this.mescroll = mescroll
			},
			/*下拉刷新的回调 */
			downCallback(mescroll) {
				// 这里加载你想下拉刷新的数据, 比如刷新轮播数据
				// 下拉刷新的回调,默认重置上拉加载列表为第一页 (自动执行 mescroll.num=1, 再触发upCallback方法 )
				// mescroll.resetUpScroll()
				var params = {
					page: 1,
					size: 10
				}
				this.$emit('loadCallback', params)
			},
			/*上拉加载的回调: mescroll携带page的参数, 其中num:当前页 从1开始, size:每页数据条数,默认10 */
			upCallback(mescroll) {
				var params = {
					page: mescroll.num,
					size: mescroll.size
				}
				this.$emit('loadCallback', params)
			},
			/**
			 * 刷新方法
			 * */
			reload() {
				this.mescroll.triggerDownScroll()
			},
			/**
			 * 加载成功callback
			 * @param {number}  size : 加载数据个数
			 * */
			loadSuccessCallback(size) {
				this.mescroll.endSuccess(size)
			},
			loadErrorCallback() {
				this.mescroll.endErr()
			}
		}
	}
</script>

<style>
	.no-scroll {
		overflow: hidden;
		position: fixed;
		height: 100%;
	}
	.content-view {
		height: 600rpx;
		background-color: #FFFFFF;
		overflow: scroll;
	}

	.select-pop-box {
		position: fixed;
		top: 0;
		z-index: 3000;
	}

	.select-pop-mask {
		position: fixed;
		z-index: 3000;
		top: 0;
		right: 0;
		left: 0;
		bottom: 0;
		background: rgba(0, 0, 0, 0.6);
	}

	.select-pop-view {
		position: fixed;
		bottom: 0;
		left: 0;
		width: 100%;
		transition: all 0.3s ease;
		transform: translateY(100%);
		z-index: 3000;
	}

	.select-pop-show {
		transform: translateY(0);
	}

	.pop-btn {
		display: flex;
		padding: 9px 15px;
		background-color: #fff;
		position: relative;
		text-align: center;
		font-size: 17px;
	}

	.pop-btn:after {
		content: ' ';
		position: absolute;
		left: 0;
		bottom: 0;
		right: 0;
		height: 1px;
		border-bottom: 1px solid #e5e5e5;
		color: #e5e5e5;
		transform-origin: 0 100%;
		transform: scaleY(0.5);
	}

	.pop-btn view {
		display: block;
		flex: 1;
		color: #1aad19;
	}

	.pop-btn view:first-child {
		text-align: left;
		color: #888;
	}

	.pop-btn view:last-child {
		text-align: right;
	}
</style>
