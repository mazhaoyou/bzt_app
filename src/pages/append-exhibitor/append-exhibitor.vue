<!-- 新增联络 -->
<template>
	<view class="append-contact">
		<view class="tip">维护更多信息请到电脑端展立方</view>
		<view class="single-input" v-for="(item, index) of itemList" :key="index">
			<view class="single-input">
				<single-input :title="item.title" :selectText="item.selectText" :inValue="item.inValue" :isSign="item.isSign"
				 :isDisabled="item.isDisabled" :isSelect="item.isSelect" :ref="'singleInput' + item.id" @tap="toggleTab(item, index)"></single-input>
			</view>
		</view>
		<view class="bottom-menu" v-if="editEx">
			<text class="menu-item" @tap="debounceSaveData">保存</text>
			<text class="menu-line"></text>
			<text class="menu-item" @tap="debounceSaveData(1)">保存并新增联络人</text>
		</view>
		<w-picker v-if="selectList.length != 0" :mode="mode" :defaultVal="['请选择']" @confirm="onConfirm" ref="selector"
		 themeColor="#4C83D6" :selectList="selectList" :opt="opt"></w-picker>
	</view>
</template>

<script>
	import singleInput from '@/components/single-input/single-input.vue';
	import wPicker from '@/components/w-picker/w-picker.vue';

	export default {
		components: {
			singleInput,
			wPicker
		},
		data() {
			return {
				timeout: null,
				itemList: [],
				editEx: '', //编辑资料标识
				countryList: [{
					"opt": "中国",
					"eopt": "China",
					"code": "86"
				}],
				provinceList: [{
					"opt": "北京",
					"eopt": "",
					"code": "华北"
				}],
				cityList: [],
				opt: '',
				optkey: '',
				selectList: [] /* 选择列表 */ ,
				mode: 'selector',
				defaultVal: [0, 0, 0, 0, 0, 0, 0],
				tabIndex: 0,
				mailbox: '',
				country: '',
				province: '',
				city: '',
				productClass: '',
				trade: '', //行业
				atrName: '', //展商名称
				atrSName: '',
				atrTel: '',
				atrEmail: '',
				productTypeList: [],
				tradeList: [],
				exhibitorInfo: ""


			};
		},
		onLoad(options) {
			if (!this.$util.getPrivilegeById("p200000101")) {
				this.$util.showModal("您目前没有新增展商权限", () => {
					uni.navigateBack();
				});
			}
			this.itemList = JSON.parse(JSON.stringify(this.$json.exhibitorList));;
			this.editEx = options.editEx;
			// #ifdef APP-PLUS
			/* 编辑展商特殊处理 */
			if (this.editEx) {
				uni.setNavigationBarTitle({
					title: this.editEx ? '编辑展商' : '新增展商'
				});
				let info = JSON.parse(options.info);
				this.exhibitorInfo = info[0];
				let webView = this.$mp.page.$getAppWebview();
				webView.setTitleNViewButtonStyle(0, {
					text: ' '
				});

			}
			// #endif
			this.getActorLists("产品");
			this.getActorLists("行业");

		},
		onReady() {

			this.$store.dispatch("getCountry");
			this.countryList = this.$store.state.common.countryList;
			if (this.exhibitorInfo) {
				this.atrId = this.exhibitorInfo.atrId;
				this.updataExhibitor();
			}

		},
		methods: {
			toggleTab(item, index) {
				this.opt = 'opt';
				this.tabIndex = index;
				this.mode = item.mode;
				this.defaultVal = item.value;
				if (index == 4) {
					this.selectList = this.$store.state.common.countryList;
				} else if (index == 5) {
					if (!this.country) {
						this.$util.toast("请先选择国家");
						return;
					}
					this.provinceList = this.$store.state.common.provinceList;
					this.selectList = this.provinceList;

				} else if (index == 6) {
					if (!this.province) {
						this.$util.toast("请先选择省份");
						return;
					}
					this.cityList = this.$store.state.common.cityList
					this.selectList = this.cityList;
				} else if (index == 7) {
					this.selectList = this.productTypeList;
				} else if (index == 8) {
					this.selectList = this.tradeList;
				}
				if (item.mode) {
					this.$refs[item.mode].show();
				}
			},
			onConfirm(val) {
				console.log(val);
				if (this.tabIndex == 4) {
					this.country = val.checkArr[this.opt];
					this.$store.dispatch("getProvince", {
						country: this.country
					});
				} else if (this.tabIndex == 5) {
					this.province = val.checkArr[this.opt];
					this.$store.dispatch("getCity", {
						province: this.province
					});
				} else if (this.tabIndex == 6) {
					this.city = val.checkArr[this.opt];
				} else if (this.tabIndex == 7) {
					console.log(val.checkArr)
					this.productClass = val.checkArr.id;
				} else if (this.tabIndex == 8) {
					this.trade = val.checkArr.id;
				}
				this.$set(this.itemList[this.tabIndex], 'selectText', val.checkArr[this.opt]);
			},
			/* 新增 */
			addActorData(data) {
				this.$http.addActorData(data).then(res => {
					let data = res.data;
					if (data.code == '1000') {
						this.$util.toast('新增展商成功');
						uni.navigateBack();
					} else {
						this.$util.toast(data.msg)
					}
				});
			},
			/* 修改 */
			modifyActorData(data,type) {
				this.$http.modifyActorData(data).then(res => {
					let data = res.data;
					if (data.code == '1000') {
						this.$util.toast('修改展商成功');
						if (type == 1) {
							uni.navigateTo({
								url: `/pages/append-liaisons/append-liaisons?atrId=${this.atrId}&type=1`
							});
						} else {
							uni.navigateBack();
						}
					} else {
						this.$util.toast(data.msg)
					}
				});
			},
			/* 保存数据 */
			debounceSaveData(type = 0) {
				var _this = this;
				clearTimeout(this.timeout);
				this.timeout = setTimeout(function() {
					_this.saveData(type);
					clearTimeout(_this.timeout);
				}, 1000);
			},
			saveData(type = 0) {
				this.atrName = this.$refs[`singleInput${0}`][0].inputValue;
				this.atrSName = this.$refs[`singleInput${1}`][0].inputValue;
				this.atrTel = this.$refs[`singleInput${2}`][0].inputValue;
				this.atrEmail = this.$refs[`singleInput${3}`][0].inputValue;
				if (!this.checkoutData()) {
					return;
				}
				let parameter = {
					atrId: this.atrId,
					atrName: this.atrName,
					atrSName: this.atrSName,
					atrTel: this.atrTel,
					atrEmail: this.atrEmail,
					comCountry: this.country,
					comProvince: this.province,
					comCity: this.city,
					productTypeID: this.productClass,
					tradeID: this.trade
				};

				if (this.editEx) {
					this.modifyActorData(parameter,type)
				} else {
					this.addActorData(parameter)
				}
			},
			/* 校验请求参数 */
			checkoutData() {
				if (!this.atrName) {
					this.$util.toast('展商名称不能为空');
					return;
				}
				/* 	if (!this.atrSName) {
						this.$util.toast('展商简称不能为空');
						return;
					} */
				if (this.atrTel != '' && this.atrTel != "无") {
					if (!this.$util.checkoutPhone(this.atrTel)) {
						return;
					}
				}
				/* 	if (!this.$util.checkoutEmail(this.atrEmail)) {
					 this.$util.toast('展商邮箱不能为空'); 
						return;
					} */
				/* if (!this.country) {
					this.$util.toast('国家不能为空');
					return;
				}
				if (!this.province) {
					this.$util.toast('省份不能为空');
					return;
				}
				if (!this.city) {
					this.$util.toast('城市不能为空');
					return;
				}
				if (!this.productClass) {
					console.log(this.productClass)
					this.$util.toast('产品类别不能为空');
					return;
				}
				if (!this.trade) {
					this.$util.toast('行业不能为空');
					return;
				} */
				return true;
			},
			/* 好的行业或者行业 */
			getActorLists(type) {
				let arg = {
					strType: type
				}
				this.$http.getActorList(arg).then(res => {
					let data = res.data;
					if (data.code == '1000') {
						if (type == "产品") {
							this.productTypeList = data.data;
						} else {
							this.tradeList = data.data;
						}
					} else {
						this.$util.toast(data.msg)
					}
				})
			},
			/* 修改展商时复现 */
			updataExhibitor() {
				console.log(this.exhibitorInfo.atrName)
				this.$set(this.itemList[0], 'inValue', this.exhibitorInfo.atrName);
				this.$set(this.itemList[1], 'inValue', this.exhibitorInfo.atrSName);
				this.$set(this.itemList[2], 'inValue', this.exhibitorInfo.atrTel);
				this.$set(this.itemList[3], 'inValue', this.exhibitorInfo.atrEmail);
				this.$set(this.itemList[4], 'selectText', this.exhibitorInfo.atrCountry);
				this.$set(this.itemList[5], 'selectText', this.exhibitorInfo.atrProvince);
				this.$set(this.itemList[6], 'selectText', this.exhibitorInfo.atrCity);
				this.$set(this.itemList[7], 'selectText', this.exhibitorInfo.sortName);
				this.$set(this.itemList[8], 'selectText', this.exhibitorInfo.tradeName);
				this.country = this.exhibitorInfo.atrCountry;
				this.province = this.exhibitorInfo.atrProvince;
				this.city = this.exhibitorInfo.atrCity;
				this.productClass = this.exhibitorInfo.sortID;
				this.trade = this.exhibitorInfo.tradeID;
			}
		},
		onNavigationBarButtonTap(e) {
			// 判断是否是登录状态
			var _this = this;
			clearTimeout(this.timeout);
			this.timeout = setTimeout(function() {
				_this.saveData();
				clearTimeout(_this.timeout);
			}, 1000);
		}
	};
</script>

<style scoped>
	.append-contact {
		background-color: #ffffff;
		display: flex;
		flex: 1;
		flex-direction: column;
	}

	.tip {
		padding-left: 24rpx;
		padding-top: 24rpx;
		padding-right: 24rpx;
		font-size: 30rpx;
		font-family: PingFangSC-Regular, PingFang SC;
		font-weight: 400;
		color: rgba(0, 0, 0, 0.4);
	}

	.bottom-menu {
		position: fixed;
		bottom: 0;
		left: 0;
		display: flex;
		flex-direction: row;
		height: 82rpx;
		background-color: rgba(255, 255, 255, 1);
		justify-content: space-around;
		align-items: center;
		flex: 1;
		width: 100%;
		border-top: #f6f6f6 2rpx solid;
	}

	.menu-item {
		display: flex;
		font-size: 30rpx;
		font-weight: 400;
		color: rgba(75, 78, 250, 1);
		flex: 1;
		text-align: center;
		justify-content: center;
		align-items: center;
		height: 80rpx;
	}

	.menu-line {
		width: 1px;
		height: 30rpx;
		background-color: #4b4efa;
	}
</style>
