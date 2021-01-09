<template>
	<view class="w-picker">
		<view class="mask" :class="{ show: showPicker }" @tap="maskTap" @touchmove.stop.prevent catchtouchmove="true"></view>
		<view class="w-picker-cnt" :class="{ show: showPicker }">
			<view class="w-picker-hd" @touchmove.stop.prevent catchtouchmove="true">
				<view class="w-picker-btn" @tap="pickerCancel">取消</view>
				<view class="w-picker-btn" :style="{ color: themeColor }" @tap="pickerConfirm">确定</view>
			</view>
			<view class="w-picker-view" v-if="mode == 'linkage'">
				<picker-view :indicator-style="itemHeight" :value="pickVal" @change="bindChange" @touchstart="touchStart" @touchend="touchEnd">
					<picker-view-column v-for="(col, colIndex) in data" :key="colIndex">
						<view class="w-picker-item" v-for="(item, index) in col" :key="index">{{ item.label }}</view>
					</picker-view-column>
				</picker-view>
			</view>
			<view class="w-picker-view" v-if="mode == 'half'">
				<picker-view :indicator-style="itemHeight" :value="pickVal" @change="bindChange" @touchstart="touchStart" @touchend="touchEnd">
					<picker-view-column>
						<view class="w-picker-item" v-for="(item, index) in data.years" :key="index">{{ item }}年</view>
					</picker-view-column>
					<picker-view-column>
						<view class="w-picker-item" v-for="(item, index) in data.months" :key="index">{{ item }}月</view>
					</picker-view-column>
					<picker-view-column>
						<view class="w-picker-item" v-for="(item, index) in data.days" :key="index">{{ item }}日</view>
					</picker-view-column>
					<picker-view-column>
						<view class="w-picker-item" v-for="(item, index) in data.areas" :key="index">{{ item.label }}</view>
					</picker-view-column>
				</picker-view>
			</view>
			<view class="w-picker-view" v-if="mode == 'date'">
				<picker-view :indicator-style="itemHeight" :value="pickVal" @change="bindChange" @touchstart="touchStart" @touchend="touchEnd">
					<picker-view-column>
						<view class="w-picker-item" v-for="(item, index) in data.years" :key="index">{{ item }}年</view>
					</picker-view-column>
					<picker-view-column>
						<view class="w-picker-item" v-for="(item, index) in data.months" :key="index">{{ item }}月</view>
					</picker-view-column>
					<picker-view-column>
						<view class="w-picker-item" v-for="(item, index) in data.days" :key="index">{{ item }}日</view>
					</picker-view-column>
				</picker-view>
			</view>
			<view class="w-picker-view" v-if="mode == 'yearMonth'">
				<picker-view :indicator-style="itemHeight" :value="pickVal" @change="bindChange" @touchstart="touchStart" @touchend="touchEnd">
					<picker-view-column>
						<view class="w-picker-item" v-for="(item, index) in data.years" :key="index">{{ item }}年</view>
					</picker-view-column>
					<picker-view-column>
						<view class="w-picker-item" v-for="(item, index) in data.months" :key="index">{{ item }}月</view>
					</picker-view-column>
				</picker-view>
			</view>
			<view class="w-picker-view" v-if="mode == 'dateTime'">
				<picker-view :indicator-style="itemHeight" :value="pickVal" @change="bindChange" @touchstart="touchStart" @touchend="touchEnd">
					<picker-view-column>
						<view class="w-picker-item" v-for="(item, index) in data.years" :key="index">{{ item }}年</view>
					</picker-view-column>
					<picker-view-column>
						<view class="w-picker-item" v-for="(item, index) in data.months" :key="index">{{ item }}月</view>
					</picker-view-column>
					<picker-view-column>
						<view class="w-picker-item" v-for="(item, index) in data.days" :key="index">{{ item }}日</view>
					</picker-view-column>
					<picker-view-column>
						<view class="w-picker-item" v-for="(item, index) in data.hours" :key="index">{{ item }}时</view>
					</picker-view-column>
					<picker-view-column>
						<view class="w-picker-item" v-for="(item, index) in data.minutes" :key="index">{{ item }}分</view>
					</picker-view-column>
					<picker-view-column>
						<view class="w-picker-item" v-for="(item, index) in data.seconds" :key="index">{{ item }}秒</view>
					</picker-view-column>
				</picker-view>
			</view>
			<view class="w-picker-view" v-if="mode == 'range'">
				<picker-view :indicator-style="itemHeight" :value="pickVal" @change="bindChange" @touchstart="touchStart" @touchend="touchEnd">
					<picker-view-column>
						<view class="w-picker-item" v-for="(item, index) in data.fyears" :key="index">{{ item }}</view>
					</picker-view-column>
					<picker-view-column>
						<view class="w-picker-item" v-for="(item, index) in data.fmonths" :key="index">{{ item }}</view>
					</picker-view-column>
					<picker-view-column>
						<view class="w-picker-item" v-for="(item, index) in data.fdays" :key="index">{{ item }}</view>
					</picker-view-column>
					<picker-view-column>
						<view class="w-picker-item">-</view>
					</picker-view-column>
					<picker-view-column>
						<view class="w-picker-item" v-for="(item, index) in data.tyears" :key="index">{{ item }}</view>
					</picker-view-column>
					<picker-view-column>
						<view class="w-picker-item" v-for="(item, index) in data.tmonths" :key="index">{{ item }}</view>
					</picker-view-column>
					<picker-view-column>
						<view class="w-picker-item" v-for="(item, index) in data.tdays" :key="index">{{ item }}</view>
					</picker-view-column>
				</picker-view>
			</view>
			<view class="w-picker-view" v-if="mode == 'time'">
				<picker-view :indicator-style="itemHeight" :value="pickVal" @change="bindChange" @touchstart="touchStart" @touchend="touchEnd">
					<picker-view-column>
						<view class="w-picker-item" v-for="(item, index) in data.hours" :key="index">{{ item }}时</view>
					</picker-view-column>
					<picker-view-column>
						<view class="w-picker-item" v-for="(item, index) in data.minutes" :key="index">{{ item }}分</view>
					</picker-view-column>
					<picker-view-column>
						<view class="w-picker-item" v-for="(item, index) in data.seconds" :key="index">{{ item }}秒</view>
					</picker-view-column>
				</picker-view>
			</view>
			<view class="w-picker-view" v-if="mode == 'region'">
				<picker-view :indicator-style="itemHeight" :value="pickVal" @change="bindChange" @touchstart="touchStart" @touchend="touchEnd">
					<picker-view-column>
						<view class="w-picker-item" v-for="(item, index) in data.provinces" :key="index">{{ item.label }}</view>
					</picker-view-column>
					<picker-view-column>
						<view class="w-picker-item" v-for="(item, index) in data.citys" :key="index">{{ item.label }}</view>
					</picker-view-column>
					<picker-view-column v-if="!hideArea">
						<view class="w-picker-item" v-for="(item, index) in data.areas" :key="index">{{ item.label }}</view>
					</picker-view-column>
				</picker-view>
			</view>
			<view class="w-picker-view" v-if="mode == 'selector'">
				<picker-view :indicator-style="itemHeight" :value="pickVal" @change="bindChange" @touchstart="touchStart" @touchend="touchEnd">
					<picker-view-column>
						<view class="w-picker-item" v-for="(item, index) in data" :key="index">{{ item[opt] }}</view>
					</picker-view-column>
				</picker-view>
			</view>
			<view class="w-picker-view" v-if="mode == 'limit'">
				<picker-view :indicator-style="itemHeight" :value="pickVal" @change="bindChange" @touchstart="touchStart" @touchend="touchEnd">
					<picker-view-column>
						<view class="w-picker-item" v-for="(item, index) in data.date" :key="index">{{ item.label }}</view>
					</picker-view-column>
					<picker-view-column>
						<view class="w-picker-item" v-for="(item, index) in data.hours" :key="index">{{ item.label }}时</view>
					</picker-view-column>
					<picker-view-column>
						<view class="w-picker-item" v-for="(item, index) in data.minutes" :key="index">{{ item.label }}分</view>
					</picker-view-column>
				</picker-view>
			</view>
			<view class="w-picker-view" v-if="mode == 'limitHour'">
				<picker-view :indicator-style="itemHeight" :value="pickVal" @change="bindChange" @touchstart="touchStart" @touchend="touchEnd">
					<picker-view-column>
						<view class="w-picker-item" v-for="(item, index) in data.date" :key="index">{{ item.label }}</view>
					</picker-view-column>
					<picker-view-column>
						<view class="w-picker-item" v-for="(item, index) in data.areas" :key="index">{{ item.label }}</view>
					</picker-view-column>
					<picker-view-column>
						<view class="w-picker-item" v-for="(item, index) in data.hours" :key="index">{{ item.label }}时</view>
					</picker-view-column>
				</picker-view>
			</view>
		</view>
	</view>
</template>

<script>
	import initPicker from "./w-picker.js";

	function oneOf(value, validList) {
		console.log(value)
		console.log(validList)
		for (let i = 0; i < validList.length; i++) {
			if (value === validList[i]) {
				return true;
			}
		}
		throw new Error('mode无效，请选择有效的mode!');
		return false;
	}
	export default {
		props: {
			mode: {
				type: String,
				/* 	validator(mode) {
						let modeList = ['half', 'date', 'dateTime', 'yearMonth', 'time', 'region', 'selector', 'limit', 'limitHour', 'range', 'linkage']; //过滤无效mode;
						return oneOf(mode, modeList);
					}, */
				default () {
					return 'selector';
				}
			},
			themeColor: {
				type: String,
				default () {
					return '#4C83D6';
				}
			},
			startYear: {
				type: [String, Number],
				default () {
					return '1970';
				}
			},
			endYear: {
				type: [String, Number],
				default () {
					return new Date().getFullYear() + '';
				}
			},
			defaultVal: {
				type: Array,
				default () {
					return [0, 0, 0, 0, 0, 0, 0];
				}
			},
			areaCode: {
				type: Array,
				default () {
					return null;
				}
			},
			hideArea: {
				//隐藏省市区三级联动   地区列
				type: Boolean,
				default: false
			},
			step: {
				type: [String, Number],
				default: 1
			},
			current: {
				type: Boolean,
				default: false
			},
			selectList: {
				type: Array,
				default () {
					return [];
				}
			},
			//以下参数仅对mode==limit有效
			dayStep: {
				type: [String, Number],
				default: 7
			},
			startHour: {
				type: [String, Number],
				default: 8
			},
			endHour: {
				type: [String, Number],
				default: 20
			},
			minuteStep: {
				type: [String, Number],
				default: 10
			},
			afterStep: {
				type: [String, Number],
				default: 30
			},
			disabledAfter: {
				type: Boolean,
				default: false
			},
			linkList: {
				type: Array,
				default () {
					return [];
				}
			},
			value: {
				type: Array,
				default () {
					return null;
				}
			},
			level: {
				type: [Number, String],
				default: 2
			},
			timeout: {
				type: Boolean,
				default: false
			},
			opt: {
				type: String,
				default: 'opt'
			},
			optkey: {
				type: String,
				default: 'code'
			}
		},
		data() {
			return {
				result: [],
				data: {},
				checkArr: [],
				checkValue: [],
				pickVal: [],
				showPicker: false,
				resultStr: '',
				itemHeight: `height: ${uni.upx2px(88)}px;`,
				confirmFlag: true
			};
		},
		onReady() {
			console.log(this.mode)
			console.log(this.startYear)
			console.log(this.defaultVal)
		},
		computed: {},

		watch: {
			mode() {
				this.initData();
			},
			selectList() {
				this.initData();
			},
			linkList() {
				this.initData();
			}
		},
		methods: {
			touchStart() {
				if (this.timeout) {
					this.confirmFlag = false;
				}
			},
			touchEnd() {
				if (this.timeout) {
					setTimeout(() => {
						this.confirmFlag = true;
					}, 500);
				}
			},
			getLinkageVal(value, flag) {
				let dval = [];
				let arr = value;
				let list = this.linkList;
				let lev = this.level;
				let k = 0;
				let checkArr = [];
				let checkValue = [];
				let resultStr = '';
				let data = [];
				switch (lev) {
					case 2:
						dval = [0, 0];
						break;
					case 3:
						dval = [0, 0, 0];
						break;
				}
				const getData = (obj, key, str) => {
					if (key < lev) {
						data.push(obj);
						if (arr.length == 7) {
							let item = obj[0];
							checkArr.push(item.label);
							checkValue.push(item.value);
							resultStr += item.label;
							if (item.children) {
								getData(item.children, (key += 1));
							}
						} else {
							obj.map((v, j) => {
								if (flag ? v.value == arr[key] : v.label == arr[key]) {
									dval[key] = j;
									checkArr.push(v.label);
									checkValue.push(v.value);
									resultStr += v.label;
									if (v.children) {
										getData(v.children, (key += 1));
									}
								}
							});
						}
						return {
							data,
							dval,
							checkArr,
							checkValue,
							resultStr
						};
					} else {
						return false;
					}
				};
				return getData(list, k);
			},
			getRegionVal(value, useCode) {
				let province = value[0];
				let city = value[1];
				let a = 0,
					b = 0,
					c = 0,
					dval = [];
				let _this = this;
				provinces.map((v, k) => {
					if (useCode ? v.value == province : v.label == province) {
						a = k;
					}
				});
				citys[a].map((v, k) => {
					if (useCode ? v.value == city : v.label == city) {
						b = k;
					}
				});
				if (!_this.hideArea) {
					let area = value[2];
					areas[a][b].map((v, k) => {
						if (useCode ? v.value == area : v.label == area) {
							c = k;
						}
					});
					dval = [a, b, c];
				} else {
					dval = [a, b];
				}
				return dval;
			},
			useCurrent() {
				let aToday = new Date();
				let tYear = aToday.getFullYear().toString();
				let tMonth = this.formatNum(aToday.getMonth() + 1).toString();
				let tDay = this.formatNum(aToday.getDate()).toString();
				let tHours = this.formatNum(aToday.getHours()).toString();
				let tMinutes = this.formatNum(aToday.getMinutes()).toString();
				let tSeconds = this.formatNum(aToday.getSeconds()).toString();
				if (this.current) {
					return [tYear, tMonth, tDay, tHours, (Math.floor(tMinutes / this.step) * this.step).toString(), tSeconds];
				} else {
					return this.defaultVal;
				}
			},
			formatNum(num) {
				return num < 10 ? '0' + num : num + '';
			},
			maskTap() {
				this.$emit('cancel', {
					checkArr: this.checkArr,
					defaultVal: this.pickVal
				});
				this.showPicker = false;
			},
			show() {
				this.showPicker = true;
			},
			hide() {
				this.showPicker = false;
			},
			pickerCancel() {
				this.$emit('cancel', {
					checkArr: this.checkArr,
					defaultVal: this.pickVal
				});
				this.showPicker = false;
			},
			pickerConfirm(e) {
				if (!this.confirmFlag) {
					return;
				}
				console.log(e)

				switch (this.mode) {
					case "range":
						let checkArr = this.checkArr;
						let fDateTime = new Date(checkArr[0], checkArr[1], checkArr[2]);
						let tDateTime = new Date(checkArr[3], checkArr[4], checkArr[5]);
						let dVal = this.pickVal;
						if (fDateTime > tDateTime) {
							this.checkArr = [checkArr[3], checkArr[4], checkArr[5], checkArr[0], checkArr[1], checkArr[2]];
							this.pickVal = [dVal[4], dVal[5], dVal[6], 0, dVal[0], dVal[1], dVal[2]];
							this.$emit("confirm", {
								checkArr: this.checkArr,
								from: checkArr[3] + "-" + checkArr[4] + "-" + checkArr[5],
								to: checkArr[0] + "-" + checkArr[1] + "-" + checkArr[2],
								defaultVal: this.pickVal,
								result: this.resultStr
							});
						} else {
							this.$emit("confirm", {
								checkArr: this.checkArr,
								from: checkArr[0] + "-" + checkArr[1] + "-" + checkArr[2],
								to: checkArr[3] + "-" + checkArr[4] + "-" + checkArr[5],
								defaultVal: this.pickVal,
								result: this.resultStr
							});
						}
						break;
					case "limit":
						let aTime = new Date().getTime();
						let bTime = new Date(this.resultStr.replace(/-/g, '/')).getTime();
						if (aTime > bTime) {
							uni.showModal({
								title: "提示",
								content: "选择时间必须大于当前时间",
								confirmColor: this.themeColor
							});
							return;
						}
						this.$emit("confirm", {
							checkArr: this.checkArr,
							defaultVal: this.pickVal,
							result: this.resultStr
						});
						break;
					case "region":
					case "linkage":
						this.$emit("confirm", {
							checkArr: this.checkArr,
							checkValue: this.checkValue,
							defaultVal: this.pickVal,
							result: this.resultStr
						});
						break;
					default:
						this.$emit("confirm", {
							checkArr: this.checkArr,
							defaultVal: this.pickVal,
							result: this.resultStr
						});
						break;
				}
				this.showPicker = false;
			},
			bindChange(val) {
				let _this = this;
				let arr = val.detail.value;
				let checkArr = _this.checkArr;
				let days = [];
				let months = [];
				let mode = _this.mode;
				let col1, col2, col3, d, a, h, m;
				let xDate = new Date().getTime();
				switch (mode) {
					case 'selector':
						_this.checkArr = _this.data[arr[0]] || _this.data[_this.data.length - 1];
						_this.resultStr = _this.data[arr[0]] ? _this.data[arr[0]].label : _this.data[_this.data.length - 1].label;
						break;
					case "dateTime":
						year = _this.data.years[arr[0]] || _this.data.years[_this.data.years.length - 1];
						console.log(year)
						month = _this.data.months[arr[1]] || _this.data.months[_this.data.months.length - 1];
						day = _this.data.days[arr[2]] || _this.data.days[_this.data.days.length - 1];
						hour = _this.data.hours[arr[3]] || _this.data.hours[_this.data.hours.length - 1];
						minute = _this.data.minutes[arr[4]] || _this.data.minutes[_this.data.minutes.length - 1];
						second = _this.data.seconds[arr[5]] || _this.data.seconds[_this.data.seconds.length - 1];
						if (year != checkArr[0]) {
							arr[2] = 0;
							days = initPicker.date.initDays(year, month);
							day = _this.data.days[arr[2]] || _this.data.days[_this.data.days.length - 1];
							_this.data.days = days;
						};
						if (month != checkArr[1]) {
							arr[2] = 0;
							days = initPicker.date.initDays(year, month);
							day = _this.data.days[arr[2]] || _this.data.days[_this.data.days.length - 1];
							_this.data.days = days;
						};
						_this.checkArr = [year, month, day, hour, minute, second];
						_this.resultStr = `${year+'-'+month+'-'+day+' '+hour+':'+minute+':'+second}`;
						break;
				}
				_this.$nextTick(() => {
					_this.pickVal = arr;
				});
			},
			initData() {
				let _this = this;
				let data = {};
				let mode = _this.mode;
				let dVal = [];
				switch (mode) {
					case 'selector':
						let idx = 0;
						data = _this.selectList;
						_this.selectList.map((v, k) => {
							if (v.label == this.defaultVal[0]) {
								idx = k;
							}
						});
						dVal = [idx];
						break;

					default:
						data = initPicker.date.init(_this.startYear, _this.endYear, _this.mode, _this.step, _this.useCurrent(), _this.current,
							_this.disabledAfter);
						dVal = data.defaultVal || _this.defaultVal;
						break;
				}
				_this.data = data;
				switch (mode) {
					case 'selector':
						_this.checkArr = data[dVal[0]] || data[data.length - 1];
						_this.resultStr = data[dVal[0]].label || data[data.length - 1].label;
						break;
					case "dateTime":
						year = data.years[dVal[0]] || data.years[data.years.length - 1];
						month = data.months[dVal[1]] || data.months[data.months.length - 1];
						day = data.days[dVal[2]] || data.days[data.days.length - 1];
						hour = data.hours[dVal[3]] || data.hours[data.hours.length - 1];
						minute = data.minutes[dVal[4]] || data.minutes[data.minutes.length - 1];
						second = data.seconds[dVal[5]] || data.seconds[data.seconds.length - 1];
						_this.resultStr = `${year+'-'+month+'-'+day+' '+hour+':'+minute+':'+second}`;
						_this.checkArr = [year, month, day, hour, minute];
						break;
				}
				_this.$nextTick(() => {
					_this.pickVal = dVal;
				});
			}
		},
		mounted() {
			this.initData();
		}
	};
</script>

<style lang="scss">
	.w-picker {
		position: relative;
		z-index: 888;

		.mask {
			position: fixed;
			z-index: 1000;
			top: 0;
			right: 0;
			left: 0;
			bottom: 0;
			background: rgba(0, 0, 0, 0.6);
			visibility: hidden;
			opacity: 0;
			transition: all 0.3s ease;
		}

		.mask.show {
			visibility: visible;
			opacity: 1;
		}

		.w-picker-cnt {
			position: fixed;
			bottom: 0;
			left: 0;
			width: 100%;
			transition: all 0.3s ease;
			transform: translateY(100%);
			z-index: 3000;
		}

		.w-picker-cnt.show {
			transform: translateY(0);
		}

		.w-picker-hd {
			display: flex;
			align-items: center;
			padding: 0 30upx;
			height: 88upx;
			background-color: #fff;
			position: relative;
			text-align: center;
			font-size: 32upx;
			justify-content: space-between;

			.w-picker-btn {
				font-size: 30upx;
			}
		}

		.w-picker-hd:after {
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

		.w-picker-item {
			text-align: center;
			width: 100%;
			height: 88upx;
			line-height: 88upx;
			text-overflow: ellipsis;
			white-space: nowrap;
			font-size: 30upx;
		}

		.w-picker-view {
			width: 100%;
			height: 476upx;
			overflow: hidden;
			background-color: rgba(255, 255, 255, 1);
			z-index: 666;
		}

		picker-view {
			height: 100%;
		}
	}
</style>
