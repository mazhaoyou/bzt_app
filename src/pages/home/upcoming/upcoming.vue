<!-- 待办事项 -->
<template>
	<view class="upcoming">
		<uni-nav-bar ref="tabs" backgroundColor="#4B4EFA" :back="true" :tabs="['联络', '催款']" :fixed="true" :hideNavi="true" :status-bar="true" :border="false" title="待办事项" @changeTab="changeTab">
			<swiper
			slot="tabSwiper"
			class="upcoming-swiper"
			@change="swiperChange"
			@transition="transition"
			@animationfinish="animationfinish"
			easing-function="linear"
			:current="current"
			>
				<swiper-item>
					<contact ref="contact" :date="date"></contact>
				</swiper-item>
				<swiper-item>
					<dunning ref="dunning" :date="date"></dunning>
				</swiper-item>
			</swiper>
		</uni-nav-bar>
	</view>
</template>

<script>
	import uniNavBar from '../../../components/uni-nav-bar/uni-nav-bar.vue'
	import contact from "./contact.vue"
	import dunning from "./dunning.vue"
	export default {
		components: {
			uniNavBar,
			contact,
			dunning,
		},
		data(){
			return {
				current: 0,
				date: '',
				contactNeedReload: false, // 待联络是否需要刷新
			}
		},
		onLoad(option) {
			this.changeTab(option.current)
			this.date = option.date
		},
		onShow () {
			if (!this.$util.getPrivilegeById('p1000001')) {
				this.$util.showModal('提示', '暂无权限', () => {
					uni.navigateBack()
				})
				return
			}
			this.$refs.contact.loadPage(this.date)
			this.$refs.dunning.loadPage(this.date)
		},
		created() {},
		methods: {
			changeTab (current) {
				this.current = current
			},
			swiperChange (e) {
				this.current = e.detail.current
				this.$refs.tabs.swiperChange(e)
			},
			transition (e) {
				// this.$refs.tabs.transition(e)
			},
			animationfinish (e) {
				// this.$refs.tabs.animationfinish(e)
			}
		},
		mounted () {}
	}
</script>

<style scoped>
.upcoming {
	flex: 1;
	height: 100vh;
	display: flex;
	flex-direction: column;
	background-color: #F6F6F6;
}
.upcoming-swiper {
	width: 750rpx;
	flex: 1;
}
</style>
