<template>
  <view class="uni-container">
    <view :class="phoneSystem ? 'pf-title pf-title-ios pf-titleTwo pf-titleTwo-ios':'pf-title pf-titleTwo'">
      <img src="@/static/images/creditsubmit/wBackArrow.svg" @click="backpf">
      <text>提交中</text>
    </view>
    <view class="pf-content pSubmit-content">
      <view class="pSubmit-top">
        <svg-bar class="top-svgBar" :value="svgbarNum" :options="svgOptions" v-if="submitIng"></svg-bar>
        <view v-if="submitSuccess">
          <img src="@/static/images/creditsubmit/corret.svg">
          <view>通过</view>
          <view class="top-color">风险探测结果</view>
        </view>
        <view v-if="submitError">
          <img src="@/static/images/creditsubmit/error.svg">
          <view>风险探测不通过，暂时无法提交</view>
          <view class="top-color">请根据提示信息检查申请内容！</view>
        </view>
       
      </view>
      <view class="pSubmit-center">
        <view class="center-ing">
          <view class="center-title">{{submitIng ? '检查各项' : '检查结果'}}</view>
          <view class="center-plan"><text>信息完整性检查</text><img src="@/static/images/creditsubmit/pass.svg"></view>
          <view class="center-plan center-planIng">
            <text>风控规则检查</text>
            <img src="@/static/images/creditsubmit/processing.svg" v-if="submitIng">
            <!-- <img src="@/static/images/creditsubmit/prompt.svg" v-if="submitSuccess">-->
            <img src="@/static/images/creditsubmit/pass.svg" v-if="submitSuccess">
            <img src="@/static/images/creditsubmit/nopass.svg" v-if="submitError">
          </view>
        </view>
        <view class="center-result">
          <view v-for="(item,index) in riskMonitoring" :key="index">{{item.errorMessage}}</view>
        </view>
        <view class="center-buttom">
          <view v-if="submitIng">正在执行风险探测，请稍候… <br/>请勿退出此页面，否则风险探测会中止</view>
          <view :class="phoneSystem ? 'contract-button':'contract-button contract-button-an'" v-if="submitSuccess">
            <button type="primary" @click="nextAjax">下一步</button>
          </view>
          <view :class="phoneSystem ? 'contract-button':'contract-button contract-button-an'" v-if="submitError">
            <button type="primary" @click="knowAjax">我知道了</button>
          </view>
        </view>
      </view>
    </view>
    <view class="pSubmit-cover" v-if="coverAll">
      <view class="cover-submit" v-if="phaseNoUserID">
        <view class="cover-title">
          <img src="@/static/images/creditsubmit/blackClose.svg" @click="backCoverAll">
          <text>提交</text>
        </view>
        <view class="contract-ul">
          <view class="contract-li">
            <view>审批节点</view>
            <view @click="phaseNoClick">
              <input class="uni-input" placeholder="请选择" disabled v-model="phaseNoVal"/> 
              <img src="@/static/images/perfectInformation/formChooseArrow.svg">
            </view>
          </view>
          <view class="contract-li">
            <view>审批人员</view>
            <view @click="userIDClick">
              <input class="uni-input" placeholder="请选择" disabled v-model="userIDVal"/> 
              <img src="@/static/images/perfectInformation/formChooseArrow.svg">
            </view>
          </view>
        </view>
        <view :class="phoneSystem ? 'contract-button':'contract-button contract-button-an'">
          <button type="primary" @click="submitLendApply">确认提交</button>
        </view>
      </view>
      <view class="cover-submit" v-if="userIDShow">
        <view class="cover-title">
          <img src="@/static/images/creditsubmit/blackLeftArrow.svg" @click="backPhaseNoUserID">
          <text>选择审批人员</text>
        </view>
        <view class="contract-ul">
          <view class="contract-li" v-for="(item,index) in userIDList" :key="item.userID" @click="userIDImgClick(item,index)">
            <view>{{item.userName}}</view>
            <view>
              <img src="@/static/images/firstroom/checkMark.svg" v-if="item.imgShow">
            </view>
          </view>
         </view>
      </view>
      <view class="cover-submit" v-if="phaseNoShow">
        <view class="cover-title">
          <img src="@/static/images/creditsubmit/blackLeftArrow.svg" @click="backPhaseNoUserID">
          <text>选择节点</text>
        </view>
        <view class="contract-ul">
          <view class="contract-li" v-for="(item,index) in phaseNoList" :key="item.phaseNo" @click="phaseNoImgClick(item,index)">
            <view>{{item.phaseName}}</view>
            <view >
              <img src="@/static/images/firstroom/checkMark.svg" v-if="item.imgShow">
            </view>
          </view>
         </view>
      </view>
    </view>
  </view>
</template>

<script>
  import {mapGetters, mapActions} from 'vuex';
  import filter from '@/utils/filters';
  export default {
    components: {},
    data() {
      return {
        submitIng: true,
        submitSuccess: false,
        submitError: false,
        coverAll:false,  //底部框
        svgbarNum: 0,
        riskMonitoring: [],  //风险监测结果
        phaseNoUserID: true,
        userIDList: [],
        userIDVal: '',
        userIDNumVal: '',
        userIDShow: false,
        phaseNoList: [],
        phaseNoVal: '',
        phaseNoNumVal: '',
        phaseNoShow: false,
        orderNoVal: '',  //订单编号
        putoutNoVal: '',  //放款编号
        clearTime: '',  //定时器
        userID: '',
        orgId: '',
        
      };
    },
    watch:{},
    onLoad(options) {
      this.svgbarNumCom();
    },
    onReady() {},
    onShareAppMessage() {},
    computed:{
      ...mapGetters(['paymentList','userInfor']),
      svgOptions() {
        return {
          textColor: "#ffffff",
          radius: 50,//大小
					duration: 2,//变化时间长度
					circleWidth: 5,//圆环宽度
					circleLineCap: 'round',//进度条 形状  圆环 或者矩形
					text: function(value) {
						return (
              this.htmlifyNumber(value) +
              '<text style="font-size:30px;">%</text><br><text style="font-size: 12px; opacity:0.5;">已完成</text>'
            );
					},
        };
      },
      svgbarNumCom(){
        this.clearTime = setInterval(()=>{
          this.svgbarNum += 10;
          console.log(this.svgbarNum)
          if(this.svgbarNum == 90){
            clearInterval(this.clearTime)
          }
        },1000);
      }
      
    },
    created(){
      this.orderNoVal = this.paymentList.orderNo;
      this.putoutNoVal = this.paymentList.putoutNo;
      this.lendriskintelligencecheck();
      this.userID = this.userInfor.loginCode;
      this.orgId =  this.userInfor.orgId;
    },
    methods: {
      ...mapActions(["businessNumCommit"]),
      //放款风险智能探测
      lendriskintelligencecheck(){
        let data = {
          'orderNo': this.orderNoVal,  //订单编号
          'putoutNo': this.putoutNoVal,  //放款编号
        }
        this.interfaceRequest('/api/lendriskintelligencecheck/lendriskintelligencecheck',data,"get",(res)=>{
          console.log(res)
          clearInterval(this.clearTime);
          this.svgbarNum = 0;
          let list = res.data.data.scenarioList;
          this.submitIng = false;
          if(res.data.data.returnCode == 'Failed'){
            this.riskMonitoring.push({
              'errorMessage': res.data.data.returnDesc
            });
            this.submitSuccess = false;
            this.submitError = true;
            return false;
          }
          if(list && list.length > 0){
            this.riskMonitoring = list;
            this.submitSuccess = false;
            this.submitError = true;
            
          }else{
            this.riskMonitoring = [];
            this.submitSuccess = true;
            this.submitError = false;
          }
          console.log('放款风险智能探测成功结果')
          
        },(err)=>{
            yu.showToast({
              title: '5.11智能检测失败，请联系管理员！',
              icon: 'none',
              duration: 3000
            });
        });
      },
      //放款流程提交查询
      queryLendApplySubmit(){
        let data = {
          'orderNo': this.orderNoVal,  //订单编号
          'putoutNo': this.putoutNoVal,  //放款编号
        }
        yu.showLoading();
        this.interfaceRequest('/api/lend/queryLendApplySubmit',data,"get",(res)=>{
          console.log(res)
          console.log('放款流程提交查询成功结果')
          yu.hideLoading();
          if(res.data.data.returnCode == 'Failed'){
            yu.showToast({
              title: res.data.data.returnDesc,
              icon: 'none',
              duration: 3000
            });
            return;
          }
          let arr = res.data.data.userList;
          arr.forEach((item)=>{
            item.imgShow = false;
          })
          let arr2 = res.data.data.phaseList;
          arr2.forEach((item)=>{
            item.imgShow = false;
          })
          this.userIDList = arr;
          this.phaseNoList = arr2;
        },(err)=>{
          yu.hideLoading();
          yu.showToast({
            title: '5.7流程提交失败，请联系管理员！',
            icon: 'none',
            duration: 3000
          });
        });
      },
      //放款流程提交
      submitLendApply(){
        let data = {
          'orderNo': this.orderNoVal,  //订单编号
          'putoutNo': this.putoutNoVal,  //放款编号
          'phaseNo': this.phaseNoNumVal,  //节点编号
          'userID': this.userIDNumVal,  //审批人编号
        }
        yu.showLoading();
        this.interfaceRequest('/api/lend/submitLendApply',data,"get",(res)=>{
          console.log(res)
          console.log('放款流程提交成功结果');
          yu.hideLoading();
          if(res.data.data.returnCode == 'Failed'){
            this.coverAll = false;
            yu.showToast({
              title: res.data.data.returnDesc,
              icon: 'none',
              duration: 3000
            });
            return;
          }
          this.businessNumCommit({
            "userID": this.userID, //客户经理编号
            "orgID": this.orgId, //客户经理所属机构编号
          });
          setTimeout(() => {
            yu.navigateTo({
              url: 'payment?applyPhase=01',
            });
          }, 1500);
          
        },(err)=>{
          yu.hideLoading();
          yu.showToast({
            title: '5.8流程提交失败，请联系管理员！',
            icon: 'none',
            duration: 3000
          });
        });
      },
      //下一步
      nextAjax(){
        this.coverAll = true;
        this.queryLendApplySubmit();
      },
      backCoverAll(){
        this.coverAll = false;
        this.backPhaseNoUserID();
      },
      //我知道了
      knowAjax(){
        setTimeout(() => {
          yu.navigateTo({
            url: 'payment?applyPhase=01',
          });
        }, 1500);
      },
      //审批节点选择
      phaseNoClick(){
        this.phaseNoUserID = false;
        this.userIDShow = false;
        this.phaseNoShow = true;
      },
      //审批人员选择
      userIDClick(){
        this.phaseNoUserID = false;
        this.userIDShow = true;
        this.phaseNoShow = false;
      },
      phaseNoImgClick(e,index){
        console.log(e)
        this.phaseNoList.forEach((item)=>{
          item.imgShow = false;
        });
        this.phaseNoList[index].imgShow = true;
        this.phaseNoVal = e.phaseName;
        this.phaseNoNumVal = e.phaseNo;
        this.backPhaseNoUserID();
      },
      userIDImgClick(e,index){
        this.userIDList.forEach((item)=>{
          item.imgShow = false;
        });
        this.userIDList[index].imgShow = true;
        this.userIDVal = e.userName;
        this.userIDNumVal = e.userID;
        this.backPhaseNoUserID();
      },
      //返回提交
      backPhaseNoUserID(){
        this.phaseNoUserID = true;
        this.userIDShow = false;
        this.phaseNoShow = false;
      },
      //返回
      backpf(){
        yu.showModal({
          title: '确定退出？',
          content: '下次提交需重新执行风险探测',
          // showCancel: false,
          // cancelText: "我知道了",
          success: function (res) {
            if (res.confirm) {
              console.log('用户点击确定');
              yu.navigateBack();
            }
          }
        });
      },
    }
  };
</script>

<style lang='scss'>
  @import '~@styles/uni-nvue.css';
  .uni-container{
    background-color: #FFFFFF;
    padding: 30rpx 0 0;
    .pf-title{
      background-color: #3875F6;
      color: #FFFFFF;
    }
    .pSubmit-content{
      padding-top: 56rpx;
      .pSubmit-top{
        height: 342rpx;
        background: linear-gradient(180deg, #3875F6 0%, #3B96F7 100%);
        border-radius: 0 0 10% 10%;
        text-align: center;
        color: #FFFFFF;
        font-size: 32rpx;
        .top-svgBar{
          text-align: center;
          padding-top: 30rpx;
        }
        img{
          width: 112rpx;
          padding-top: 26rpx;
        }
        .top-color{
          color: #9CC4FD;
          font-size: 24rpx;
        }
      }
      .pSubmit-center{
        position: relative;
        top: -60rpx;
        margin: 0 30rpx;
        // height: 918rpx;
        height: 878rpx;
        background: #FFFFFF;
        border-radius: 20rpx;
        border: 1px solid #ccc;
        padding: 0 30rpx;
        .center-ing{
          .center-title{
            font-size: 36rpx;
            color: #333435;
            padding: 34rpx 10rpx;
            margin-top: 36rpx;
            font-weight: 500;
          }
          .center-plan{
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 30rpx 10rpx;
            border-bottom: 2rpx solid #E5E5E5;
            img{
              width: 44rpx;
              height: 44rpx;
            }
          }
          .center-planIng{
            color: #3B86F7;
          }
        }
        .center-result{
          padding: 30rpx 10rpx;
          color: #E75E58;
        }
        .center-buttom{
          color: #999999;
          position: absolute;
          left: 0;
          right: 0;
          bottom: 56rpx;
          text-align: center;
        }
      }
    }
    .pSubmit-cover{
      height: 100%;
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: rgba(0, 0, 0, 0.65);
      z-index: 10000;
      .cover-submit{
        width: 100%;
        height: 648rpx;
        background: #FFFFFF;
        border-radius: 20rpx 20rpx 0 0;
        position: absolute;
        bottom: 0;
        .cover-title{
          height: 60rpx;
          line-height: 60rpx;
          text-align: center;
          font-size: 36rpx;
          color: #333333;
          padding: 38rpx 30rpx;
          font-weight: 500;
          display: flex;
          justify-content: center;
          align-items: center;
          img{
            width: 20rpx;
            position: absolute;
            left: 40rpx;
          }
        }
        .contract-ul{
          .contract-li{
            uni-view:last-of-type{
              color: #333435;
            }
          }
          .contract-li:last-of-type{
            border-bottom: 2rpx solid #E5E5E5;
          }
        }
        .contract-button{
          margin-top:60rpx;
        } 
      }
    }
  }
</style>
