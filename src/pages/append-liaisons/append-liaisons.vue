<!-- 新增联系人 -->
<template>
	<view class="append-contact">
		<view class="single-input" v-for="(item,index) of itemList" :key="item.id">
			<view class="single-input">
				<single-input :title="item.title" :selectText="item.selectText" :isSign="item.isSign" :isDisabled="item.isDisabled"
				 :isSelect="item.isSelect" @tap="toggleTab(item, index)" :ref="'singleInput' + item.id"></single-input>
			</view>
		</view>
		<view class="select-radio">
			<view>主联系人</view>
			<view>
				<label class="radio" style="margin-right: 30upx;" @tap="checkedEvent">
					<radio value="r1" :checked="isChecked" color="#4B4EFA" style="transform:scale(0.7)" />
					是
				</label>
				<label class="radio" @tap="checkedEvent">
					<radio value="r2" :checked="!isChecked" color="#4B4EFA" style="transform:scale(0.7)" />
					否
				</label>
			</view>
		</view>
		<view class="multiline-input">
			<text>备注</text>
			<textarea placeholder="请输入备注" class="textarea-input" v-model="remark"></textarea>
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
				isChecked: false,
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
				cityList: [{
					"opt": "无对应的县城",
				}],
				genderList: [{
						"opt": "先生",
						"id": "1"

					},
					{
						"opt": "女士",
						"id": "0"
					}
				],
				selectList: [],
				defaultVal: [0, 0, 0, 0, 0, 0, 0],
				tabIndex: 0,
				country: '',
				province: '',
				city: '',
				county: '',
				opt: 'opt',
				mode: 'selector',
				liaName: "",
				liaGender: "",
				position: "",
				address: "",
				post: "",
				mobile: "",
				tele: "",
				psnType: "",
				remark: "",
				psnCountry: "",
				psnProvince: "",
				psnCity: "",
				psnArea: "",
				atrId: "",
				type: ''


			};
		},
		onLoad(options) {
			this.itemList = JSON.parse(JSON.stringify(this.$json.liaisonsList));
			this.atrId = options.atrId;
			this.type = options.type;
		},
		onReady() {
			this.$store.dispatch("getCountry");
			this.countryList = this.$store.state.common.countryList;
		},
		methods: {
			/* 选择类别 */
			toggleTab(item, index) {
				this.tabIndex = index;
				this.mode = item.mode;
				this.defaultVal = item.value;
				if (index == 1) {
					this.selectList = this.genderList;
				} else if (index == 7) {
					console.log(JSON.stringify(this.countryList))
					this.selectList = this.countryList;
				} else if (index == 8) {
					this.provinceList = this.$store.state.common.provinceList;
					this.selectList = this.provinceList;
				} else if (index == 9) {
					this.cityList = this.$store.state.common.cityList;
					this.selectList = this.cityList;
				} else if (index == 10) {
					this.countyList = this.$store.state.common.countyList;
					if (this.countyList.length > 0) {
						this.selectList = this.countyList;
					}

				}
				if (item.mode) {
					this.$refs[item.mode].show();
				}
			},
			checkedEvent() {
				this.isChecked = !this.isChecked;
			},
			onConfirm(val) {

				if (this.tabIndex == 7) {
					this.country = val.checkArr[this.opt];
					this.$store.dispatch("getProvince", {
						country: this.country
					});
				} else if (this.tabIndex == 8) {
					this.province = val.checkArr[this.opt];
					this.$store.dispatch("getCity", {
						province: this.province
					});
				} else if (this.tabIndex == 9) {
					this.city = val.checkArr[this.opt];
					this.$store.dispatch("getCounty", {
						city: this.city
					});
				} else if (this.tabIndex == 10) {
					console.log(val.checkArr)
					this.county = val.checkArr[this.opt];
				} else if (this.tabIndex == 1) {
					console.log(val.checkArr)
					this.liaGender = val.checkArr[this.opt];
				}
				this.$set(this.itemList[this.tabIndex], 'selectText', val.checkArr[this.opt]);
			},
			saveData() {
				this.liaName = this.$refs[`singleInput${0}`][0].inputValue;
				this.position = this.$refs[`singleInput${2}`][0].inputValue;
				this.address = this.$refs[`singleInput${3}`][0].inputValue;
				this.post = this.$refs[`singleInput${4}`][0].inputValue;
				this.mobile = this.$refs[`singleInput${6}`][0].inputValue;
				this.tele = this.$refs[`singleInput${5}`][0].inputValue;
				if (!this.checkoutData()) {
					return;
				}
				let arg = {
					atrId: this.atrId,
					contactName: this.liaName,
					gender: this.liaGender,
					position: this.position,
					address: this.address,
					post: this.post,
					mobile: this.mobile,
					tele: this.tele,
					psnType: this.isChecked,
					remark: this.remark,
					psnCountry: this.country,
					psnProvince: this.province,
					psnCity: this.city,
					psnArea: this.county
				}
				this.addContactaLiaisons(arg)
			},
			/* 新增联络人 */
			addContactaLiaisons(data) {
				this.$http.addContact(data).then(res => {
					let data = res.data;
					if (data.code == '1000') {
						this.$util.toast('联络人成功');
						if (this.type == 1) {
							uni.navigateBack({
								delta: 2
							})
						} else {

							uni.navigateBack();
						}

					} else {
						this.$util.toast(data.msg)
					}
				})
			},
			/* 检验数据 */
			checkoutData() {
				if (!this.liaName) {
					this.$util.toast("联络人姓名不能为空");
					return;
				} else if (!this.mobile && !this.tele) {
					this.$util.toast("联系方式")
					return;
				}
				return true;
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

	.multiline-input {
		padding: 24rpx;
		font-size: 30rpx;
		font-family: PingFangSC-Regular, PingFang SC;
		font-weight: 400;
		color: rgba(0, 0, 0, 0.4);
		margin-top: 28rpx;
		border-bottom-style: solid;
		border-bottom-width: 4rpx;
		border-bottom-color: #f6f6f6;
		margin-bottom: 28rpx;
	}

	.textarea-input {
		margin-top: 24rpx;
		height: 200rpx;
	}

	.select-radio {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-between;
		padding: 24rpx;
		padding-right: 42rpx;
		font-size: 30rpx;
		font-weight: 400;
		color: rgba(0, 0, 0, 0.4);
		border-bottom-style: solid;
		border-bottom-width: 4rpx;
		border-bottom-color: #f6f6f6;
	}

	.radio {
		font-size: 30rpx;
		font-weight: 400;
		color: rgba(0, 0, 0, 0.65);
	}
</style>
