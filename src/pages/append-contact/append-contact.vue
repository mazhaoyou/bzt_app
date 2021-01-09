<!-- 新增联络 -->
<template>
	<view class="append-contact">
		<view class="single-input" v-for="(item,index) of itemList" :key="item.id">
			<view class="single-input">
				<single-input :title="item.title" :selectText="item.selectText" :isSign="item.isSign" :isDisabled="item.isDisabled"
				 :isSelect="item.isSelect" :ref="'singleInput'+item.id" @tap="toggleTab(item, index)" :placeholder="item.placeholder"></single-input>
			</view>
		</view>

		<view class="multiline-input">
			<text>联络记录</text>
			<textarea placeholder="请输入联络记录" class="textarea-input" v-model="remark"></textarea>
		</view>
		<w-picker v-if="selectList.length != 0" :mode="mode" :defaultVal="['请选择']" @confirm="onConfirm" ref="selector"
		 themeColor="#4C83D6" :selectList="selectList" :opt="opt"></w-picker>
		<w-pickers mode="dateTime" startYear="1988" endYear="2100" step="1" :defaultVal="defaulTime" :current="false"
		 @confirm="onConfirm" ref="dateTime" themeColor="#4C83D6"></w-pickers>
	</view>
</template>

<script>
	import singleInput from '@/components/single-input/single-input.vue';
	import wPicker from '@/components/w-picker/w-picker.vue';
	import wPickers from '@/components/w-picker/w-pickers.vue';
	import {mapMutations} from 'vuex';
	export default {
		components: {
			singleInput,
			wPicker,
			wPickers
		},
		data() {
			return {
				timeout: null,
				defaultVal: [0, 0, 0, 0, 0, 0, 0],
				tabIndex: 0,
				opt: 'opt',
				mode: 'selector',
				selectList: [],
				itemList: [],
				contactList: [],
				contactPre: [],
				rateProgress: [],
				linDateTimeList: [],
				atrId: '00',
				linkType: "",
				atrSaleIndex: 0,
				expectedArea: 0,
				expectedMoney: 0,
				linkNextDateTime: "",
				toLinkName: "string",
				remark: "",
				toLinkId: "",
				defaulTime: ['2018', '09', '10', '12', '48', '45']
			};
		},
		onLoad(option) {
			this.itemList = JSON.parse(JSON.stringify(this.$json.contactList));
			this.contactList = this.$json.contactWay;
			this.rateProgress = this.$json.rateProgres;
			this.atrId = option.atrId;
			let dateTime = this.$util.timestampToArr(new Date().getTime());
			this.defaulTime = dateTime.map(String);
		},
		onShow() {
			this.getContactList();
		},
		methods: {
			...mapMutations(['loadHome']),
			toggleTab(item, index) {
				this.tabIndex = index;
				this.mode = item.mode;
				this.defaultVal = item[this.opt];
				this.opt = "opt"
				if (index == 0) {
					this.opt = "userName"
					this.selectList = this.contactPre;
					if (this.contactPre.length == 0) {
						uni.showModal({
							title: "提示",
							content: "没有联络人，请先添加联络人",
							showCancel: true,
							success: (res) => {
							    if (res.confirm) {
							        this.toAddLiaisons()
							    }
							}
						})
					}
				} else if (index == 1) {
					this.selectList = this.contactList;
				} else if (index == 2) {
					this.selectList = this.rateProgress;
				} else if (index == 5) {
					this.selectList = this.linDateTimeList;
				}
				console.log(item.mode)
				if (item.mode) {
					this.$refs[item.mode].show();
				}

			},
			onConfirm(val) {
				if (this.tabIndex == 0) {
					this.toLinkId = val.checkArr.userId;
				} else if (this.tabIndex == 1) {
					this.linkType = val.checkArr[this.opt];
				} else if (this.tabIndex == 2) {
					this.atrSaleIndex = val.checkArr[this.opt];
				} else if (this.tabIndex == 5) {
					this.linkNextDateTime = val.result;
				}
				if (this.tabIndex == 5) {
					this.$set(this.itemList[this.tabIndex], 'selectText', this.linkNextDateTime);
				} else {
					this.$set(this.itemList[this.tabIndex], 'selectText', val.checkArr[this.opt]);

				}
			},
			/* 获取联络人 */
			getContactList() {
				let arg = {
					atrId: this.atrId
				}
				this.$http.getContacts(arg).then(res => {
					let data = res.data;
					if (data.code == '1000') {
						this.contactPre = data.data;
					} else {
						this.$util.toast(data.msg)
					}
				})
			},
			saveData(data) {
				this.expectedMoney = this.$refs[`singleInput${4}`][0].inputValue;
				this.expectedArea = this.$refs[`singleInput${3}`][0].inputValue;
				if (!this.toLinkId) {
					this.$util.toast("联络人不能为空");
					return;
				}
				if (!this.linkType) {
					this.$util.toast("联络方式不能为空");
					return;
				}
				if (!this.linkNextDateTime) {
					this.$util.toast("联络时间不能为空");
					return;
				}
				if (!this.remark) {
					this.$util.toast("联络记录不能为空");
					return;
				}
				if (!this.atrSaleIndex || this.atrSaleIndex == 0) {
					this.$util.toast("销售进度不能为空");
					return;
				}
				let arg = {
					atrId: this.atrId,
					linkType: this.linkType,
					atrSaleIndex: this.atrSaleIndex,
					expectedArea: Number(this.expectedArea),
					expectedMoney: Number(this.expectedMoney),
					linkNextDateTime: this.linkNextDateTime,
					toLinkId: this.toLinkId,
					remark: this.remark
				}
				this.newAddLink(arg);

			},
			newAddLink(arg) {

				this.$http.addLink(arg).then(res => {
					let data = res.data;
					if (data.code == '1000') {					
						this.$util.showModal("", "新增联络记录成功",function(){
							uni.navigateBack();
						});
						// this.$util.toast("新增联络人成功");
						this.loadHome(true);									// 记录状态 刷新首页
						uni.navigateBack();
					} else {
						this.$util.toast(data.msg);
					}
				})
			},
			toAddLiaisons() {
				uni.navigateTo({
					url: `/pages/append-liaisons/append-liaisons?atrId=${this.atrId}&type=0`
				});
			}
		},
		onNavigationBarButtonTap(e) {
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
	}

	.textarea-input {
		margin-top: 24rpx;
	}
</style>
