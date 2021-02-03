<template>
  <view class="incoming">
    <view :class="phoneSystem ? 'pf-title pf-title-ios pf-titleTwo pf-titleTwo-ios':'pf-title pf-titleTwo'">
      <img src="@/static/images/firstroom/backArrow.svg" @click="navigateBack">
      <text>{{title}}</text>
    </view>
    <view class="pf-content customize-content-qrcode">
      <view class="qrcode-box">
        <view class="qrcode" id="qrcodeSuccessJS" ref="qrcodeSuccessJS">
          <view class="qrcode-code">
            <canvas class="couponQrCode" :style="{'width':qrcode_width,'height':qrcode_height}" canvas-id="couponQrCode"></canvas>
          </view>
        </view>             
        <view class="qrcode-word">
          <text>您可以通过现场演示、或者发送短信给</text>
          <text>相关人员由其使用微信扫码进行征信授权</text>
        </view>
        <view class="qrcode-btn">
          <text class="send-message" @click="sendMessage">发送短信</text><text class="next" @click="showPromt = true">下一步</text>
        </view>
      </view>
    </view>

    <!--弹框提示-->
    <view class="bullet-frame" v-show="showPromt" @click="showPromt = false">
      <view class="prompt-box">
        <text class="prompt-title">是否有共借人</text>
        <text class="prompt-con">可点击按钮直接添加共借人信息</text>
        <text class="prompt-btn" @click="pageJump(householdRegister)">有共借人，去添加</text>
        <text class="prompt-btn" @click="pageJump(perfectInformation)">暂不添加</text>
      </view>
    </view>
  </view>
</template>
<script>
import pageHead from "@/components/page-head.vue";
const qrCode = require("@/static/js/weapp-qrcode.js");
import { mapGetters } from "vuex";
export default {
  data() {
    return {
      title: "进件成功",
      navigateFlag: false,
      serialNo: "",
      imglist: [],
      showPromt: false, //展示弹框
      ordinary: { url: "ordinaryIncoming" },
      perfectInformation: "perfectInformation/perfectInformation?from=incoming",
      householdRegister:
        // "personInformation/borrowerInformation/householdRegister/householdRegister?identity=共借人",
        "personInformation/householdRegister/householdRegister?identity=共借人",
      el: "#qrcodeSuccessJS",
      qrcodeWidth: "",
      qrcodeHeight: ""
    };
  },
  onLoad: function(options) {
    this.serialNo = options.serialNo; //申请编号获取//2020120800000002
    //this.imglist = options.imglist; //图片批次号
  },
  onShow() {},
  onUnload() {},
  methods: {
    //返回上一页
    navigateBack() {
      yu.switchTab({ url: "/pages/ebank/index/index" });
    },

    // 二维码生成工具
    couponQrCodes() {
      let _this = this;
      let applyID=_this.queryApplyInfoList.applyNo;
      let qrcodeurl="https://ald.lccb.com.cn:280/view/creditAuthorization/creditAuthorization.html?applyID="+applyID;
      _this.$nextTick(function() {
        _this.qrcodeWidth = _this.$refs.qrcodeSuccessJS.$el.clientWidth + "px";
        _this.qrcodeHeight =
          _this.$refs.qrcodeSuccessJS.$el.clientHeight + "px";
      });
      const ww = _this.$refs.qrcodeSuccessJS.$el.clientWidth;
      const hh = _this.$refs.qrcodeSuccessJS.$el.clientHeight;
      new qrCode("couponQrCode", {
        text: qrcodeurl,
        width: ww,
        height: hh,
        colorDark: "#333333",
        colorLight: "#FFFFFF",
        correctLevel: qrCode.CorrectLevel.H
        /* image: {
          imageResource: "",//../../static/images/firstroom/qrcodeLogo.svg
          dx: 70,
          dy: 70,
          dWidth: 60,
          dHeight: 60
        } */
      });
    },
    //点击发送短信按钮事件
    sendMessage() {
      uni.showModal({
        title: "本功能暂不支持，敬请期待",
        content: "是否要回到首页？",
        success: function(res) {
          if (res.confirm) {
            setTimeout(() => {
              uni.switchTab({ url: "/pages/ebank/index/index" });
            }, 1500);
          } else if (res.cancel) {
            console.log("用户点击取消");
          }
        }
      });
    }
  },
  mounted() {
    //调用二维码生成的方法
    this.$nextTick(() => {
      this.couponQrCodes();
    });
  },
  computed: {
    qrcode_width: function() {
      return this.qrcodeWidth;
    },
    qrcode_height: function() {
      return this.qrcodeHeight;
    },
    ...mapGetters(["queryApplyInfoList"])
  }
};
</script>

<style lang='scss' scoped>
uni-page-wrapper {
  height: 100% !important;
}
uni-page-wrapper:after {
  display: block;
  content: "";
  clear: both;
}
uni-page-body {
  height: 100% !important;
}
uni-page-body:after {
  display: block;
  content: "";
  clear: both;
}
.incoming {
  background: #f6f8f9 !important;
  width: 100%;
  height: 100%;
  .customize-head {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 10;
    width: 100%;
    padding: 62rpx 36rpx 18rpx 0;
    height: 50rpx;
    line-height: 50rpx;
    background: #ffffff;
    display: flex;
    vertical-align: middle;
    align-items: center;
    border-bottom: 1rpx solid #e5e5e5;
    .ch-img {
      position: absolute;
      left: 0;
      top: 69rpx;
      width: 20rpx;
      height: 36rpx;
      margin-left: 36rpx;
      img {
        width: 20rpx;
        height: 36rpx;
      }
    }
    .ch-title {
      font-size: 36rpx;
      height: 50rpx;
      line-height: 50rpx;
      margin: 0 auto;
      text-align: center;
      color: #333333;
    }
  }
  .customize-content-qrcode {
    background: #f6f8f9 !important;
    width: 100%;
    height: 100%;
    margin-top: 156rpx;
    .qrcode-box {
      width: 690rpx;
      background: #ffffff;
      margin: 24rpx 30rpx;
      border-radius: 20rpx;
      uni-canvas {
        width: 500rpx;
        height: 500rpx;
        display: flex;
        vertical-align: middle;
        align-items: center;
      }
      .qrcode {
        width: 500rpx;
        height: 500rpx;
        margin: 0 auto;
        border: 50rpx solid #ffffff;
        display: flex;
        vertical-align: middle;
        align-items: center;
        img {
          width: 500rpx;
          height: 500rpx;
        }
      }
      .qrcode-word {
        width: 100%;
        height: 84rpx;
        line-height: 42rpx;
        font-size: 30rpx;
        color: #999999;
        text-align: center;
        text {
          display: block;
        }
      }
      .qrcode-btn {
        height: 94rpx;
        line-height: 94rpx;
        border-top: 0.6rpx solid #e0e0e0;
        margin-top: 39rpx;
        text {
          width: 49.8%;
          height: 94rpx;
          line-height: 94rpx;
          font-family: PingFangSC-Regular;
          font-size: 32rpx;
          letter-spacing: 0;
          text-align: center;
          display: inline-block;
        }
        .send-message {
          color: #333435;
        }
        .next {
          color: #3b86f7;
          border-left: 0.6rpx solid #e0e0e0;
        }
      }
    }
    .qrcode-box:after {
      display: block;
      content: "";
      clear: both;
    }
  }
  .customize-content-qrcode:after {
    display: block;
    content: "";
    clear: both;
  }
}

.incoming:after {
  display: block;
  content: "";
  clear: both;
}

.bullet-frame {
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.65);
  position: fixed;
  z-index: 10;
  left: 0;
  top: 0;
  .prompt-box {
    width: 540rpx;
    height: 398rpx;
    background: #ffffff;
    border: 0.6rpx solid #ffffff;
    border-radius: 15rpx;
    position: absolute;
    top: 50%;
    left: 50%;
    margin-left: -270rpx;
    margin-top: -199rpx;
    .prompt-title {
      width: 100%;
      height: 50rpx;
      line-height: 50rpx;
      text-align: center;
      margin-top: 42rpx;
      font-size: 36rpx;
      color: #333333;
      display: block;
    }
    .prompt-con {
      width: 100%;
      height: 40rpx;
      line-height: 40rpx;
      text-align: center;
      font-size: 28rpx;
      color: #999999;
      margin: 36rpx 0 49.1rpx 0;
      display: block;
    }
    .prompt-btn {
      height: 45rpx;
      line-height: 45rpx;
      padding: 21.1rpx 0 22.1rpx 0;
      color: #3b86f7;
      font-size: 32rpx;
      text-align: center;
      display: block;
      border-top: 0.6rpx solid #e0e0e0;
    }
  }
}
</style>
