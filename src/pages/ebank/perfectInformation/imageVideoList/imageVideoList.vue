<template>
  <view class="information-box">
    <view :class="phoneSystem ? 'pf-title pf-title-ios pf-titleTwo pf-titleTwo-ios':'pf-title pf-titleTwo'">
      <img src="@/static/images/firstroom/backArrow.svg" @click="navigateBack">
      <text>{{title}}</text>
    </view>
    <view class="pf-content image-list-con">
      <view class="image-information" v-for="(item,index) in imagelists" :key="index">
        <view class="title" v-if="item.busiFileTypeName != 'undefined'" ><text class="title-line"></text><text>{{item.busiFileTypeName}}</text></view>
        <view class="image-list">
          <view class="item after-upload" v-for="(imageOne,i) in item.downloadImageDtoList" :key="i">
            <img v-if="item.isIDCard" @click="delImage(imageOne.busiFileType,imageOne.originName)" class="image-del" src="@/static/images/perfectInformation/imageDel.svg">
            <img class="image-con" :src="imageOne.base64CodeUrl">
          </view>
          <!--<view class="item after-upload">
            <img class="image-del" src="@/static/images/perfectInformation/imageDel.svg">
            <img class="image-con">
          </view>-->
          <view class="item before-upload" v-if="item.isIDCard">
            <img class="image-del" src="@/static/images/perfectInformation/imageDel.svg">
            <img v-show="false" class="image-con">
            <view class="image-con upload-image" ref="uploadimg" :id="item.busiFileType" @click="upload">
            <img class="huiyuan_img" :src="idcard.image" mode="">
            </view>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>
<script>
import {mapGetters, mapMutations, mapActions} from 'vuex';
import { pathToBase64, base64ToPath } from '@/static/js/imagetools.js';
export default {
  data: function() {
    return {
      title: "影像信息",
      serialNo: "", //申请编号
      imageInformation: "perfectInformation/imageInformation/imageInformation", //影像信息跳转
      iconcheck:0, //是否上传
      imageBatchNo:'',//图片版本批次号
      imageUpLoadDate:'',//图片上传时间
      idcard:{
        image:'./static/images/perfectInformation/imageUpload.svg'
      },//上传logo
      uploads:{
        image:''
      },
      imagelists:[],
      fromID:"",//影像信息二级菜单
      allBusiFileTypeList:[
        {
          id:"0",
          name:"身份证明资料",
          param:["2012060101","2012060102","2012060103","2012060104"]
        },
        {
          id:"1",
          name:"收入证明资料",
          param:["2012060201","2012060202","2012060203"]
        },
        {
          id:"2",
          name:"用途证明资料",
          param:["2012060301","2012060302","2012060303","2012060304","2012060305"]
        },
        {
          id:"3",
          name:"抵押房产资料",
          param:["2012060401","2012060402","2012060403"]
        },
        {
          id:"4",
          name:"征信相关资料",
          param:["2012060501","2012060502","2012060503"]
        },
        {
          id:"5",
          name:"系统生成表格",
          param:["2012060601","2012060602","2012060603","2012060604"]
        },
        {
          id:"6",
          name:"房产证、他项权证",
          param:["20120701"]
        },
        {
          id:"7",
          name:"放款账户信息",
          param:["2012070201","2012070202"]
        },
        {
          id:"8",
          name:"借款抵押合同信息",
          param:["20120703"]
        },
        {
          id:"9",
          name:"其他资料",
          param:["20120704"]
        },
        {
          id:"10",
          name:"放款通知书",
          param:["20120801"]
        },
        {
          id:"11",
          name:"放款凭证",
          param:["2012080201"]
        },
        {
          id:"12",
          name:"其他贷后资料",
          param:["20120803"]
        },
      ],//二级菜单参数
      paramBusiFileTypeList:[],//影响信息参数
      busiFileType:[],//编号  数据字典查询结果
    };
  },
  computed:{
    ...mapGetters(['approvalIngList','queryApplyInfoList'])
  },
  onLoad: function(options) {
    this.serialNo = this.queryApplyInfoList.applyNo; //申请编号
  },
  created(){
    this.fromID=localStorage.getItem('imgFromID');
    this.title=localStorage.getItem('imgFromID');
    this.serialNo = this.queryApplyInfoList.applyNo; //申请编号
    //获取当前申请信息的图片批次号  start
    let _this=this;
    let data={
      orderNo:'',
      applyNo:_this.serialNo,
    };
    yu.showLoading();
    this.interfaceRequest(
      '/api/credit/queryApplyInfo',
      data,
      "get",
      function(res) {
        let result=res.data.data;
        _this.imageBatchNo=result.imageList[0].imageBatchNo;
        _this.imageUpLoadDate=result.imageList[0].imageUpLoadDate;
        _this.getImagesList(result.imageList[0].imageBatchNo,result.imageList[0].imageUpLoadDate);
      },
      function(err) {}
    );
    //获取当前申请信息的图片批次号  end

    let btlist=_this.allBusiFileTypeList;
    for(let i=0 ; i<btlist.length ;i++){
      if(btlist[i].name.indexOf(_this.fromID) != -1 ){
        _this.paramBusiFileTypeList=btlist[i].param;
        localStorage.removeItem("imgFromID");
      }
    }

    _this.getListName();//获取影像信息菜单  比对
    
  },
 
  methods: {
    // 预览图片单张
    previewImg(logourl) {
      let _this = this;
      let imgsArray = [];
      imgsArray[0] = logourl;
      uni.previewImage({
          current: 0,
          urls: imgsArray
      });
      /* uni.showLoading({
        title:"图片处理中..."
      })
      base64ToPath(logourl) //logoul为base64为图片流
        .then(path => {
          console.log(logourl);
          console.log(path);
        let imgsArray = [];
        uni.hideLoading();
        imgsArray[0] = path;
        uni.previewImage({
          current: 0, 
          urls: imgsArray
        });
        })
        .catch(error => {
          yu.showToast({
            icon: "none",
            title: "图片预览失败",
            duration: 1500
          });
          uni.hideLoading();
        }) */
    },
    //返回上一页
    navigateBack() {
      this.pageJump(this.imageInformation);
    },
    //获取下载当前申请的影像信息
    getImagesList(imageBatchNo,busiStartDate){
      //获取图片信息 start
      let _this=this;
      let posturl="/api/imagehandle/downloadbynoanddate";
      let param={
        "busiSerialNo": imageBatchNo,
        "busiStartDate":busiStartDate,
        "busiFileTypeList":_this.paramBusiFileTypeList,
        "filePartName": "LS_SQZL_P",
        "modelCode": "LS_SQZL"
      };
      _this.interfaceRequest(
        posturl,
        param,
        "post",
        function(res) {
          let itemlist=res.data.data.downloadImageOutVoList;
          yu.hideLoading();
          for(let i=0;i<itemlist.length ; i++){
            let param=itemlist[i].busiFileType;
            itemlist[i].busiFileTypeName=_this.getBusiFileTypeName(_this.busiFileType[param]);
            if(param == "2012060101"){
              itemlist[i].isIDCard=false;
            }else{
              itemlist[i].isIDCard=true;
            }
            console.log(_this.busiFileType[param]);
            for(let j=0;j < itemlist[i].downloadImageDtoList.length; j++){
              itemlist[i].downloadImageDtoList[j].base64CodeUrl='data:image/jpg;base64,' +itemlist[i].downloadImageDtoList[j].base64Code;
            }
          }
          _this.imagelists=itemlist;
          console.log(_this.imagelists);
          _this.uploadImageResult('type','base64','base64url');
        },
        function(err) {}
      );
      //获取图片信息 end
    },
    //base64路径拼接
    base64URL(param){
      return 'data:image/jpg;base64,' + param;
    },
    //数据字典查询 
    getListName(){
      let _this=this;
      let posturl="/api/dictionary/queryDictionaryList";
      let param={"dictionaryName": "busiFileType"};
      _this.interfaceRequest(
        posturl,
        param,
        "GET",
        function(res) {
          let result=res.data.data;
          _this.busiFileType=result;
        },
        function(err) {}
      );
    },
    //截取字符串   照片名字
    getBusiFileTypeName(name){
      let arr=name.split('-');
      return arr[2];
    },
    /*******上传图片  start */
    //上传图片
    upload(e){
      let _id=e.target.id;
      let _self = this;
      uni.chooseImage({
        count: 1,
        sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
        sourceType: ['camera','album'], //拍照
        success: function (res) {
          const tempFilePaths = res.tempFilePaths;
          
          foxsdk.gallery.imageBase64(tempFilePaths[0], entry => {
            let base64code = entry.payload.imageBase64;
            let base64='data:image/jpeg;base64,' + base64code;
            _self.compressImages(base64,1,function(data){
              _self.uploadImagePost(data,_id);//调用上传图片方法
            });
          });
          _self.iconcheck = 1;//点击后图片更改状态由0变成1
        },
        error : function(e){
          console.log(e);
        }
      });
    },
    //url转化为base64
    convertImgToBase64(url, callback, outputFormat){
      let canvas = document.createElement('CANVAS');
      let ctx = canvas.getContext('2d');
      let img = new Image();
      img.src = url;
      img.setAttribute("crossOrigin",'Anonymous');
      //img.crossOrigin = 'Anonymous';
      img.onload = function(){
        let width = img.width;
        let height = img.height;
        // 按比例压缩2倍       //设置压缩比例，最后的值越大压缩越高
        let rate = (width < height ? width / height : height / width) / 20;
        canvas.width = width * rate;
        canvas.height = height * rate;           //绘制新图
        ctx.drawImage(img, 0, 0, width, height, 0, 0, width * rate, height * rate);                                               //转base64
        let dataURL = canvas.toDataURL(outputFormat || 'image/jpg');
        callback.call(this, dataURL);   //回调函数传入base64的值
        canvas = null;
      };
    },
    //上传图片图片页面效果处理
    uploadImageResult(type,base64,filename){
      let _this=this;
      let base64url='data:image/jpeg;base64,' + base64;
      let param={
        "base64Code":base64,
        "base64CodeUrl":base64url,
        "busiFileType":type,
        "frontBackFlag":0,
        "psnTp":0,
        "originName":filename
      };
      for(let i=0;i<_this.imagelists.length; i++){
        if(_this.imagelists[i].busiFileType === type){
          _this.imagelists[i].downloadImageDtoList=_this.imagelists[i].downloadImageDtoList.concat(param);
        }
      }
    },
    //上传图片接口
    uploadImagePost(base64Code,bt){
      let _this=this;
      let postUrl='/api/imagehandle/uploadbynoanddate';
      let busiFileTypeList=[bt];
      let data={
        "busiSerialNo": _this.imageBatchNo,
        "busiStartDate": _this.imageUpLoadDate,
        "busiFileTypeList": busiFileTypeList,
        "filePartName": "LS_SQZL_P",
        "modelCode": "LS_SQZL",
        "uploadImageInVoList": [
          {
            "base64Code": base64Code,
            "frontBackFlag": "0",
            "psnTp": "0",
            "idNumber": ""
          }
        ]
      };
       yu.showToast({
        icon: "none",
        title: "图片开始上传",
        duration: 1500
      });
       _this.interfaceRequest(
        postUrl,
        data,
        "post",
        function(res) {
          yu.showToast({
            icon: "none",
            title: "图片上传成功",
            duration: 1500
          });
          let filename=res.data.data.uploadImageOutVoList[0].fileName;
          _this.uploadImageResult(bt,base64Code,filename);
        },
        function(err) {}
      );
    },
    /*******上传图片  end */
    /*******删除图片  start */
    //根据文件名删除图片delImage
    delImage(bt,filename){
      let _this=this;
      let postUrl='/api/imagehandle/deletebyfilename';
      let busiFileTypeList=[filename];
      let data={
        "busiSerialNo": _this.imageBatchNo,
        "busiStartDate": _this.imageUpLoadDate,
        "fileNameList": busiFileTypeList,
        "filePartName": "LS_SQZL_P",
        "modelCode": "LS_SQZL",
      };
       _this.interfaceRequest(
        postUrl,
        data,
        "post",
        function(res) {
          let result=res.data.data;
          yu.showToast({
            icon: "none",
            title: "图片删除成功",
            duration: 1500
          });
          //let filename=res.data.data.uploadImageOutVoList.fileName;
          _this.deleteImageResult(bt,filename);
        },
        function(err) {}
      );
    },
    //删除图片图片页面效果处理
    deleteImageResult(type,filename){
      let _this=this;
      for(let i=0;i<_this.imagelists.length; i++){
        for(let j=0;j<_this.imagelists[i].downloadImageDtoList.length; j++){
          if(_this.imagelists[i].downloadImageDtoList[j].originName === filename){
            _this.imagelists[i].downloadImageDtoList.splice(j,1);
          }
        }
      }
    },
    /*******删除图片  end */
  },
  mounted() {
  }
};
</script>
<style lang="scss" scoped>
uni-page-wrapper{
  background: #f6f8f9 !important;
  height: 100%;
}
uni-app{
    background: #f6f8f9 !important;
    height: 100%;
}
uni-page-body{
    background-color: #f6f8f9;
    height: 100%;
}
.information-box {
  background: #f6f8f9 !important;
  width: 100%;
  height: 100%;
}
.image-list-con{
  margin-top: 135rpx;
  background: #f6f8f9 !important;
  .image-information {
    background: #f6f8f9;
    .title {
      padding-top: 30rpx;
      height: 45rpx;
      line-height: 45rpx;
      font-size: 32rpx;
      color: #333333;
      display: flex;
      vertical-align: middle;
      align-items: center;
      text{
        height: 45rpx;
        font-size: 32rpx;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 500;
        color: #333435;
        line-height: 45rpx;
      }
      .title-line{
        width: 10rpx;
        height: 30rpx;
        background: #3B86F7;
        border-radius: 4rpx;
        display: inline-block;
        margin: 7.5rpx 17rpx  7.5rpx 33rpx;
      }
    }
    
    .image-list{
      background: #ffffff;
      margin-top: 20rpx;
      padding: 40rpx 31rpx;
      display: flex;
      flex-wrap: wrap;
      .item{
        width: 220rpx;
        height: 220rpx;
        background: #F6F8F9;
        position: relative;
        display: inline-flex; 
        justify-content: center;
        align-items: center;
        z-index: 2;
        margin:0 15rpx 15rpx 0;
        .image-del{
          width: 40rpx;
          height: 40rpx;
          position: absolute;
          top: 0;
          right: 0;
          z-index: 5;
          display: none;
        }
        .image-con{
          width: 200rpx;
          height: auto;
          max-height: 150rpx;
        }
      }
      .item::after{
        display: block;
        content: '';
        clear: both;
      }
      .item:nth-child(3n){
        margin-right: 0;
      }
      .item.after-upload{
        .image-del{display: block;}
        .upload-image{
          img{
            width: 200rpx;
            height: 150rpx;
          }
        }
      }
      .item.before-upload{
        
        .upload-image{
          display: flex;
          vertical-align: middle;
          align-items: center;
          justify-content: center;
          position: absolute;
          width:100%;
          height:100%;
          img{
            width: 66rpx;
            height: 66rpx;
          }
        }
      }
    }
  }
}
.customize-head{
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  padding: 62rpx 36rpx 18rpx 0;
  height: 50rpx;
  line-height: 50rpx;
  background: #ffffff;
  display: flex;
  vertical-align: middle;
  align-items: center;
  z-index: 5000;
  .ch-img{
    position: absolute;
    left: 0;
    top: 69rpx;
    width: 20rpx;
    height: 36rpx;
    margin-left: 36rpx;
    img{
      width: 20rpx;
      height: 36rpx;
    }
  }
  .ch-title{
    font-size: 36rpx;
    height: 50rpx;
    line-height: 50rpx;
    margin:0 auto;
    text-align: center;
    color: #333333;
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
</style>
