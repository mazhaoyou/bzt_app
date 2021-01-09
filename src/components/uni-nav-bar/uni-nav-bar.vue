<!-- 自定义导航栏-tabs -->
<template>
	<view class="uni-navbar">
		<view :class="{'uni-navbar--fixed': fixed,'uni-navbar--shadow':border,'uni-navbar--border':border}" :style="{'background-color':backgroundColor}" class="uni-navbar__content">
			<uni-status-bar v-if="statusBar && !hideNavi"></uni-status-bar>
			<!-- <view class="status-bar"></view> -->
			<view :style="{color:color}" v-if="!hideNavi" class="uni-navbar__header uni-navbar__content_view">
				<view class="uni-navbar__header-btns uni-navbar__content_view" @tap="onClickLeft">
					<view v-if="back" class="uni-navbar__content_view">
						<!-- <uni-icons :type="leftIcon" :color="color" size="24" /> -->
						<i class="iconfont">&#xe633;</i>
					</view>
					<view v-if="leftText.length" :class="{'uni-navbar-btn-icon-left':!leftIcon.length}" class="uni-navbar-btn-text uni-navbar__content_view">{{ leftText }}</view>
					<slot name="left" />
				</view>
				<view class="uni-navbar__header-container uni-navbar__content_view">
					<view v-if="title.length" class="uni-navbar__header-container-inner uni-navbar__content_view"><text class="navi-title-color">{{ title }}</text></view>
					<!-- 标题插槽 -->
					<slot />
				</view>
				<view :class="title.length?'uni-navbar__header-btns-right':''" class="uni-navbar__header-btns uni-navbar__content_view" @tap="onClickRight">
					<view v-if="rightIcon.length" class="uni-navbar__content_view">
						<uni-icons :type="rightIcon" :color="color" size="24" />
					</view>
					<!-- 优先显示图标 -->
					<view v-if="rightText.length&&!rightIcon.length" class="uni-navbar-btn-text uni-navbar__content_view">{{ rightText }}</view>
					<slot name="right" />
				</view>
			</view>
			<tabs-view
			v-if="tabs.length !== 0"
			class="uni-nav-tabs-style"
			ref="tabs"
			:tabs="tabs" 
			animationMode="line2"
			:current="current" 
			@change="change"
			:width="750 / tabs.length"
			activeColor="#FFFFFF"
			defaultColor="#FFFFFF"
			:swiperWidth="750">
			</tabs-view>
		</view>
		<!-- <view v-if="fixed" class="uni-navbar__placeholder">
			<uni-status-bar v-if="statusBar" />
			<view class="uni-navbar__placeholder-view" />
		</view> -->
		<div v-if="tabs.length !== 0" class="uni-navi-tabs-swiper"></div>
		<slot name="tabSwiper"></slot>
	</view>
</template>

<script>
	import uniStatusBar from '../uni-status-bar/uni-status-bar.vue'
	import uniIcons from '../uni-icons/uni-icons.vue'
	import tabsView from "../QS-tabs/QS-tabs.vue"
	export default {
		name: 'UniNavBar',
		components: {
			uniStatusBar,
			uniIcons,
			tabsView
		},
		props: {
			tabs: {
				type: Array,
				default: () => {
					return []
				}
			},
			hideNavi: {
				type: Boolean,
				default: true
			},
			// 是否显示返回按钮
			back: {
				type: Boolean,
				default: false
			},
			// 返回层级数
			backDelta: {
				type: Number,
				default: 1
			},
			title: {
				type: String,
				default: ''
			},
			leftText: {
				type: String,
				default: ''
			},
			rightText: {
				type: String,
				default: ''
			},
			leftIcon: {
				type: String,
				default: ''
			},
			rightIcon: {
				type: String,
				default: ''
			},
			fixed: {
				type: [Boolean, String],
				default: false
			},
			color: {
				type: String,
				default: '#FFFFFF'
			},
			backgroundColor: {
				type: String,
				default: '#FFFFFF'
			},
			statusBar: {
				type: [Boolean, String],
				default: false
			},
			shadow: {
				type: [String, Boolean],
				default: true
			},
			border: {
				type: [String, Boolean],
				default: true
			}
		},
		data() {
			return {
				current: 0 //当前所在滑块的 index
			}
		},
		methods: {
			onClickLeft() {
				if (this.back) {
					var _this = this
					uni.navigateBack({ delta: _this.backDelta })
				}
				this.$emit('click-left')
			},
			onClickRight() {
				this.$emit('click-right')
			},
			change (index) {
				this.current = index
				this.$emit('changeTab', index)
			},
			swiperChange({detail: { current }}) {
				this.current = current;
			},
			transition(e) {
				this.$refs.tabs.setDx(e.detail.dx);
			},
			animationfinish(e) {
				this.$refs.tabs.setFinishCurrent(e.detail.current);
			}
		}
	}
</script>

<style scoped>
	@charset "UTF-8";
	
	/* #ifndef APP-PLUS-NVUE */
	/* #endif */
	
	page {
		height: 100vh;
	}
	
	.uni-navbar {
		flex: 1;
		flex-direction: column;
		display: flex;
		height: 100vh;
		z-index: 1000;
	}
	
	.uni-navi-tabs-swiper {
		height: 48px;
	}

	.uni-navbar__content {
		display: block;
		position: relative;
		width: 750rpx;
		background-color: #4B4EFA;
		/* background-image: linear-gradient(270deg,rgba(88,45,233,1) 0%,rgba(76,89,237,1) 55%,rgba(59,154,243,1) 100%); */
		overflow: hidden;
		flex-wrap: wrap;
	}
	
	.navi-title-color {
		color: #FFFFFF;
	}

	.uni-navbar__content .uni-navbar__content_view {
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.uni-navbar__header {
		display: flex;
		flex-direction: row;
		width: 750rpx;
		height: 44px;
		line-height: 44px;
		font-size: 16px;
		align-items: center;
		justify-content: center;
		color: #FFFFFF;
	}

	.uni-navbar__header-btns {
		display: inline-flex;
		flex-wrap: nowrap;
		flex-shrink: 0;
		width: 120upx;
		padding: 0 12upx
	}
	
	.uni-navbar__header-container-inner {
		width: 100%;
		display: flex;
		justify-content: center;
		align-items: center;
		font-size: 36rpx;
		text-align: center;
	}
	
	.uni-navbar--shadow {
		box-shadow: 0 1px 6px #ccc
	}
	
	.uni-navbar--border:after {
		position: absolute;
		z-index: 3;
		bottom: 0;
		left: 0;
		right: 0;
		height: 1px;
		content: '';
		-webkit-transform: scaleY(.5);
		transform: scaleY(.5);
		background-color: #e5e5e5
	}
	/*  */

	.uni-navbar__header-btns:first-child {
		padding-left: 0
	}

	.uni-navbar__header-btns:last-child {
		width: 60upx
	}

	.uni-navbar__header-btns-right:last-child {
		width: 120rpx;
		text-align: right;
		flex-direction: row-reverse
	}

	.uni-navbar__header-container {
		width: 100%;
		margin: 0 10rpx;
		flex: 1;
	}

	.uni-navbar__placeholder-view {
		height: 44px
	}

	.uni-navbar--fixed {
		position: fixed;
		flex-direction: row-reverse;
		z-index: 998
	}
	
	.uni-navbar-btn-text {
		font-size:30rpx;
		font-family:PingFangSC-Regular,PingFang SC;
	}
	
	.uni-nav-tabs-style {
		margin-top: 16rpx;
	}
	
	.iconfont {
		margin-right: 24rpx;
		margin-left: 24rpx;
		font-size: 35rpx;
		color: #FFFFFF;
	}

</style>