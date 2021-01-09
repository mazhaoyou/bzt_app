<!-- 新增展位 -->
<template>
	<view class="append-contact">
		<view class="tip">展位基本信息</view>
		<view class="single-input">
			<view class="form-item">
				<view class="item-title">
					<text class="sign">*</text>
					<text class="item-title">展位号</text>
				</view>
				<view class="item-input-column">
					<input class="item-input" type="text" placeholder="" v-model="bthCode" />
				</view>
			</view>
			<view class="form-item">
				<view class="item-title">
					<text class="sign">*</text>
					<text class="item-title">展位类型</text>
				</view>
				<view class="item-title">
					<text class="item-title item-select">{{boothType}}</text>
					<!-- <text class="iconfont icon-youjiantou" style="visibility: hidden;">&#xe636;</text> -->
				</view>
			</view>
			<view class="form-item" @tap="toggleTab(2)">
				<view class="item-title">
					<text class="sign">*</text>
					<text class="item-title">价格类别</text>
				</view>
				<view class="item-title">
					<text class="item-title item-select">{{priceTypes}}</text>
					<text class="iconfont icon-youjiantou">&#xe636;</text>
				</view>
			</view>
			<view class="form-item" @tap="toggleTab(3)">
				<view class="item-title">
					<text class="sign">*</text>
					<text class="item-title">所属展厅</text>
				</view>
				<view class="item-title">
					<text class="item-title item-select">{{exhibitionHall}}</text>
					<text class="iconfont icon-youjiantou" >&#xe636;</text>
				</view>
			</view>
			<view class="form-item">
				<view class="item-title">
					<text class="sign" style="margin-left: 16rpx;"></text>
					<text class="item-title">所属展商</text>
				</view>
				<view class="item-title">
					<text class="item-title item-select">{{exhibition}}</text>
					<!-- <text class="iconfont icon-youjiantou">&#xe636;</text> -->
				</view>
			</view>
			<view class="form-item" @tap="toggleTab(5)">
				<view class="item-title">
					<text class="sign">*</text>
					<text class="item-title">场所</text>
				</view>
				<view class="item-title">
					<text class="item-title item-select">{{bthPlace}}</text>
					<text class="iconfont icon-youjiantou">&#xe636;</text>
				</view>
			</view>
		</view>
		<view class="tip tip2">展位价格信息</view>
		<view class="single-input">
			<view class="form-item">
				<view class="item-title">
					<text class="sign">*</text>
					<text class="item-title">长(m)</text>
				</view>
				<view class="item-input-column">
					<input class="item-input" type="number" placeholder="输入高" v-model="boothHeight" />

				</view>
			</view>

			<view class="form-item">
				<view class="item-title">
					<text class="sign">*</text>
					<text class="item-title">宽(m)</text>
				</view>
				<view class="item-input-column">
					<input class="item-input" type="number" placeholder="输入宽" v-model="boothWeight" />
				</view>
			</view>

			<view class="form-item">
				<view class="item-title">
					<text class="sign">*</text>
					<text class="item-title">面积(㎡)</text>
				</view>
				<view class="item-input-column">
					<input class="item-input" type="number" placeholder=""  v-model="totalArea" />
				</view>
			</view>

			<view class="form-item">
				<view class="item-title">
					<text class="sign">*</text>
					<text class="item-title">人民币价格(元)</text>
				</view>
				<view class="item-input-column">
					<input class="item-input" type="number" placeholder="" v-model="totalPrice" />
				</view>
			</view>
		</view>
		<w-picker v-if="selectList.length != 0" :mode="mode" :defaultVal="['请选择']" @confirm="onConfirm" ref="selector"
		 themeColor="#4C83D6" :selectList="selectList" :opt="opt"></w-picker>
	</view>
</template>

<script>
	import wPicker from '@/components/w-picker/w-picker.vue';
	import {
		mapState,
		mapGetters,
		mapMutations
	} from 'vuex'
	export default {
		components: {
			wPicker
		},
		data() {
			return {
				timeout: null,
				boothHeight:"" ,
				boothWeight: "",
				area: 0,
				price: " ",
				bthCode: " ",
				boothType: "",
				priceTypes: "",
				exhibitionHall: " ",
				exhibition: "",
				defaultVal: [0, 0, 0, 0, 0, 0, 0],
				tabIndex: 0,
				opt: 'opt',
				mode: 'selector',
				selectList: [],
				unitPrice: 0,
				unitArea: 0,
				atrId: "",
				srmId: "",
				bthPriceTypeId: "",
				bthPlace:""

			};
		},
		onLoad(option) {
			this.exhibition = option.atrName;
			this.atrId = option.atrId;
			this.$store.dispatch("getExhBasicList");
		},
		computed: {
			...mapGetters(['getPriceList', 'getRoomsList']),
			totalArea() {
				let area = Number(this.boothHeight)  *  Number(this.boothWeight);
				if (area >0 ) {
					return area;
				} else{
				 return this.unitArea;
				}
				
			},
			totalPrice() {
				let price = Number(this.totalArea) / Number(this.unitArea) * Number(this.unitPrice)
				if (price>0){
					return Number(price).toFixed(2);
				}
				return Number(this.unitPrice).toFixed(2);
			}
		},

		methods: {

			toggleTab(index) {
				this.tabIndex = index;
				this.mode = "selector";
				/* this.defaultVal = item.value; */
				if (index == 2) {

					this.opt = "name"
					this.selectList = this.getPriceList;
				} else if (index == 3) {
					this.opt = "srmName"
					this.selectList = this.getRoomsList;
				} else if (index == 5) {
					this.opt = "opt"
					this.selectList = this.$json.bthPlaceList;
				}
				this.$refs[this.mode].show();
			},
			onConfirm(val) {
				console.log(val)
				if (this.tabIndex == 2) {
					this.boothType = val.checkArr.bthType;
					this.unitArea = val.checkArr.unitArea;
					this.unitPrice = val.checkArr.unitPrice;
					this.priceTypes = val.checkArr.name;
					this.bthPriceTypeId = val.checkArr.id;
				} else if (this.tabIndex == 3) {
					this.exhibitionHall = val.checkArr.srmName;
					this.srmId = val.checkArr.srmId;
				}else if (this.tabIndex == 5) {
					this.bthPlace = val.checkArr.opt;
				}

			},

			saveData() {
				if (!this.checkoutData()) {
					return;
				} 
				
				let data = {
					atrid: this.atrId,
					bthCode: this.bthCode,
					bthType: this.boothType,
					bthPriceTypeId: this.bthPriceTypeId,
					bthSrmId: this.srmId,
					bthLength: this.boothHeight,
					bthWidth: this.boothWeight,
					bthArea: this.totalArea,
					bthTotal: this.totalPrice,
					bthRemark: "",
					bthPlace: this.bthPlace
				}

				this.$http.createBooth(data).then(res => {
					let data = res.data;
					if (data.code == "1000") {
						this.$util.toast('保存成功');
						uni.navigateBack();
					} else {
						this.$util.toast(data.msg);
					}
				})
			},
			checkoutData(){
				if (!this.bthCode) {
					this.$util.toast("展位号不能为空");
					return;
				} 
			
				if (!this.bthPriceTypeId) {
					this.$util.toast("价格类型不能为空");
					return;
				}
				if (!this.boothType) {
					this.$util.toast("展位类型不能为空");
					return;
				}
				// if (!this.srmId) {
				// 	this.$util.toast("所属展厅不能为空");
				// 	return;
				// }
				if (!this.bthPlace) {
					this.$util.toast("场所不能为空");
					return;
				}
				if (!this.boothHeight) {
					this.$util.toast("展位高不能为空");
					return;
				}
				if (!this.boothWeight) {
					this.$util.toast("展位宽不能为空");
					return;
				}
				if (!this.totalArea) {
					this.$util.toast("展位面积不能为空");
					return;
				}
				if (!this.totalPrice) {
					this.$util.toast("展位价格不能为空");
					return;
				}
				
			 return true;
			}
		},
		onNavigationBarButtonTap(e) {
			// 判断是否是登录状态
			if (e.index == 0) {
				var _this = this;
				clearTimeout(this.timeout);
				this.timeout = setTimeout(function() {
					_this.saveData();
					clearTimeout(_this.timeout);
				}, 1000);
			}
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
		font-size: 28rpx;
		font-family: PingFangSC-Medium, PingFang SC;
		font-weight: 500;
		color: rgba(0, 0, 0, 0.65);
		padding-left: 24rpx;
		padding-top: 24rpx;
	}

	.tip2 {
		padding-top: 48rpx;
	}

	.form-item {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-between;
		border-bottom-style: solid;
		border-bottom-width: 4rpx;
		border-bottom-color: #f6f6f6;
		padding-left: 24rpx;
		padding-right: 24rpx;
		height: 88rpx;
	}

	.item-title {
		display: flex;
		flex-direction: row;
		align-items: center;
		font-size: 30rpx;
		font-family: PingFangSC-Regular, PingFang SC;
		font-weight: 400;
		color: rgba(0, 0, 0, 0.4);
	}

	.item-input-column {
		display: flex;
		flex: 1;
		flex-direction: row;
	}

	.item-input {
		width: 100%;
		margin-left: 30rpx;
		text-align: right;
		margin-right: 30rpx;
		/* color: rgba(0, 0, 0, 0.4); */
		;
		border: none;
		font-size: 30rpx;
		font-family: PingFangSC-Regular, PingFang SC;
		font-weight: 400;
		color: rgba(0, 0, 0, 0.65);
	}

	.item-select {
		color: rgba(0, 0, 0, 0.65);
	}

	.icon-youjiantou {
		margin-left: 24rpx;
		font-size: 24rpx;
		margin-top: 6rpx;
	}

	.sign {
		color: #d0021b;
	}
</style>
