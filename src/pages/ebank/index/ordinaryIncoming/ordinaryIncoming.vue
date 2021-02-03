<template>
  <view class="incoming">
    <view :class="phoneSystem ? 'pf-title pf-title-ios pf-titleTwo pf-titleTwo-ios':'pf-title pf-titleTwo'">
      <img src="@/static/images/firstroom/backArrow.svg" @click="navigateBack">
      <text>{{title}}</text>
    </view>
    <view class="customize-content-form">
      <!--影像信息-start-->
      <view class="image-information">
        <view class="title" >影像信息</view>
        <view class="idcard-box">
          <view class="idcard-positive" >
            <img class="idcard-img" :src="imgPath_zheng">
            <view class="idcard-camera" @click="startOCR(1)"><img src="@/static/images/firstroom/camera.svg"></view>
          </view>
          <view class="idcard-infor"><text>人像面</text></view>
        </view>
        <view class="idcard-box">
          <view class="idcard-negative">
            <img class="idcard-img" :src="imgPath_fan">
            <view class="idcard-camera" @click="startOCR(0)"><img src="@/static/images/firstroom/camera.svg"></view>
          </view>
          <view class="idcard-infor"><text>国徽面</text></view>
        </view>
      </view>
      <!--影像信息-end-->
      <!--个人信息-start-->
      <view class="contract-ul">
        <view class="contract-li">
          <view>姓名</view>
          <view>
            <input class="uni-input" placeholder="请输入姓名" type="text" v-model.trim="personInfor.name" :value="personInfor.name"/>
            <!--<text class="imgCross" v-show="residenceAddFocus" @click="imgCrossClick('residenceAdd')">
              <img src="@/static/images/perfectInformation/cross.svg">
            </text>-->
          </view>
        </view>
        <view class="contract-li">
          <view>身份证号</view>
          <view>
            <text>{{personInfor.idcard}}</text>
          </view>
        </view>
      </view>
      <view class="contract-ul">
        <view class="contract-li">
          <view>手机号</view>
          <view>
            <input class="uni-input" placeholder="请输入手机号码" type="number" v-model.trim="personInfor.phone" />
          </view>
        </view>
        <view class="contract-li product-picker">
          <view>意向产品</view>
          <view>
            <picker :value="productIndex" :range-key="'businessTypeName'" :range="productList" @change="bindPickerChange">
              {{ productList[productIndex].businessTypeName }}
            </picker>
            <img src="@/static/images/firstroom/formChooseArrow.svg" />
          </view>
        </view>
        <view class="contract-li" v-if="ifShowRealEstate" @click="pageJumpTosearch">
          <view>楼盘名称</view>
          <view>
            <text v-if="buildingNo != '' && buildingNo != undefined && buildingNo != null" style="color: #333435;margin-right:63rpx;">{{buildingName}}</text>
            <text v-else style="color: #c7c9cd;margin-right:63rpx;">请选择</text>
          </view>
        </view>
      </view>
      <!--个人信息-end-->
      <view class="" @click="uploadImg">
        <view class="cbutton">
          <text>下一步</text>
        </view>
      </view>
    </view>
  </view>
</template>
<script>
import { mapActions, mapGetters, mapMutations } from "vuex";
import globalMethod from "@/static/js/globalmethods";
export default {
  data() {
    return {
      title: "",
      fromProduct: "",
      navigateFlag: false,
      productIndex: 0,
      productId: "",
      productName: "",
      buildingNo: "",
      buildingName: "",
      ifSearchResult: false,
      searchlist: "index/searchRealEstate/searchRealEstate",
      incomingSuccess: "index/incomingSuccess/incomingSuccess",
      personInfor: {
        name: "",
        idcard: "",
        phone: "",
        intendedProduct: "",
        propertyName: ""
      },
      productList: [],
      imgPath_zheng: "./static/images/firstroom/idcardPositive.svg", //身份证正面图片路径
      imgPath_zheng_base64: "",
      imgPath_fan: "./static/images/firstroom/idcardNegative.svg", //身份证反面图片路径
      imgPath_fan_base64: "",
      imgBatchNumber: "20201221", //上传图片版本批次号
      imgFirstUploadTime: "20201221", //首次上传时间
      uploadImageInVoList: [], //图片集合
      avatarPath: "",
      idShotsPath: "",
      ocrresult: "",
      ifShowRealEstate: true,
      preventResubmit: true //防重复提交
    };
  },
  onLoad: function(options) {
    this.title = this.approvalIngList.fromProductTitle;
    localStorage.setItem("pagetitles", this.title);
    this.productId = this.approvalIngList.fromProductId;
    this.productName = this.approvalIngList.fromProductName;
    this.fromProduct = options.from;
    if (this.productId == "1140020" || this.productId == "1140120") {
      this.ifShowRealEstate = false;
    }
    //获取身份证信息start
    //let ordinary = this.approvalIngList.ordinary;
    //if(ordinary != null && ordinary != undefined){
    this.title = localStorage.getItem("pagetitles");
    this.personInfor.name = localStorage.getItem("personnames");
    this.personInfor.idcard = localStorage.getItem("personidcards");
    this.imgPath_zheng = localStorage.getItem("imgPath_zheng");
    this.imgPath_zheng_base64 = localStorage.getItem("imgPath_zheng_base64");
    this.imgPath_fan = localStorage.getItem("imgPath_fan");
    this.imgPath_fan_base64 = localStorage.getItem("imgPath_fan_base64");
    //}
    //获取身份证信息end
    /***获取用户ID，部门ID */
    /**产品列表 **start****/
    let pdata = { dictionaryName: "businessType" };
    let bt= this.productId;
    let firstdata=[];
		let seconddata=[];
    this.queryDictionaryList(pdata, (res)=> {
      let products = res.data.data;
      for (let key in products) {
        if(key == "1140020" || key == "1140120"){//二手房
          seconddata.push({
            businessType:key,
            businessTypeName:products[key]
          })
        }else{//一手房
          firstdata.push({
            businessType:key,
            businessTypeName:products[key]
          })
        }
      }
    });
    if(bt == "1140020" || bt == "1140120"){//二手房
      this.productList=seconddata;
    }else{//一手房
      this.productList=firstdata;
    }
    /**产品列表 **end****/
    /**获取搜索结果**/
    let opboolean = JSON.stringify(options) == "{}";
    if (!opboolean) {
      this.buildingNo =
        options.projectId === undefined ? "" : options.projectId; //楼盘ID
      this.buildingName =
        options.projectName === undefined ? "" : options.projectName; //楼盘名称
      this.productId =
        options.productId === undefined ? this.productId : options.productId; //
      this.productIndex =
        options.productIndex === undefined
          ? this.productIndex
          : options.productIndex; //
      this.productName =
        options.productName === undefined
          ? this.productName
          : options.productName;
      this.personInfor.phone = options.phone === undefined ? "" : options.phone; //电话号
      this.personInfor.name =
        options.personName === undefined ? "" : options.personName; //用户名
      this.personInfor.idcard =
        options.personIDcard === undefined ? "" : options.personIDcard; //用户身份证号
      if (this.buildingNo != "") {
        this.ifSearchResult = true;
      }
    }
  },
  created() {
    //获取身份证信息start
    let ordinary = this.approvalIngList.imgPath_zheng;
    if (ordinary != null && ordinary != undefined) {
      this.personInfor.name = this.approvalIngList.personnames;
      this.personInfor.idcard = this.approvalIngList.personidcards;
      this.imgPath_zheng = this.approvalIngList.imgPath_zheng;
      this.imgPath_zheng_base64 = this.approvalIngList.imgPath_zheng_base64;
      this.imgPath_fan = this.approvalIngList.imgPath_fan;
      this.imgPath_fan_base64 = this.approvalIngList.imgPath_fan_base64;
    }
    //获取身份证信息end

     /*  this.compressImages('./static/images/shuijiao.jpg',1,function(data){
        console.log(data);
      });  */
  },
  onShow() {},
  onUnload() {},
  computed: {
    ...mapGetters(["userInfor"]),
    ...mapGetters(["approvalIngList"])
  },
  methods: {
    ...mapActions(["businessNumCommit", "queryApplyInfoCommit"]),
    ...mapMutations(["approvalIngListReplace","personalInformationReplace"]),
    //返回上一页
    navigateBack() {
      this.clearorDinaryStorage();
      this.pageJump(
        "index/ordinaryQRcode/ordinaryQRcode?from=" + this.fromProduct
      );
    },
    //下拉列表
    bindPickerChange: function(e) {
      var thisIndex = e.detail.value;
      this.productId = this.productList[thisIndex].businessType;
      this.productIndex = thisIndex;
    },
    //拍照
    chooseImage() {
      uni.chooseImage({
        count: 6, //默认9
        sizeType: ["original", "compressed"], //可以指定是原图还是压缩图，默认二者都有
        sourceType: ["album", "camera"], //从相册选择、摄像头
        success: function(res) {
          console.log(JSON.stringify(res.tempFilePaths));
        }
      });
    },
    /* 跳转到搜索页面 */
    pageJumpTosearch() {
      let urlstr =
        "?phone=" +
        this.personInfor.phone +
        "&productIndex=" +
        this.productIndex +
        "&productId=" +
        this.productId +
        "&productName=" +
        this.productName +
        "&personName=" +
        this.personInfor.name +
        "&personIDcard=" +
        this.personInfor.idcard +
        "&from=" +
        this.fromProduct;
      let newurl = this.searchlist + urlstr;
      this.pageJump(newurl);
    },
    clearorDinaryStorage() {
      localStorage.removeItem("pagetitles");
      localStorage.removeItem("personnames");
      localStorage.removeItem("personidcards");
      localStorage.removeItem("imgPath_zheng");
      localStorage.removeItem("imgPath_zheng_base64");
      localStorage.removeItem("imgPath_fan");
      localStorage.removeItem("imgPath_fan_base64");
    },
    /**表单提交接口 **start****/
    submitform(imgBatchNumber, imgFirstUploadTime) {
      yu.showToast({
        icon: "none",
        title: "提交申请进行中",
        duration: 1500
      });
      yu.showLoading();
      let userId = this.userInfor.loginCode;
      let orgID = this.userInfor.orgId;
      let imglist = [
        {
          batchNo: imgBatchNumber,
          upLoadDate: imgFirstUploadTime
        }
      ];
      let formData = {
        orderNo: "",
        userId: userId,
        orgID: orgID,
        certType: "Ind01",
        certId: this.personInfor.idcard,
        customerName: this.personInfor.name,
        mobileTelephone: this.personInfor.phone,
        businessType: this.productId,
        imageList: imglist
      };
      if (this.ifShowRealEstate) {
        formData.projectNo = this.buildingNo;
      }
      let posturl = "/api/ordercreditapply/createcreditapply";
      this.interfaceRequest(
        posturl,
        formData,
        "post",
        res => {
          yu.hideLoading();
          this.preventResubmit = true;
          if (res.data.data.returnCode == "Success") {
            let result = res.data.data.applyNo;
            if (result != null) {
              let e = {
                orderNo: "",
                serialNo: result,
                fromProductTitle: this.title,
                fromProductId: this.productId,
                fromProductName: this.productName,
                imageList: {
                  imageBatchNo: imgBatchNumber,
                  upLoadDate: imgFirstUploadTime
                },
                businessType2: this.title,
                businessType: this.productId,
                
              };
              this.approvalIngListReplace(e);
              let datas = {
                userID: userId, //客户经理编号
                orgID: orgID //客户经理所属机构编号
              };
              this.businessNumCommit(datas);
              yu.showToast({
                icon: "none",
                title: "申请成功",
                duration: 1500
              });
              this.clearorDinaryStorage();
              this.queryApplyInfoCommit({
                orderNo: "",
                applyNo: result,
                routerTrue: true,
                routerTo: this.incomingSuccess,
                routerJumpWay: "pageJump"
              }); //重新调'申请信息查询'接口
              //this.uploadImg();
               this.personalInformationReplace({});
            }
          } else {
            yu.showToast({
              icon: "none",
              title: res.data.data.returnDesc
                ? res.data.data.returnDesc
                : "提交失败",
              duration: 1500
            });
          }
        },
        err => {
          yu.hideLoading();
          this.preventResubmit = true;
        }
      );
    },
    /**表单提交接口 **end****/
    getDate() {
      var date = new Date();
      var y = date.getFullYear();
      var m = date.getMonth() + 1;
      m = m < 10 ? "0" + m : m;
      var d = date.getDate();
      d = d < 10 ? "0" + d : d;
      return y + "/" + m + "/" + d;
    },
    //调用方法
    /* 上传影像平台获取批次号   start */
    uploadImg() {
      let _this=this;
      if (!_this.preventResubmit) {
        yu.showModal({
          content: "操作进行中，请稍等",
          showCancel: false,
          cancelText: "确定",
          success: function(res) {
            if (res.confirm) {
              console.log("用户点击确定");
            }
          }
        });
        return;
      }
      _this.preventResubmit = false;
      yu.showLoading();
      yu.showToast({
        icon: "none",
        title: "身份证图片上传中",
        duration: 1500
      });
      if (
        _this.imgPath_zheng_base64 === "" ||
        _this.imgPath_fan_base64 === ""
      ) {
        yu.showToast({
          icon: "none",
          title: "身份证图片不能为空",
          duration: 3000
        });
      }
      //压缩图片base64code大小  start
      let zhengcode='';
      let fancode='';
      let zhengbase64='data:image/jpeg;base64,' + _this.imgPath_zheng_base64;
      let fanbase64='data:image/jpeg;base64,' + _this.imgPath_fan_base64;
      _this.compressImages(zhengbase64,1,function(data){
        zhengcode=data;
      }); 
      _this.compressImages(fanbase64,1,function(res){
        fancode=res;
        let param = {
          busiFileTypeList: ["2012060101"],
          filePartName: "LS_SQZL_P",
          modelCode: "LS_SQZL",
          uploadImageInVoList: [
            {
              base64Code: zhengcode,
              frontBackFlag: "2",
              psnTp: "1",
              idNumber: _this.personInfor.idcard
            },
            {
              base64Code: fancode,
              frontBackFlag: "1",
              psnTp: "1",
              idNumber: _this.personInfor.idcard
            }
          ]
        };
        let posturl = "/api/imagehandle/uploadreturnnoanddate";
        _this.interfaceRequest(
          posturl,
          param,
          "post",
          (res)=> {
            yu.hideLoading();
            _this.preventResubmit = true;
            _this.imgBatchNumber = res.data.data.busiSerialNo; //res.data.data.batchId;
            _this.imgFirstUploadTime = res.data.data.busiStartDate; //this.getDate();
            let e = {
              fromProductTitle: _this.title,
              imageList: {
                imageBatchNo: _this.imgBatchNumber,
                upLoadDate: _this.imgFirstUploadTime
              },
              businessType2: _this.title,
              businessType: _this.productId,
            };
            _this.approvalIngListReplace(e);
            foxsdk.logger.info("img");
            foxsdk.logger.info(res.data.data + "&&&&&" + _this.getDate());
            foxsdk.logger.info(
              _this.imgBatchNumbe + "&&&&&" + _this.imgFirstUploadTime
            );
            _this.submitform(_this.imgBatchNumber, _this.imgFirstUploadTime);
          },
          (err)=> {
            yu.hideLoading();
            _this.preventResubmit = true;
            yu.showToast({
              icon: "none",
              title: "图片上传失败，返回首页",
              duration: 3000
            });
            setTimeout(function() {
              yu.switchTab({ url: "/pages/ebank/index/index" });
            }, 1500);
            //this.pageJump(this.incomingSuccess);
          }
        );
      }); 
      //压缩图片base64code大小  end
      
    },
    /* 上传影像平台获取批次号   end */
    /**身份证识别 */
    startOCR(type) {
      foxsdk.intsigocr.startOCR(type, ret => {
        // if(type==1){
        if (ret && ret.payload && ret.payload.Name) {
          foxsdk.logger.info(ret.payload);
          this.personInfor.name = ret.payload.Name;
          localStorage.setItem("personnames", ret.payload.Name);
          this.personInfor.idcard = ret.payload.IDCardNo;
          localStorage.setItem("personidcards", ret.payload.IDCardNo);
          foxsdk.io.convertLocalFileSystemURL(
            ret.payload.ImagePath,
            url => {
              this.imgPath_zheng = url;
              foxsdk.logger.info("路径转换"+url);
              localStorage.setItem("imgPath_zheng", url);
            },
            ret => {
              foxsdk.logger.info("路径转换失败");
            }
          );
          foxsdk.gallery.imageBase64(ret.payload.ImagePath, entry => {
            this.imgPath_zheng_base64 = entry.payload.imageBase64;
            localStorage.setItem(
              "imgPath_zheng_base64",
              entry.payload.imageBase64
            );

            /* let base64code = entry.payload.imageBase64;
            let base64='data:image/jpeg;base64,' + base64code;
            this.compressImages(base64,1,function(data){
              this.imgPath_zheng_base64=data;
              foxsdk.logger.info(this.imgPath_zheng_base64);
              localStorage.setItem( "imgPath_zheng_base64",data);
            }); */
          });

          let e = {
            personnames: ret.payload.Name,
            personidcards: ret.payload.IDCardNo,
            imgPath_zheng: this.imgPath_zheng,
            imgPath_zheng_base64: this.imgPath_zheng_base64,
            fromProductTitle: this.title,
            businessType2: this.title,
            businessType: this.productId,
          };
          this.approvalIngListReplace(e);
        } else {
          foxsdk.io.convertLocalFileSystemURL(
            ret.payload.ImagePath,
            url => {
              this.imgPath_fan = url;
              localStorage.setItem("imgPath_fan", url);
            },
            ret => {
              foxsdk.logger.info("路径转换失败");
            }
          );
          foxsdk.gallery.imageBase64(ret.payload.ImagePath, entry => {
            this.imgPath_fan_base64 = entry.payload.imageBase64;
            localStorage.setItem(
              "imgPath_fan_base64",
              entry.payload.imageBase64
            );
            /* let base64code = entry.payload.imageBase64;
            let base64='data:image/jpeg;base64,' + base64code;
            this.compressImages(base64,1,function(data){
              foxsdk.logger.info('##############################');
              foxsdk.logger.info(data);
              foxsdk.logger.info('################################');
              this.imgPath_fan_base64=data;
              localStorage.setItem( "imgPath_fan_base64",data);
            }); */
          });
         /*  this.compressImages(ret.payload.ImagePath,1,function(data){
            this.imgPath_fan_base64 = data;
            localStorage.setItem( "imgPath_fan_base64",data);
          }); */
          let e = {
            imgPath_fan: this.imgPath_fan,
            imgPath_fan_base64: this.imgPath_fan_base64,
            fromProductTitle: this.title,
            businessType2: this.title,
            businessType: this.productId,
          };
          this.approvalIngListReplace(e);
        }
      });
    }
  },
  mounted() {}
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
  .customize-content-form {
    background: #f6f8f9 !important;
    width: 100%;
    height: 100%;
    margin-top: 154rpx;
    .image-information {
      padding: 0 40rpx;
      height: 421rpx;
      background: #ffffff;
      margin-top: 24rpx;
      .title {
        height: 45rpx;
        line-height: 45rpx;
        font-size: 32rpx;
        color: #333333;
        padding-top: 26rpx;
      }

      .idcard-box {
        width: 310rpx;
        height: 264rpx;
        display: inline-block;
        margin-top: 48rpx;
        .idcard-positive {
          width: 310rpx;
          height: 210rpx;
          background: url("~@/static/images/firstroom/idcardPositive.svg")
            center top no-repeat;
          background-size: 310rpx 210rpx;
          position: relative;
        }
        .idcard-negative {
          width: 310rpx;
          height: 210rpx;
          position: relative;
          background: url("~@/static/images/firstroom/idcardNegative.svg")
            center top no-repeat;
          background-size: 310rpx 210rpx;
        }
        .idcard-img {
          width: 310rpx;
          height: 210rpx;
          position: absolute;
          left: 0;
          top: 0;
          z-index: 1;
        }
        .idcard-camera {
          width: 90rpx;
          height: 90rpx;
          text-align: center;
          position: absolute;
          left: 50%;
          top: 50%;
          margin-left: -45rpx;
          margin-top: -45rpx;
          z-index: 2;
          img {
            width: 90rpx;
            height: 90rpx;
          }
        }
        .idcard-infor {
          height: 37rpx;
          line-height: 37rpx;
          text-align: center;
          color: #333333;
          font-size: 26rpx;
          margin-top: 17rpx;
        }
      }
      .idcard-box:last-child {
        margin-left: 50rpx;
      }
    }
    .image-information:after {
      display: block;
      content: "";
      clear: both;
    }
    .contract-ul {
      margin-top: 24rpx;
      .contract-li {
        display: flex;
        justify-content: space-between;
        text-align: center;
        height: 50rpx;
        font-size: 32rpx;
        input.uni-input-input{
          color: #333435
        }
        input.uni-input-input[type=number]{
          color: #333435
        }
        uni-view:last-of-type {
          color: #333435;
        }

        .iptcontract {
          text-align: right;
        }

        .choose-arrow {
          width: 15rpx;
          height: 26rpx;
          position: absolute;
          top: 50%;
          right: 32rpx;
          margin-top: -30rpx;
          margin-right: -7.5rpx;
        }
      }
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
  margin: 41rpx auto 190rpx auto;
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
</style>
