<!-- 报表 -->
<template>
	<view class="rp-view">
		<view>
			<navi :fixed="true" title="报表" :status-bar="true" :border="false"></navi>
			<report-header ref="reHeader" :tabs='tabs' @change="changeCurrent"></report-header>
		</view>
		<swiper class="re-swiper" :disable-touch="true" :touchable="false" :current="current" @change="swiperChange">
			<!-- 报表-展商 -->
			<swiper-item class="re-swiper-item">
				<view class="re-scroll">
					<re-exhibitor ref="reExh"></re-exhibitor>
				</view>
			</swiper-item>
			<!-- 报表-展位 -->
			<swiper-item class="re-swiper-item">
				<view class="re-scroll">
					<re-booth ref="reBooth"></re-booth>
				</view>
			</swiper-item>
			<!-- 报表-合同 -->
			<swiper-item class="re-swiper-item">
				<view class="re-scroll">
					<re-contract ref="reContact"></re-contract>
				</view>
			</swiper-item>
			<!-- 报表-业绩 -->
			<swiper-item class="re-swiper-item">
				<view class="re-scroll">
					<re-performance ref="rePerformance"></re-performance>
				</view>
			</swiper-item>
		</swiper>
		<!-- 日期选择器 -->
		<range-picker :show="showPicker" @change="changeDate" :value="[start, end]" @cancel="cancelDate" fields="day"
		 @showchange="showRange" themeColor="#4B4EFA">
		</range-picker>
		<select-pop ref="selectPop" :lazyLoad="false" :sourceData="popSource" :mutable="popMutable" @done="selectPopDone" :show="showPop"
		 @showchange='clickPop' :labelKey="labelKey" :valueKey="valueKey">
		</select-pop>
	</view>
</template>

<script>
	import navi from "../../../components/uni-nav-bar/uni-navi.vue"
	import reportHeader from "./report-header.vue"
	import reExhibitor from "../../report/report-exhibitor.vue"
	import reBooth from "../../report/report-booth.vue"
	import reContract from "../../report/report-contract.vue"
	import rePerformance from "../../report/report-performance.vue"
	import selectDate from "../../../components/select-date/select-date.vue"
	import rangePicker from "../../../components/range-dtpicker/range-dtpicker.vue"
	import selectPop from "../../../components/select-pop/select-pop.vue"
	import {
		mapState,
		mapGetters,
		mapMutations
	} from 'vuex'
	export default {
		components: {
			navi,
			reportHeader,
			reExhibitor,
			reBooth,
			reContract,
			rePerformance,
			selectDate,
			rangePicker,
			selectPop
		},
		data() {
			return {
				tabs: ['展商', '展位', '合同', '业绩'],
				selectList: [],
				current: 0,
				showPicker: false,
				start: this.$util.getBeforeDate(new Date(), -30, 'day', '-'),
				end: this.$util.formatByDayTimeStamp(new Date().getTime(), '-'),
				dateNotiKey: '', // 监听 select-date Key
				popSource: [], // 选择弹框数据源
				popMutable: false, // pop框 是否多选
				labelKey: 'label',	// pop框 labelKey
				valueKey: 'value',	// pop框 valueKey
				showPop: false, // 是否展示选择弹框
				fristLoad: true, // 是否是第一次加载
				popNotiKey: '', // 监听 select-pop Key
			}
		},
		watch: {
			current(val, old) {
				if (val == old) {
					return
				}
				switch (val) {
					case 0:
						// 展商
						var pStatus = this.privilege("p3000001")
						if (pStatus) {
							this.$refs.reExh.loadData()
						}
						break;
					case 1:
						// 展位
						var pStatus = this.privilege("p3000002")
						if (pStatus) {
							this.$refs.reBooth.loadData()
						}
						break;
					case 2:
						// 合同
						var pStatus = this.privilege("p3000003")
						if (pStatus) {
							this.$refs.reContact.loadData()
						}
						break;
					case 3:
						// 业绩
						var pStatus = this.privilege("p3000004")
						if (pStatus) {
							this.$refs.rePerformance.loadData()
						}
						break;
					default:
						break;
				}
			}
		},
		computed: {
			...mapGetters(['needLoadReport', 'getExhUserList', 'getUserInfo'])
		},
		onShow() {
			if (!this.$util.getPrivilegeById("p30000")) {
				this.$util.showModal("提示", "暂无权限", () => {
					uni.switchTab({
						url: "/pages/tabs/home/home"
					})
				})
				return
			}
			if (this.fristLoad) {
				this.getCurrent()
				this.fristLoad = false
			}
			if (this.needLoadReport) {
				this.getCurrent()
				this.reSetUserList()
				this.loadReport(false)
			}
			// this.privilege("p3000001")
			this.setData()
		},
		onHide() {
			uni.hideLoading()
		},
		methods: {
			...mapMutations(['loadReport']),
			/**
			 * 获取数据相关
			 * */
			setData () {
				if (this.current == 0) {
					this.$refs.reExh.getData(true, false)
					this.$refs.reBooth.getData(false, true)
					this.$refs.reContact.getData(false, true)
					this.$refs.rePerformance.getData(false, true)
				}
				if (this.current == 1) {
					this.$refs.reExh.getData(false, true)
					this.$refs.reBooth.getData(true, false)
					this.$refs.reContact.getData(false, true)
					this.$refs.rePerformance.getData(false, true)
				}
				if (this.current == 2) {
					this.$refs.reExh.getData(false, true)
					this.$refs.reBooth.getData(false, true)
					this.$refs.reContact.getData(true, false)
					this.$refs.rePerformance.getData(false, true)
				}
				if (this.current == 3) {
					this.$refs.reExh.getData(false, true)
					this.$refs.reBooth.getData(false, true)
					this.$refs.reContact.getData(false, true)
					this.$refs.rePerformance.getData(true, false)
				}
			},
			/**
			 * 切换展会后重置UserList
			 * */
			reSetUserList() {
				this.$refs.reExh.userList = []
				this.$refs.reBooth.userList = []
				this.$refs.reContact.userList = []
				this.$refs.rePerformance.userList = []
			},
			swiperChange(e) {
				this.current = e.detail.current
				this.$refs.reHeader.current = e.detail.current
			},
			changeCurrent(index) {
				this.current = index
			},
			/**
			 * 选择日期相关 | 因scroll-view 中不能使用 fixed 所以改为使用——观察者模式
			 * */
			changeDate(value) {
				this.start = value[0]
				this.end = value[1]
				uni.$emit(this.dateNotiKey, value)
			},
			showRange() {
				this.showPicker = !this.showPicker
				this.showPicker ? uni.hideTabBar() : uni.showTabBar()
			},
			cancelDate() {},
			/**
			 * 选择弹框相关 | 因scroll-view 中不能使用 fixed 所以改为使用——观察者模式
			 * */
			selectPopDone(value) {
				var val = value.length == 0 ? [""] : value
				if (this.popNotiKey === 'reExhibitorUserPop') {			// 展商-选择用户
					this.$refs.reExh.userList = val
					this.$refs.reExh.getData(true, false)
					return
				}
				if (this.popNotiKey === 'reBoothUserPop') {				// 展位-选择用户
					this.$refs.reBooth.userList = val
					this.$refs.reBooth.getData(true, false)
					return
				}
				if (this.popNotiKey === 'reContractUserPop') {			// 合同-选择用户
					this.$refs.reContact.userList = val
					this.$refs.reContact.getData(true, false)
					return
				}
				if (this.popNotiKey === 'rePerformanceUserPop') {		// 业绩-选择用户
					this.$refs.rePerformance.userList = val
					this.$refs.rePerformance.getData(true, false)
					return
				}
				uni.$emit(this.popNotiKey, value)
			},
			clickPop() {
				this.showPop = !this.showPop
				if (this.showPop) {
					uni.hideTabBar()
					return
				}
				uni.showTabBar()
			},
			/**
			 * 权限相关
			 * @param {number} val : Tab index
			 * @param {number} old : 上次 Tab index
			 * @param {string} pid		 : 权限ID 
			 * */
			privilege(pid) {
				var _this = this
				if (!this.$util.getPrivilegeById(pid)) {
					this.$util.showModal("提示", "暂无权限", () => {})
				}
				return this.$util.getPrivilegeById(pid)
			},
			/**
			 * 根据权限设置当前current
			 * */
			getCurrent() {
				this.current = 0
				// 展商
				var pStatus1 = this.$util.getPrivilegeById("p3000001")
				if (pStatus1) {
					this.current = 0
					this.$refs.reHeader.current = 0
					return
				}
				// 展位
				var pStatus2 = this.$util.getPrivilegeById("p3000002")
				if (pStatus2) {
					this.current = 1
					this.$refs.reHeader.current = 1
					return
				}
				// 合同
				var pStatus3 = this.$util.getPrivilegeById("p3000003")
				if (pStatus3) {
					this.current = 2
					this.$refs.reHeader.current = 2
					return
				}
				// 业绩
				var pStatus4 = this.$util.getPrivilegeById("p3000004")
				if (pStatus4) {
					this.current = 3
					this.$refs.reHeader.current = 3
					return
				}
			}
		},
		mounted() {
			// 监听-选择日期弹框
			uni.$on('showDatePop', (params) => {
				this.showRange()
				this.start = params.value[0]
				this.end = params.value[1]
				this.dateNotiKey = params.notiKey
			})
			// 监听-选择框
			uni.$on('showSelectPop', (params) => {
				this.labelKey = 'label'
				this.valueKey = 'value'
				this.popSource = params.popSource
				this.popNotiKey = params.popNotiKey
				this.$refs.selectPop.selectArr = params.popValue
				this.popMutable = params.mutable
				this.clickPop()
			})
			// 监听-人员选择框
			uni.$on('showSelectUserPop', (params) => {
				this.labelKey = 'userName'
				this.valueKey = 'userId'
				this.popSource = this.getExhUserList
				this.popNotiKey = params.popNotiKey
				this.$refs.selectPop.selectArr = params.popValue.length == 0 ? [""] : params.popValue			// 如果传递出来的是空数组 那么选择不限
				this.popMutable = params.mutable
				this.clickPop()
			})
		}
	}
</script>

<style scoped>
	.webviewStyles {
		height: auto;
	}

	.rp-view {
		height: 100vh;
		display: flex;
		flex-direction: column;
		background-color: #F6F6F6;
	}

	.re-tab-view {
		margin-top: 85rpx;
		flex: 1;
		display: flex;
		flex-direction: column;
	}

	.re-swiper {
		margin-top: 85rpx;
		flex: 1;
	}

	.re-swiper-item {
		display: flex;
		background-color: #FFFFFF;
		flex-direction: column;
	}

	.re-scroll {
		flex: 1;
		overflow: scroll;
	}
</style>
