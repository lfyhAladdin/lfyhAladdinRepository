<template>
  <view class="information-box">
    <view :class="phoneSystem ?'pf-title pf-title-ios pf-titleThree':'pf-title pf-titleThree'">
      <img src="@/static/images/firstroom/backArrow.svg" @click="navigateBack">
      <text>{{title}}</text>
      <img src="@/static/images/firstroom/share.svg" @click="showShareFunction" class="ch-share">
    </view>
    <view class="pf-content information-content">
      <view class="pinformations">
        <view class="pinformation-one">
          <view class="pinformation"  @click="goDetailPage(personInformation,false)">
            <view class="pinformation-left">
              <img src="@/static/images/firstroom/PIperson.svg" />
              <text>人员信息</text>
            </view>
            <view class="pinformation-right">
              <text v-show="ifperfectPersonInfor">已完善</text>
              <text v-show="!ifperfectPersonInfor" class="not-completed">未完善</text>
              <img src="@/static/images/firstroom/formChooseArrow.svg" />
            </view>
          </view>
        </view>
      </view>
      <view class="pinformations">
        <view class="pinformation-two">
          <view class="pinformation" @click="goDetailPage(businessInformation,false)">
            <view class="pinformation-left">
              <img src="@/static/images/firstroom/PIloan.svg" />
              <text>贷款申请信息</text>
            </view>
            <view class="pinformation-right">
              <text v-show="ifperfectBusinessInfor">已完善</text>
              <text v-show="!ifperfectBusinessInfor" class="not-completed">未完善</text>
              <img src="@/static/images/firstroom/formChooseArrow.svg" />
            </view>
          </view>
          <view class="pinformation" @click="goDetailPage(guarantyContract,false)">
            <view class="pinformation-left">
              <img src="@/static/images/firstroom/PIcontract.svg" />
              <text>担保合同</text>
            </view>
            <view class="pinformation-right">
              <text v-show="ifperfectGuarantyContractr">已完善</text>
              <text v-show="!ifperfectGuarantyContractr" class="not-completed">未完善</text>
              <img src="@/static/images/firstroom/formChooseArrow.svg" />
            </view>
          </view>
        </view>
      </view>
      <view class="pinformations">
        <view class="pinformation-one">
          <view class="pinformation"  @click="goDetailPage(imageInformation,false)">
            <view class="pinformation-left">
              <img src="@/static/images/firstroom/PIimage.svg" />
              <text>影像信息</text>
            </view>
            <view class="pinformation-right">
              <text v-show="ifperfectImageInfor">已完善</text>
              <text v-show="!ifperfectImageInfor" class="not-completed">未完善</text>
              <img src="@/static/images/firstroom/formChooseArrow.svg" />
            </view>
          </view>
        </view>
      </view>
    </view>
    <view class="">
      <view class="cbutton" @click="goDetailPage(creditInformation,true)">
        <text>下一步</text>
      </view>
    </view>
    <view class="bullet-frame" v-if="showShare">
      <view class="share-qrcode">
        <view class="share-qrcode-title">换种方式分享</view>
        <view class="qrcode" id="qrcodeJS" ref="qrcodeJS">
          <view class="qrcode-code">
            <canvas class="couponQrCodes" :style="{'width':'200px','height':'200px'}" canvas-id="couponQrCodes"></canvas>
          </view>
        </view>    
        <view class="share-qrcode-con">客户征信授权，一码搞定！</view>
      </view>
      <!--<view class="share-class">
        <view class="share-class-title">分享至</view>
        <view class="share-class-list">
          <view class="shares share-wechat">
            <img src="@/static/images/firstroom/sWeChatLogo.svg">
            <text>微信好友</text>
          </view>
          <view class="shares share-moments">
            <img src="@/static/images/firstroom/sWeChatMomentsLogo.svg">
            <text>微信朋友圈</text>
          </view>
          <view class="shares share-copy-link">
            <img src="@/static/images/firstroom/sCopyLinkLogo.svg">
            <text>复制链接</text>
          </view>
        </view>
      </view>-->

      <view class="share-close"  @click="showShare = false"><img src="@/static/images/firstroom/sClose.svg"></view>
    </view>
  </view>
</template>
<script>
import { mapActions, mapGetters, mapMutations } from "vuex";
const qrCode = require("../../../static/js/weapp-qrcode.js");
export default {
  data: function() {
    return {
      title: "",
      navigateFlag: false,
      showShare: false, //展示分享
      personInformation: { url: "personInformation/personInformation" }, //人员信息跳转
      guarantyContract: { url: "perfectInformation/guarantyContract/guarantyContract" }, //担保合同
      businessInformation: { url: "loanInformation/businessInformation" }, //贷款申请信息跳转
      imageInformation: { url: "perfectInformation/imageInformation/imageInformation" }, //影像信息
      // creditSubmit: { url: "perfectInformation/creditSubmit/creditSubmit" }, //风险评估
      creditInformation: { url: "perfectInformation/creditSubmit/creditInformation" }, //征信信息
      applyNoVal: "", //申请编号,
      ifperfectPersonInfor:false,//人员信息是否完善
      ifperfectGuarantyContractr:false,//担保合同是否完善
      ifperfectBusinessInfor:false,//贷款申请信息是否完善
      ifperfectImageInfor:false,//影像信息是否完善
      pageFrom:'',
      el: '#qrcodeJS',
      qrcodeWidth:'',
      qrcodeHeight:''
    };
  },
  created() {
    /* this.$nextTick(() => {
      this.couponQrCodes()
    }) */
  },
  mounted() {
    //调用二维码生成的方法
      /* this.$nextTick(() => {
        this.couponQrCodes()
      }) */
  },
  computed: {
    qrcode_width: function() {
      return this.qrcodeWidth;
    },
    qrcode_height: function() {
      return this.qrcodeHeight;
    },
    ...mapGetters(["queryApplyInfoList"])
  },
  onLoad: function(options) {
    this.updatePerfectFlag();
    this.applyNoVal = this.queryApplyInfoList.applyNo
  },
  methods: {
    //返回上一页
    navigateBack() {
      if(this.pageFrom === "incoming"){
        yu.switchTab({ url: "/pages/ebank/index/index" });
      }else{
        this.pageJump("profession/approvalIng/approvalIng?applyPhase=01");
      }
    },

    triggerCollapse(e) {
      if (!this.list[e].pages) {
        this.goDetailPage(this.list[e].url);
        return;
      }
      for (var i = 0; i < this.list.length; ++i) {
        if (e === i) {
          this.list[i].open = !this.list[e].open;
        } else {
          this.list[i].open = false;
        }
      }
    },
    showShareFunction(){
      let _this=this;
      _this.showShare=true;
      _this.$nextTick(() => {
        _this.couponQrCodes()
      })
      //setTimeout(function(){
       // _this.couponQrCodes()
      //},3000) 
    },
    goDetailPage(e,a) {
      if (this.navigateFlag) {
        return;
      }
      let path = e.url ? e.url : e;
      // let url = ~path.indexOf('platform') ? path : '/pages/ebank/' + path + '/' + path;
      let url = ~path.indexOf("platform") ? path : "/pages/ebank/" + path;
      if (path === "user-info" && !this.hasLogin) {
        yu.showToast({
          icon: "none",
          title: "您还未登录，请先登录！",
          duration: 1500
        });
        setTimeout(() => {
          yu.navigateTo({ url: "/pages/ebank/login/login" });
        }, 1500);
      } else {
        this.navigateFlag = true;
        if(a){
          yu.showLoading();
          let data = {
            'applyNo': this.applyNoVal,  //申请编号
          }
          this.interfaceRequest('/api/aldappcreditauthorization/judgeisauth',data,"get",(res)=>{
            this.navigateFlag = false;
            yu.hideLoading();
            if(res.data.data.returnCode == 'Success'){
              yu.navigateTo({ url: url });
            }else{
              yu.showToast({
                title: res.data.data.returnDesc,
                icon: 'none',
                duration: 3000
              });
            }
          },(err)=>{
            this.navigateFlag = false;
            yu.hideLoading();
            yu.showToast({
              title: '6.12授权异常，请联系管理员！',
              icon: 'none',
              duration: 3000
            });
          });
        }else{
          yu.navigateTo({ url: url });
          setTimeout(() => {
            this.navigateFlag = false;
          }, 200);
        }
      }
    },
    updatePerfectFlag(){
      let approvalIngList= this.queryApplyInfoList;
      this.getTitle(approvalIngList.businessType);
      //获取完善标识
      let personTotalCompleteFlag=approvalIngList.personTotalCompleteFlag;//人员信息是否完善
      if(personTotalCompleteFlag === "1"){
        this.ifperfectPersonInfor=true;
      }else{
        this.ifperfectPersonInfor=false;
      }
      if(approvalIngList.guarantyList == null){
        this.ifperfectGuarantyContractr=false;//担保合同是否完善
      }else if(approvalIngList.guarantyList[0].tempSaveFlag === "2"){
        this.ifperfectGuarantyContractr=true;
      }else{
        this.ifperfectGuarantyContractr=false;
      }
      let tempSaveFlag=approvalIngList.tempSaveFlag;//贷款申请信息是否完善
      if(approvalIngList.tempSaveFlag == null){
        this.ifperfectBusinessInfor=false;
      }else if(tempSaveFlag === "2"){
        this.ifperfectBusinessInfor=true;
      }else{
        this.ifperfectBusinessInfor=false;
      }
      //影像信息是否完善ifperfectImageInfor:false,
    },
    getTitle(param){
      if(param == null || param == 'null'){
        return;
      }
      let pdata = {"dictionaryName":"businessType","key":param};
      this.queryDictionaryValue(pdata, (res)=>{
        this.title=res.data.data;
      }); 
    },
    couponQrCodes() {
      let _this=this;
      let applyID=_this.queryApplyInfoList.applyNo;
      let qrcodeurl="https://ald.lccb.com.cn:280/view/creditAuthorization/creditAuthorization.html?applyID="+applyID;
      _this.$nextTick(function () {
        _this.qrcodeWidth = _this.$refs.qrcodeJS.$el.clientWidth + 'px';
        _this.qrcodeHeight = _this.$refs.qrcodeJS.$el.clientHeight + 'px';
      })
      console.log(qrcodeurl);
      const ww = _this.$refs.qrcodeJS.$el.clientWidth; 
      const hh = _this.$refs.qrcodeJS.$el.clientHeight;
      new qrCode("couponQrCodes", {
        text: qrcodeurl,
        width: 200,
        height: 200,
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
};
</script>
<style lang="scss" scoped>
.information-box {
  background: #ffffff !important;
  width: 100%;
  height: 100%;
}
.pf-title{
  .ch-share {
    width: 34rpx;
    height: 34rpx;
  }
}

.pinformations {
  padding: 30rpx 30rpx 0 30rpx;
  .pinformation-one {
    width: 690rpx;
    height: 140rpx;
    background: #ffffff;
    box-shadow: 0 0 28rpx 0 rgba(0, 0, 0, 0.11);
    border-radius: 20rpx;
  }
  .pinformation {
    height: 140rpx;
    line-height: 140rpx;
    display: block;
    padding-left: 32rpx;
    border-bottom: 1rpx solid #e5e5e5;
  }
  .pinformation:last-child {
    border: 0;
  }
  .pinformation-left {
    height: 140rpx;
    line-height: 140rpx;
    float: left;
    display: flex;
    vertical-align: middle;
    align-items: center;
    img {
      width: 80rpx;
      height: 80rpx;
    }
    text {
      height: 45rpx;
      line-height: 45rpx;
      font-size: 32rpx;
      color: #333333;
      margin-left: 16rpx;
    }
  }
  .pinformation-right {
    height: 140rpx;
    line-height: 140rpx;
    float: right;
    display: flex;
    vertical-align: middle;
    align-items: center;
    img {
      width: 14rpx;
      height: 28rpx;
      padding-right: 30rpx;
    }
    text {
      height: 33rpx;
      line-height: 33rpx;
      font-size: 24rpx;
      color: #999999;
      margin-right: 14.7rpx;
    }
    text.not-completed {
      color: #e89f73;
    }
  }
  .pinformation-two {
    width: 658rpx;
    height: 281rpx;
    padding-left: 32rpx;
    background: #ffffff;
    box-shadow: 0 0 28rpx 0 rgba(0, 0, 0, 0.11);
    border-radius: 20rpx;
    .pinformation {
      padding-left: 3rpx;
    }
  }
}
.cbutton {
  width: 620rpx;
  padding: 0;
  margin: 175rpx auto 280rpx auto;
  font-size: 36rpx;
  color: #edf6fe;
  height: 100rpx;
  line-height: 100rpx;
  border-radius: 50rpx;
  background: #3b86f7;
  border: 0rpx;
  text-align: center;
  box-shadow: 0rpx 10rpx 23rpx 0rpx rgba(#3b86f7, 0.4);
}
.cbutton:after {
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
  .share-qrcode {
    width: 630rpx;
    height: 653rpx;
    margin: 162rpx 60rpx 20rpx 60rpx;
    border-radius: 20rpx;
    background: #ffffff;
    display: block;
    .share-qrcode-title {
      height: 45rpx;
      line-height: 45rpx;
      padding-top: 32rpx;
      text-align: center;
      width: 100%;
      color: #333333;
      font-size: 32rpx;
      display: block;
    }
    .qrcode {
      width: 390rpx;
      height: 390rpx;
      margin: 0 auto;
      border: 50rpx solid #ffffff;
      border-bottom: 20rpx solid #ffffff;
      display: flex;
      vertical-align: middle;
      align-items: center;
    }
    .share-qrcode-con {
      width: 420rpx;
      height: 84rpx;
      line-height: 42rpx;
      margin: 0 auto;
      color: #999999;
      font-size: 30rpx;
      text-align: center;
      display: block;
    }
  }
  .share-qrcode:after {
    display: block;
    content: "";
    clear: both;
  }
  .share-class {
    width: 630rpx;
    height: 280rpx;
    margin: 0 60rpx 0 60rpx;
    border-radius: 20rpx;
    background: #ffffff;
    display: block;
    .share-class-title {
      height: 45rpx;
      line-height: 45rpx;
      text-align: left;
      padding-left: 39rpx;
      padding-top: 42rpx;
      font-size: 32rpx;
      color: #333435;
      display: block;
    }
    .share-class-list {
      padding: 44rpx 35rpx 0 35rpx;
      .shares {
        width: 187rpx;
        text-align: center;
        float: left;
        img {
          width: 60rpx;
          height: 60rpx;
          display: block;
          margin: 0 auto;
        }
        text {
          margin-top: 11rpx;
          height: 33rpx;
          line-height: 33rpx;
          text-align: center;
          color: #999999;
          font-size: 24rpx;
        }
      }
    }
  }
  .share-class:after {
    display: block;
    content: "";
    clear: both;
  }

  .share-close {
    width: 100%;
    margin-top: 44rpx;
    height: 70rpx;
    line-height: 70rpx;
    display: block;
    text-align: center;
    img {
      width: 70rpx;
      height: 70rpx;
      margin: 0 auto;
    }
  }
}
</style>
