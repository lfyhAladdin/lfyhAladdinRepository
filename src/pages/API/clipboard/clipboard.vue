<template>
	<view>
		<page-head :title="title"></page-head>
		<view class="uni-padding-wrap">
			<view class="uni-title">请输入剪贴板内容</view>
			<view class="uni-list">
				<view class="uni-list-cell">
					<input class="uni-input" type="text" placeholder="请输入剪贴板内容" :value="data" @input="dataChange"></input>
				</view>
			</view>
			<view class="uni-btn-v">
				<button type="primary" @click="setClipboard">存储数据</button>
				<button @tap="getClipboard">读取数据</button>
			</view>
		</view>
	</view>
</template>
<script>
	export default {
		data() {
			return {
				title: 'get/setClipboardData',
				data: ''
			}
		},
		methods: {
			dataChange: function (e) {
				this.data = e.detail.value
			},
			getClipboard: function () {
				yu.getClipboardData({
					success: (res) => {
						console.log(res.data);
						const content = res.data ? '剪贴板内容为:' + res.data : '剪贴板暂无内容';
						yu.showModal({
							content,
							title: '读取剪贴板',
							showCancel: false
						})
					},
					fail: (res) => {
						console.log(res);
						yu.showModal({
							content: '读取剪贴板失败!',
							showCancel: false
						})
					}
				});
			},
			setClipboard: function () {
				var data = this.data;
				if (data.length === 0) {
					yu.showModal({
						title: '设置剪贴板失败',
						content: '内容不能为空',
						showCancel: false
					})
				} else {
					yu.setClipboardData({
						data: data,
						success: () => {
							// 成功处理
							// #ifdef MP-ALIPAY || MP-BAIDU || MP-TOUTIAO
							yu.showToast({
								title: '设置剪贴板成功',
								icon: "success"
							})
							// #endif
						},
						fail: (res) => {
							// 失败处理
							console.log(res);
							// #ifdef MP-ALIPAY || MP-BAIDU || MP-TOUTIAO
							yu.showToast({
								title: '储存数据失败!',
								icon: "none"
							})
							// #endif
						}
					});
				}
			}
		}
	}
</script>

<style>
	
</style>


