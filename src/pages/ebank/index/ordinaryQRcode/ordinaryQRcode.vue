<template>
  <view class="incoming">
    <view :class="phoneSystem ? 'pf-title pf-title-ios pf-titleTwo pf-titleTwo-ios':'pf-title pf-titleTwo'">
      <img src="@/static/images/firstroom/backArrow.svg" @click="navigateBack">
      <text>{{title}}</text>
    </view>
    <view class="customize-content-qrcode">
      <view class="qrcode-box">
        <view class="qrcode" id="qrcodeJS" ref="qrcodeJS">
          <view class="qrcode-code">
            <canvas class="couponQrCodes" :style="{'width':qrcode_width,'height':qrcode_height}" canvas-id="couponQrCodes"></canvas>
          </view>
        </view>        
        <view class="qrcode-word"><text>邀请客户使用微信扫一扫，在线申请</text></view>
      </view>
      <view class="" @click="newpageJump(ordinary)">
        <view class="cbutton">
          <text>普通进件</text>
        </view>
      </view>
    </view>
  </view>
</template>
<script>
import pageHead from "@/components/page-head.vue";
const qrCode = require("@/static/js/weapp-qrcode.js");
import {mapGetters,mapMutations } from "vuex";
export default {
  data() {
    return {
      title: "",
      fromProduct:"",
      navigateFlag: false,
      ordinary: "index/ordinaryIncoming/ordinaryIncoming",
      el: '#qrcodeJS',
      qrcodeWidth:'',
      qrcodeHeight:'',
      qrcodeUrl:'',
    };
  },
  onLoad(option) {
    let e = {
      fromProductTitle: "",
      fromProductName: "",
      fromProductId: "",
      businessType2: "",
    };
    this.fromProduct=option.from;
    if(option.from === 'firstroom'){//一手房
      e.fromProductTitle="一手房";
      e.fromProductName="个人一手住房贷款";
      e.fromProductId="1140010";
    }else if(option.from === 'secondroom'){//二手房
      e.fromProductTitle="二手房";
      e.fromProductName="个人二手住房贷款";
      e.fromProductId="1140020";
    }else if(option.from === 'firstcommercialroom'){//一手商用房
      e.fromProductTitle="一手商用房";
      e.fromProductName="个人一手商用房贷款";
      e.fromProductId="1140110";
    }else if(option.from === 'secondcommercialroom'){//二手商用房
      e.fromProductTitle="二手商用房";
      e.fromProductName="个人二手商用房贷款";
      e.fromProductId="1140120";
    }
    e.businessType2 = e.fromProductTitle;
    e.businessType = e.fromProductId;
    this.title=e.fromProductTitle;
    this.approvalIngListReplace(e);
  },
  onShow() {},
  onUnload() {},
  created(){},
  methods: {
    ...mapMutations(["approvalIngListReplace"]),
    
    //返回上一页
    navigateBack() {
      yu.switchTab({ url: "/pages/ebank/index/index" });
    },
    newpageJump(ordinary){
      let url = ordinary+"?from="+ this.fromProduct;
      this.pageJump(url);
    },
    // 二维码生成工具
    couponQrCodes() {
        this.qrcodeUrl="https://ald.lccb.com.cn:280/view/order/orderRequest.html?bT="+ this.approvalIngList.fromProductId+"&lC="+ this.userInfor.loginCode+"&oI="+ this.userInfor.orgId;
        this.$nextTick(function () {
        this.qrcodeWidth = this.$refs.qrcodeJS.$el.clientWidth + 'px';
        this.qrcodeHeight = this.$refs.qrcodeJS.$el.clientHeight + 'px';
      })
      const ww = this.$refs.qrcodeJS.$el.clientWidth; 
      const hh = this.$refs.qrcodeJS.$el.clientHeight;
      new qrCode("couponQrCodes", {
        text: this.qrcodeUrl,
        width: ww,
        height: hh,
        colorDark: "#333333",
        colorLight: "#FFFFFF",
        correctLevel: qrCode.CorrectLevel.H,
        /* image: {
          imageResource: "",//../../static/images/firstroom/qrcodeLogo.svg
          dx: 70,
          dy: 70,
          dWidth: 60,
          dHeight: 60
        } */
      });
    },
  },

  mounted() {
     //调用二维码生成的方法
     this.$nextTick(() => {
        this.couponQrCodes()
      })
  },
  computed: {
    qrcode_width: function() {
      return this.qrcodeWidth;
    },
    qrcode_height: function() {
      return this.qrcodeHeight;
    },
    ...mapGetters(["approvalIngList","userInfor"]),
    
  },
  activated(){
    this.title=this.approvalIngList.fromProductTitle;
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
  .customize-content-qrcode {
    margin-top: 152rpx;
    background: #f6f8f9 !important;
    width: 100%;
    height: 100%;
    .qrcode-box {
      width: 690rpx;
      height: 690rpx;
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
        height: 42rpx;
        line-height: 42rpx;
        font-size: 30rpx;
        color: #999999;
        text-align: center;
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

  .customize-content-form {
    background: #f6f8f9 !important;
    width: 100%;
    height: 100%;
    .image-information {
      height: 421rpx;
      background: #ffffff;
      margin-top: 24rpx;
    }
  }
  .customize-content-form:after {
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
.cbutton {
  width: 620rpx;
  padding: 0;
  margin: 196rpx auto 190rpx auto;
  font-size: 36rpx;
  color: #edf6fe;
  height: 100rpx;
  line-height: 100rpx;
  border-radius: 50rpx;
  background: #3b86f7;
  border: 0rpx;
  text-align: center;
  box-shadow: 0rpx 10rpx 23rpx 0rpx rgba(#3b86f7, 0.24);
}
.cbutton:after {
  display: block;
  content: "";
  clear: both;
}
</style>
