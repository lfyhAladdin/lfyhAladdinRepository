<template>
  <view class="credit-submit">
    <view class="credit-submit-con">
      <view class="customize-head">
        <view class="ch-img" @tap="navigateBack"><img src="@/static/images/creditsubmit/wBackArrow.svg" /></view>
        <view class="ch-title">{{identity}}</view>
      </view>
      <!--检查进行中  start-->
      <view v-show="ifCheckProgressing">
        <!--检查进行中  百分比显示  start-->
        <view class="progress-tips"><svg-bar style="font-size:15px" :value="processNumber" :options="options"></svg-bar></view>
        <!--检查进行中  百分比显示  end-->
        <view class="credit-submit-progress">
          <view class="con-title">检查各项</view>
          <!--检查进行中-->
          <view class="con-infor processing"><text>风控规则检查</text><img class="process" src="@/static/images/creditsubmit/processing.svg"></view>
          <view class="credit-submit-foot">
            <text>正在执行风险探测，请稍候… </text><text>请勿退出此页面，否则风险探测会中止</text>
          </view>
        </view>
      </view>
      <!--检查进行中  end-->
      <!--检查通过  start-->
      <view v-show="ifCheckPass">
        <view class="progress-tips hasresult">
          <img class="tips-img" src="@/static/images/creditsubmit/corret.svg">
          <text class="tips-con">通过</text>
          <text class="tips-tip">风险探测结果</text>
        </view>
        <view class="credit-submit-progress">
          <view class="con-title">检查结果</view>
          <!--检查通过-->
          <view class="con-infor"><text>信息完整性检查</text><img class="pass" src="@/static/images/creditsubmit/pass.svg"></view>
          <!--检查通过，含有风险提示-->
          <view class="con-infor processing"><text>风控规则检查</text><img class="pass" src="@/static/images/creditsubmit/pass.svg"></view>
          <!--通过提示  start-->
          <view class="con-tips">
            <!--<view class="pass-tips">
              <text>1、在全行范围内未结清的授信业务发放总金额 （折人民币）：[200000]元</text>
              <text>2、在全行范围内未结清的授信业务总余额（折人民币）：[800000]元</text>
              <text>3、在全行范围内授信业务敞口金额（折人民币）：[0.00]元</text>
              <text>4、在全行范围内未结清的授信业务总笔数）：[1]笔</text>
            </view>-->
            <view class="cbutton" @click="nextStep" style="margin-top:200rpx">
              <text>下一步</text>
            </view>
          </view>
          <!--通过提示  end-->
        </view>
      </view>
      <!--检查通过  end-->
      <!--检查未通过  start-->
      <view v-show="ifCheckNoPass">
        <view class="progress-tips hasresult">
          <img class="tips-img" src="@/static/images/creditsubmit/error.svg">
          <text class="tips-con">风险探测不通过，暂时无法提交</text>
          <text class="tips-tip">请根据提示信息检查申请内容！</text>
        </view>
        <view class="credit-submit-progress">
          <view class="con-title">检查结果</view>
          <!--检查未通过-->
          <view v-show="ifRInopass" class="con-infor"><text>信息完整性检查</text><img class="pass" src="@/static/images/creditsubmit/pass.svg"></view>
          <view v-show="!ifRInopass" class="con-infor"><text>信息完整性检查</text><img class="nopass" src="@/static/images/creditsubmit/nopass.svg"></view>
          
          <view v-show="ifRFnopass" class="con-infor processing"><text>风控规则检查</text><img class="pass" src="@/static/images/creditsubmit/pass.svg"></view>
          <view v-show="!ifRFnopass" class="con-infor processing"><text>风控规则检查</text><img class="nopass" src="@/static/images/creditsubmit/nopass.svg"></view>
          
          <!--申请人黑名单  start-->
          <view class="con-tips">
            <view class="blacklist-tips">
              <text v-for="(item,index) in completCheckList" :key="index">{{item.errorMessage}}</text>
            </view>
            <view class="cbutton" @click="toPerfectInformation">
              <text>知道了</text>
            </view>
          </view>
          <!--申请人黑名单  end-->
        </view>
      </view>
      <!--检查未通过  end--> 
    </view>


    <!--提交信息弹框-->
    <view class="credit-submit-frame" v-show="ifCreditSubmitFrame">
      <!--提交-->
      <view class="submit submit-infor" v-show="ifSubmitInfor">
        <view class="frame-title"><img @click="closeSubmit" class="close" src="@/static/images/creditsubmit/blackClose.svg"><text>提交</text></view>
        <view class="person-infor">
          <view class="person-infor-one" @click="chooseNode">
            <img class="choose-arrow" src="@/static/images/firstroom/formChooseArrow.svg" />
            <text>审批节点</text>
            <text style="color: #c7c9cd;margin-right:63rpx;">{{phaseName}}</text>
          </view>
          <view class="person-infor-one" @click="choosePerson">
            <img class="choose-arrow" src="@/static/images/firstroom/formChooseArrow.svg" />
            <text>审批人员</text>
            <text style="color: #c7c9cd;margin-right:63rpx;">{{userName}}</text>
          </view>
        </view>
        <view v-show="!ifshowFrameButton" class="cbutton frame-button noactive" @click="submitInfor">
            <text>确认提交</text>
        </view>
        <view v-show="ifshowFrameButton" class="cbutton frame-button" @click="submitInfor">
            <text>确认提交</text>
        </view>
      </view>

      <!--选择审批人员-->
      <view class="submit choose-person" v-show="ifChoosePerson">
        <view class="frame-title"><img @click="backSubmit" class="close" src="@/static/images/creditsubmit/blackLeftArrow.svg"><text>选择审批人员</text></view>
        <view class="person-infor">
          <view class="person-infor-one" v-for="(person,index) in userList" :key="index" @click="choosePersonInfor(person.userName,person.userID)">
            <img class="choose-arrow" src="@/static/images/firstroom/formChooseArrow.svg" />
            <text>{{person.userName}}</text>
            <text style="color: #c7c9cd;margin-right:63rpx;"></text>
          </view>
        </view>
      </view>

      <!--选择节点-->
      <view class="submit choose-node" v-show="ifChooseNode">
        <view class="frame-title"><img @click="backSubmit" class="close" src="@/static/images/creditsubmit/blackLeftArrow.svg"><text>选择节点</text></view>
        <view class="person-infor">
          <view class="person-infor-one" v-for="(node,index) in phaseList" :key="index" @click="chooseNodeInfor(node.phaseName,node.phaseNo)">
            <img class="choose-arrow" src="@/static/images/firstroom/formChooseArrow.svg" />
            <text>{{node.phaseName}}</text>
            <text style="color: #c7c9cd;margin-right:63rpx;"></text>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>
<script>
import { mapActions, mapGetters, mapMutations } from "vuex";
export default {
  data: function() {
    return {
      identity: "提交中", //检测结果
      processNumber: 88, //检测进度
      phaseList: {}, //节点列表
      userList: {}, //审批人员列表
      phaseNo: "", //节点ID
      phaseName: "请选择", //节点名字
      userID: "", //审批人员ID
      userName: "请选择", //审批人员名字
      imglist: [],
      orderNoVal: "", //订单编号
      applyNoVal: "", //申请编号,
      completCheckList:[],//提示列表

      ifCheckProgressing: true, //头部正在进行中是否显示
      ifCheckPass: false, //头部通过是否显示
      ifCheckNoPass: false, //头部未通过是否显示
      ifCreditSubmitFrame: false, //提交弹框是否显示
      ifChooseNode: false, //提交节点是否显示
      ifChoosePerson: false, //提交审批人员是否显示
      ifSubmitInfor: false, //提交表单是否显示

      ifRInopass:true,//检查结果 信息完整度
      ifRFnopass:true,//检查结果 风险规则
      ifshowFrameButton:false,
      isRefused:"",//风险结果判断参数
    };
  },
  computed: {
    options() {
      return {
        radius: 50,
        text: function(value) {
          return (
            this.htmlifyNumber(value) +
            '<text style="font-size: 30px;">%</text><br><text style="font-size: 12px;">已完成</text>'
          );
        },
        textColor: "#ffffff"
      };
    },
    ...mapGetters(["queryApplyInfoList", "approvalIngList"]),
    ...mapGetters(['userInfor'])
  },
  onLoad: function(options) {
    let _this = this;
    _this.applyNoVal = _this.approvalIngList.serialNo; //申请编号获取
    /* 申请风险智能探测 start*/
    let fdata = {
      orderNo: "",
      applyNo: _this.applyNoVal,
      isQuery:'2',//20210115新加字段
    };
    _this.interfaceRequest(
      "/api/lendriskintelligencecheck/applyriskintelligencecheck",
      fdata,
      "GET",
      function(res) {
        if(res.data.data.returnCode==="Success"){
          _this.isRefused=res.data.data.isRefused;
          let scenarioList=res.data.data.scenarioList;
          let completCheckList=res.data.data.completCheckList;
          //let isRefused=res.data.data.isRefused;
          if(_this.isRefused == "2" && completCheckList.length == 0 && scenarioList.length == 0){
            //通过
            _this.ifCheckProgressing=false;
            _this.ifCheckPass=true;
            _this.ifCheckNoPass=false;
          }else{
            _this.ifCheckProgressing=false;
            _this.ifCheckPass=false;
            _this.ifCheckNoPass=true;
          }
          /* if(scenarioList !==undefined && scenarioList.length > 0){
            //风险未通过
            _this.ifRFnopass=false;
          } */
          if(_this.isRefused == "1" || _this.isRefused == ""){
            //风险未通过
            _this.ifRFnopass=false;
            //风险评估失败  被否决  该申请被销毁了
            let userID = _this.userInfor.loginCode;
            let orgID=_this.userInfor.orgId;
            let data = {
              "userID": userID, //客户经理编号
              "orgID": orgID, //客户经理所属机构编号
            };
            _this.businessNumCommit(data);
          }
          if(completCheckList !==undefined && completCheckList.length > 0){
            //完整性未通过
            _this.ifRInopass=false;
          }
          _this.completCheckList=completCheckList.concat(scenarioList);
        }else{
          let titletext=res.data.data.returnDesc;
          yu.showToast({
            icon: "none",
            title: titletext,
            duration: 3000
          });
        }
      },
      function(err) {}
    );
    /* 申请风险智能探测 end*/
    /* 授信流程提交查询 start*/
    let sdata = {
      orderNo: "",
      applyNo: _this.applyNoVal
    };
    _this.interfaceRequest(
      "/api/credit/queryCreditApplySubmit",
      sdata,
      "GET",
      function(res) {
        _this.phaseList = res.data.data.phaseList;
        _this.userList = res.data.data.userList;
      },
      function(err) {}
    );
    /* 授信流程提交查询 end*/
  },
  methods: {
    
    ...mapActions(["businessNumCommit"]),
    //返回上一页
    navigateBack() {
      uni.showModal({
          title: '确定退出？',
          content: '下次提交需重新执行风险探测',
          success: function (res) {
            if (res.confirm) {
              uni.navigateBack();
            } else if (res.cancel) {
              console.log('用户点击取消');
            }
          }
        });
    },
    submitInfor() {
      let that = this;
      if (that.phaseNo == "") {
        yu.showToast({
          icon: "none",
          title: "节点不能为空",
          duration: 2000
        });
        return;
      }
      if (that.userID == "") {
        yu.showToast({
          icon: "none",
          title: "审批人员不能为空",
          duration: 2000
        });
        return;
      }
      /* 授信流程提交 start*/
      let sdata = {
        orderNo: "",
        applyNo: that.applyNoVal,
        phaseNo: that.phaseNo,
        userID: that.userID
      };
      that.interfaceRequest(
        "/api/credit/submitCreditApply",
        sdata,
        "GET",
        function(res) {
          if(res.data.data.returnCode == 'Failed'){
            yu.showToast({
              title: res.data.data.returnDesc,
              icon: 'none',
              duration: 3000
            });
            return;
          }
          that.loaninvestigation(that.applyNoVal);
          let userID = that.userInfor.loginCode;
          let orgID=that.userInfor.orgId;
          let data = {
            "userID": userID, //客户经理编号
            "orgID": orgID, //客户经理所属机构编号
          };
          that.businessNumCommit(data);
          that.ifSubmitInfor=false;

          setTimeout(() => {
              yu.switchTab({ url: "/pages/ebank/index/index" });
          }, 1500);
        },
        function(err) {}
      );
      /* 授信流程提交 end*/
    },
    //廊坊银行个人住房/商用房贷款调查表
    /* loaninvestigation(applyNo){
      let _this=this;
      let data = {
        "orderNo": "", //订单编号
        "applyNo": applyNo, //申请编号
      };
      _this.interfaceRequest('/api/loaninvestigation/loaninvestigation',data,"GET",function(res){})
    }, */
    nextStep() {
      //$(".credit-submit-frame").show();
      this.ifCreditSubmitFrame=true;
      this.ifSubmitInfor=true;
    },
    closeSubmit() {
      //$(".credit-submit-frame").hide();
      this.ifCreditSubmitFrame=false;
      this.ifSubmitInfor=false;
    },
    chooseNode() {
      //$(".choose-node").show();
      this.ifChooseNode=true;
      //$(".choose-person").hide();;
      this.ifChoosePerson=false;
      //$(".submit-infor").hide();
      this.ifSubmitInfor=false;
    },
    chooseNodeInfor(name, id) {
      let _this = this;
      _this.phaseName = name;
      _this.phaseNo = id;
      _this.backSubmit();
      if (_this.userID != "" && _this.phaseNo != "") {
        //$(".frame-button").removeClass("noactive");
        _this.ifshowFrameButton=true;
      }
    },
    choosePerson() {
      this.ifChooseNode=false;
      this.ifChoosePerson=true;
      this.ifSubmitInfor=false;

    },
    choosePersonInfor(name, id) {
      let _this = this;
      _this.userName = name;
      _this.userID = id;
      _this.backSubmit();
      if (_this.userID != "" && _this.phaseNo != "") {
        //$(".frame-button").removeClass("noactive");
        _this.ifshowFrameButton=true;
      }
    },
    backSubmit() {
      this.ifChooseNode=false;
      this.ifChoosePerson=false;
      this.ifSubmitInfor=true;
    },
    //跳转到一手房
    toPerfectInformation(){
      let _this=this;
      if(_this.isRefused === "1" || _this.isRefused === ""){
        yu.switchTab({ url: "/pages/ebank/index/index" });
      }else{
        yu.redirectTo({ url: '/pages/ebank/perfectInformation/perfectInformation' });
      }
    }
  },
  watch: {},
  mounted() {}
};
</script>
<style lang="scss" scoped>
.credit-submit {
  width: 100%;
  height: 1334rpx;
  background: #f6f8f9;
  .credit-submit-con {
    width: 100%;
    position: relative;
    z-index: 0;
    background: #f6f8f9;
  }
  .credit-submit-con::after {
    content: "";
    width: 120%;
    height: 470rpx;
    position: absolute;
    left: -10%; /* //椭圆左边隐藏10%，右边隐藏10% */
    top: 0;
    border-radius: 0 0 30% 30%; /* //左上角，右上角，右下角，左下角 */
    background: linear-gradient(180deg, #3875f6 0%, #3b96f7 470rpx);
    z-index: 1;
  }
  .credit-submit-progress {
    width: 630rpx;
    height: 790rpx;
    background: #ffffff;
    border-radius: 20rpx;
    margin: 0 auto;
    position: relative;
    padding: 71rpx 30rpx 56rpx 30rpx;
    z-index: 5;
    .con-title {
      height: 50rpx;
      font-size: 36rpx;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: 500;
      color: #333435;
      line-height: 50rpx;
      text-indent: 10rpx;
      margin-bottom: 34rpx;
    }
    .con-infor {
      width: 630rpx;
      height: 105rpx;
      line-height: 105rpx;
      font-size: 32rpx;
      color: #333435;
      border-bottom: 1rpx solid #e5e5e5;
      text-indent: 10rpx;
      display: block;
      position: relative;
      img {
        width: 44rpx;
        position: absolute;
        right: 0;
        top: 50%;
        margin-right: 0;
      }
      .pass {
        width: 44rpx;
        height: 30rpx;
        margin-top: -15rpx;
      }
      .process {
        width: 40rpx;
        height: 40rpx;
        margin-top: -20rpx;
      }
      .nopass {
        width: 30rpx;
        height: 30rpx;
        margin-top: -15rpx;
      }
      .prompt {
        width: 11rpx;
        height: 36rpx;
        margin-top: -18rpx;
      }
    }
    .con-infor.processing {
      color: #3b86f7;
    }
    .con-tips {
      margin: 40rpx 13rpx;
      display: block;
      height: auto;
      .pass-tips {
        font-size: 24rpx;
        min-height: 282rpx;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #e89f73;
        line-height: 36rpx;
        text {
          margin-bottom: 10rpx;
          display: block;
        }
      }
      .blacklist-tips {
        font-size: 24rpx;
        min-height: 282rpx;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #e75e58;
        line-height: 36rpx;
        text {
          margin-bottom: 10rpx;
          display: block;
        }
      }
    }
    .credit-submit-foot {
      width: 100%;
      height: 80rpx;
      text-align: center;
      display: none;
      text {
        height: 40rpx;
        line-height: 40rpx;
        font-size: 24rpx;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #999999;
        display: block;
      }
    }
  }
}
.progress-tips {
  padding: 152rpx 0 20rpx 0;
  height: auto;
  min-height: 200rpx;
  text-align: center;
  display: flex;
  vertical-align: middle;
  align-items: center;
  justify-content: center;
  position: relative;
  z-index: 5;

  .tips-img {
    width: 112rpx;
    height: 112rpx;
    display: block;
    margin: 0 auto;
  }
  .tips-con {
    height: 45rpx;
    font-size: 32rpx;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 500;
    color: #ffffff;
    line-height: 45rpx;
    margin: 11rpx auto 5rpx auto;
    display: block;
  }
  .tips-tip {
    height: 33rpx;
    font-size: 24rpx;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #9cc4fd;
    line-height: 33rpx;
    display: block;
  }
}
.progress-tips.hasresult {
  display: block;
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
  background: transparent;
  display: flex;
  vertical-align: middle;
  align-items: center;
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
    color: #ffffff;
  }
}

.cbutton {
  width: 620rpx;
  padding: 0;
  margin: 67rpx auto 0 auto;
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

.credit-submit-frame {
  width: 750rpx;
  height: 1334rpx;
  background: rgba(0, 0, 0, 0.65);
  position: fixed;
  z-index: 100;
  display: block;
  left: 0;
  top: 0;
  .submit {
    width: 750rpx;
    height: 648rpx;
    background: #ffffff;
    border-radius: 20rpx 20rpx 0rpx 0rpx;
    position: absolute;
    left: 0;
    bottom: 0;
  }
  .frame-title {
    width: 750rpx;
    height: 50rpx;
    line-height: 50rpx;
    position: relative;
    text-align: center;
    font-size: 36rpx;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 500;
    color: #333333;
    margin-top: 38rpx;
    text {
      height: 50rpx;
      line-height: 50rpx;
    }
    img {
      position: absolute;
      left: 34rpx;
      top: 3rpx;
    }
    img.close {
      width: 44rpx;
      height: 44rpx;
    }
  }
}

.person-infor {
  margin-top: 24rpx;
  background: #ffffff;
  padding-left: 30rpx;
  .person-infor-one {
    height: 105rpx;
    line-height: 105rpx;
    border-bottom: 1rpx solid #e5e5e5;
    padding-left: 10rpx;
    position: relative;
    text {
      float: left;
      color: #333333;
      font-size: 32rpx;
    }
    text:last-child {
      float: right;
      color: #999999;
      margin-right: 40rpx;
    }
    .choose-arrow {
      width: 15rpx;
      height: 26rpx;
      position: absolute;
      top: 50%;
      right: 32rpx;
      margin-top: -13rpx;
      margin-right: -7.5rpx;
    }
  }
}
.frame-button {
  margin-top: 154rpx;
}
.frame-button.noactive {
  background: #bfddfc;
  box-shadow: 0rpx 10rpx 23rpx 0rpx rgba(59, 134, 247, 0.24);
}

.credit-submit-frame::after {
  display: block;
  content: "";
  clear: both;
}
</style>

