<template>
  <view class="uni-container">
    <view class="pf-poifixed">
      <view :class="phoneSystem ?'pf-title pf-title-ios pf-titleThree':'pf-title pf-titleThree'">
        <img src="@/static/images/firstroom/backArrow.svg" @click="navigateBack">
        <text>{{identity}}信息</text>
        <text class="pf-text" @click="nextStep(false)">暂存</text>
      </view>
      <!--信息完善进度条-start-->
      <view class="household-progress">
        <img src="@/static/images/firstroom/shortProgress01.svg" />
        <view class="uni-flex uni-row">
          <view class="flex-item active">户籍信息</view>
          <view class="flex-item">基本信息</view>
          <view class="flex-item">工作信息</view>
        </view>
      </view>
      <!--信息完善进度条-end-->
    </view>
    <view class="pf-content household-content">
      <!--影像信息-start-->
      <view class="form-title">
        <view class="vLine"></view>影像信息
      </view>
      <view class="image-information">
        <view class="idcard-box">
          <view class="idcard-positive">
            <img id="img1" class="idcard-img" :src="IDFrontPath" />
            <view class="idcard-camera" @click="startOCR(1)"><img src="@/static/images/firstroom/camera.svg"></view>
          </view>
          <view class="idcard-infor"><text>人像面</text></view>
        </view>
        <view class="idcard-box">
          <view class="idcard-negative">
            <img id="img2" class="idcard-img" :src="IDReversePath" />
            <view class="idcard-camera" @click="startOCR(0)"><img src="@/static/images/firstroom/camera.svg"></view>
          </view>
          <view class="idcard-infor"><text>国徽面</text></view>
        </view>
      </view>
      <!--影像信息-end-->
      <!--选择关联人-start-->
      <view class="form-title" v-if="relatedPerson">
        <view class="vLine"></view>选择关联人
      </view>
      <view class="contract-ul" v-if="relatedPerson">
        <view class="contract-li">
          <view>{{relatedPerson}}</view>
          <view>
            <picker @change="relatedPersonChange" :value="relatedPersonIdx" :range-key="'value'" :range="relatedPersonList" :disabled="isDisabled">
              {{relatedPersonList[relatedPersonIdx].value}}
            </picker>
            <img src="@/static/images/firstroom/formChooseArrow.svg">
          </view>
        </view>
      </view>
      <!--选择关联人-end-->
      <!--个人信息-start-->
      <view class="form-title">
        <view class="vLine"></view>户籍信息
      </view>
      <view class="contract-ul">
        <view class="contract-li-tips">
          <view class="contract-li">
            <view>姓名</view>
            <view>
              <input class="uni-input" placeholder="请输入" type="text" v-model.trim="personInfor.name" @focus="verifyName.isTipShow=false" @blur="checkName(personInfor.name)" />
              <img src="@/static/images/firstroom/cleanUp.svg" v-show="personInfor.name!=''" @click="personInfor.name=''">
            </view>
          </view>
          <view v-show="verifyName.isTipShow" class="contract-tips">{{verifyName.tipText}}</view>
        </view>
        <view class="contract-li">
          <view>身份证号</view>
          <view>
            <text>{{personInfor.idcard}}</text>
          </view>
        </view>
        <view class="contract-li-tips" v-for="(item,index) in personInfor.nameUsedList" :key="index">
          <view class="contract-li">
            <view>曾用名（选填）</view>
            <view>
              <input class="uni-input" placeholder="请输入" type="text" v-model.trim="item.name" @focus="personInfor.nameUsedList[index].isTipShow=false" @blur="checkNameUsed(personInfor.nameUsedList[index].name,index)" />
              <img v-if="personInfor.nameUsedList[index].name!=''" class="cleanUp" src="@/static/images/firstroom/cleanUp.svg" @click="personInfor.nameUsedList[index].name=''" />
              <img v-if="index==0" src="@/static/images/firstroom/plus.svg" @click="addName" />
              <img v-else src="@/static/images/firstroom/minus.png" @click="deleteName(index)" />
            </view>
          </view>
          <view v-show="personInfor.nameUsedList[index].isTipShow" class="contract-tips">姓名只能输入中文和“.”，2-20个字</view>
        </view>
        <view class="contract-li">
          <view>性别</view>
          <view>
            <text>{{personInfor.sex}}</text>
          </view>
        </view>
        <view class="contract-li">
          <view>出生日期</view>
          <view>
            <text>{{personInfor.birthday}}</text>
          </view>
        </view>
      </view>
      <view class="contract-ul marginT25">
        <view class="collateral-site">
          <view class="contract-li">
            <view>户籍地址</view>
          </view>
          <view class="collateral-flex">
            <textarea placeholder="请输入户籍地址" placeholder-style="color:#c7c9cd" v-model.trim="personInfor.ermanentAddress" auto-height fixed="true"/>
          </view>
        </view>
        <view class="contract-li" v-if="maturityDateyBoolean">
          <view>证件到期日</view>
          <view>
            <picker mode="date" :value="personInfor.date" :start="startDate" :end="endDate" @change="bindDateChange">
              {{personInfor.date}}
            </picker>
            <img src="@/static/images/firstroom/formChooseArrow.svg" />
          </view>
        </view>
         <view class="contract-li" v-if="!maturityDateyBoolean">
          <view>证件到期日</view>
          <view>
            <text>长期</text>
          </view>
        </view>
      </view>
      <!--个人信息-end-->
      <view :class="phoneSystem ? 'contract-button':'contract-button contract-button-an'">
        <button type="primary" @click="nextStep(true)">下一步</button>
      </view>
    </view>
  </view>
</template>
<script>
  import { mapGetters,mapActions,mapMutations } from 'vuex'

  export default {
    data() {
      const currentDate = this.getDate({
        format: true
      })
      return {
        identity: "",
        listName: "",
        userId: '',
        navigateFlag: false,
        isDisabled:false,
        baseInformation:{url:"baseInformation"},
        relatedPerson: '',
        relatedPersonList: [
          {
            key: '',
            value: '请选择',
            certID: ''
          }
        ],
        relatedPersonIdx: 0,
        relatedPersonArr: [],
        personInfor:{
          name:"",
          idcard:"",
          nameUsedList:[
            {name:'',isTipShow:false}
          ],
          sex:"",
          birthday:"",
          ermanentAddress: '',
          date: currentDate
        },
        verifyName: {
          isTipShow:false,
          tipText: '姓名不能为空，2-20个字',
        },
        verifyIdcard: {
          isTipShow:false,
          tipText: '请准确输入18位身份证号码',
        },
        // batchId: '',
        IDFrontPath: './static/images/firstroom/idcardPositive.svg',   //身份证正面
        IDReversePath: './static/images/firstroom/idcardNegative.svg',   //身份证反面
        IDFrontBase64: '',
        IDReverseBase64: '',
        IDFrontName: '',
        IDReverseName: '',
        psnTp: '',
        orderNoVal: '',  //订单编号
        applyNoVal: '',  //申请编号
        isJump: true,
        busiSerialNoVal: '', //业务流水号
        busiStartDateVal: '', //业务日期
        iDCardNoVal: '',  //身份证号，用于区分人员为修改还是新建
        preventResubmit: true,  //防重复提交
        maturityDateyBoolean: true,  //长期false 日历框true
      }
    },
    onLoad(option) {
      console.log(888888888888);
      console.log(this.approvalIngList);
      this.orderNoVal = this.approvalIngList.orderNo;
      this.applyNoVal = this.approvalIngList.serialNo;
      if(JSON.stringify(this.personalInformation) != "{}"){
        this.getPersonalData();
      }
      this.identity = option.identity;
      // 影像批次号
      if(this.queryApplyInfoList.imageList != null && this.queryApplyInfoList.imageList.length>0){
        this.busiSerialNoVal = this.queryApplyInfoList.imageList[0].imageBatchNo; //业务流水号
        this.busiStartDateVal = this.queryApplyInfoList.imageList[0].imageUpLoadDate; //业务日期
      }
      switch(option.identity){
        case '借款人配偶':
          this.listName='otherCustomerList';
          this.psnTp='2';
          break;
        case '共借人':
          this.listName='sameApplyList';
          this.psnTp='3';
          break;
        case '共借人配偶':
          this.listName='sameApplyRelList';
          this.psnTp='4';
          this.relatedPerson='共借人';
          this.relatedPersonArr=this.queryApplyInfoList.sameApplyList;
          this.relatedPersonArr.forEach((item, index) => {
            this.relatedPersonList.push({
              key: index+1,
              value: item.customerName,
              certID: item.certID
            });
          });
        break;
        case '担保人':
          this.listName='guarantorList';
          this.psnTp='5';
        break;
        case '担保人配偶':
          this.listName='guarantyRelList';
          this.psnTp='6';
          this.relatedPerson='担保人'
          this.relatedPersonArr=this.queryApplyInfoList.guarantorList
          this.relatedPersonArr.forEach((item, index) => {
            this.relatedPersonList.push({
              key: index+1,
              value: item.guarantorName,
              certID: item.certID
            });
          });
        break;
        default:
          console.log('出错了！');
          break;
      }
    },
    onShow() {},
    onUnload() {},
    computed: {
        ...mapGetters([
          'approvalIngList',
          'userInfor',
          "queryApplyInfoList",
          "personalInformation"
        ]),
        startDate() {
            return this.getDate('start');
        },
        endDate() {
            return this.getDate('end');
        }
    },
    methods: {
      ...mapActions(['queryApplyInfoCommit']),
      ...mapMutations(['personalInformationReplace']),
      //返回上一页
      navigateBack(){
        yu.showModal({
          title: '确定返回吗？',
          content: '数据还未提交，点确定后编辑过的内容将不保存！',
          success: (res)=> {
            if (res.confirm) {
              // uni.navigateBack();
              this.pageJump('personInformation/personInformation')
            } else if (res.cancel) {
              console.log('用户点击取消');
            }
          }
        });
      },
      //下拉列表
      bindDateChange: function(e) {
        if(e.target.value.indexOf("-") == -1){
          this.personInfor.date = e.target.value + '-' + '01' + '-' + '01'
        }else if(e.target.value.indexOf("--") != -1){
          this.personInfor.date = e.target.value.split('-')[0] + '-' + '01' + '-' + e.target.value.split('-')[2]
        }else if(e.target.value.split('-').length==2){
          this.personInfor.date = e.target.value.split('-')[0] + '-' + e.target.value.split('-')[1] + '-' + '01'
        }else{
          this.personInfor.date = e.target.value
        }
      },

      // 启动OCR获取身份证上的信息
      startOCR(type) {
				foxsdk.intsigocr.startOCR(type, ret => {
          console.log('+++++++++++++');
          // console.log(ret);
          // if(type==1){
          if(ret && ret.payload && ret.payload.Name){
            if(this.iDCardNoVal !='' && this.iDCardNoVal != ret.payload.IDCardNo){
              this.showToastFun('不可修改人员信息，如需修改请先删除再进行新增！');
              return;
            }
            this.personInfor.name = ret.payload.Name;
            this.personInfor.idcard = ret.payload.IDCardNo;
            this.personInfor.sex = ret.payload.Gender;
            this.personInfor.ermanentAddress = ret.payload.Address; 
            let year = ret.payload.IDCardNo.substring(6,10);
            let month = ret.payload.IDCardNo.substring(10,12);
            let day = ret.payload.IDCardNo.substring(12,14);
            this.personInfor.birthday = year + '-' + month + '-' + day;
            foxsdk.io.convertLocalFileSystemURL(ret.payload.ImagePath, url => {
              this.IDFrontPath = url;
            },ret => {
              this.showToastFun('OCR路径转换失败');
            });
            foxsdk.gallery.imageBase64(ret.payload.ImagePath, entry => {
              this.IDFrontBase64 = entry.payload.imageBase64;
            });
          }else{
            foxsdk.io.convertLocalFileSystemURL(ret.payload.ImagePath, url => {
              this.IDReversePath = url;
            },ret => {
              this.showToastFun('OCR路径转换失败');
            });
            foxsdk.gallery.imageBase64(ret.payload.ImagePath, entry => {
              this.IDReverseBase64 = entry.payload.imageBase64;
            });
            let dateStringIndex = ret.payload.TermOfValidity.lastIndexOf("\-");
            let dateString = ret.payload.TermOfValidity;
            dateString = dateString.substring(dateStringIndex+1, dateString.length);
            if(dateString.length > 2){
              this.maturityDateyBoolean = true;
              this.personInfor.date = dateString.replace(/\./g,"-");
            }else{
              this.maturityDateyBoolean = false;
            }
            
            
          }
        });
		  },
      // 调6.6接口，将图片存储到影像平台
      uploadbybacthid(){
        let _this=this;
        //压缩图片base64code大小  start
        let zhengcode='';
        let fancode='';
        let zhengbase64='data:image/jpeg;base64,' + _this.IDFrontBase64;
        let fanbase64='data:image/jpeg;base64,' + _this.IDReverseBase64;
        _this.compressImages(zhengbase64,1,function(data){
          zhengcode=data;
        }); 
        _this.compressImages(fanbase64,1,function(res){
          fancode=res;
          let data={
            busiSerialNo: _this.busiSerialNoVal,  //业务流水号
            busiStartDate: _this.busiStartDateVal,  //业务日期
            // batchId: this.batchId,
            busiFileTypeList: ['2012060101'],
            filePartName: 'LS_SQZL_P',
            modelCode: 'LS_SQZL',
            uploadImageInVoList: [
              {
                base64Code: zhengcode,
                frontBackFlag: '2',
                psnTp: _this.psnTp,
                idNumber: _this.personInfor.idcard
              },
              {
                base64Code: fancode,
                frontBackFlag: '1',
                psnTp: _this.psnTp,
                idNumber: _this.personInfor.idcard
              },
            ]
          }
          yu.showLoading();
          let posturl="/api/imagehandle/uploadbynoanddate";
          _this.interfaceRequest(posturl,data,"post",(res)=>{
            yu.hideLoading();
            console.log('*********存储')
            console.log(res.data.data);
            if(res.data.data.returnCode == 'Success'){
              if(_this.isJump){
                //this.pageJump('personInformation/baseInformation/baseInformation?identity='+this.identity);
                _this.queryApplyInfo();
              }else{
                _this.queryApplyInfoNo();
                yu.showToast({
                  title: '暂存成功！',
                  image: './static/images/perfectInformation/success.svg',
                  duration: 2000
                });
              }
            }else{
              _this.showToastFun(res.data.data.returnDesc);
            }
          
          },(err)=>{
            yu.hideLoading();
            console.log('*********存储')
            console.log(err);
            _this.showToastFun('6.6影像出现问题，请联系管理员');
            setTimeout(()=>{
              _this.pageJump('personInformation/personInformation')
            },3100);
            
          });
        }); 
        //压缩图片base64code大小  end
        
      },
      // 6.8接口 下载影像信息
      downloadbybatchid(){
        let data={
          busiSerialNo: this.busiSerialNoVal,  //业务流水号
          busiStartDate: this.busiStartDateVal,  //业务日期
          // batchId: this.batchId,
          busiFileTypeList: ['2012060101'],
          filePartName: 'LS_SQZL_P',
          modelCode: 'LS_SQZL',
          psnTp: this.psnTp,
          idNumber: this.personInfor.idcard
        }
        let posturl='/api/imagehandle/downloadbynoanddate';
        yu.showLoading();
        this.interfaceRequest(posturl,data,"post",(res)=>{
          yu.hideLoading();
          let resData=res.data.data;
          console.log('//////////下载')
          console.log(res.data.data);
          if(resData.returnCode=='Success'){
            resData.downloadImageOutVoList[0].downloadImageDtoList.forEach((item, index) => {
              if(item.frontBackFlag=='2'){
                this.IDFrontPath = 'data:image/jpg;base64,' + item.base64Code;
                this.IDFrontName = item.originName;
                this.IDFrontBase64 = item.base64Code;
              }else if(item.frontBackFlag=='1'){
                this.IDReversePath = 'data:image/jpg;base64,' + item.base64Code;
                this.IDReverseName = item.originName;
                this.IDReverseBase64 = item.base64Code;
              }
            });

          }else{
            this.showToastFun(resData.returnDesc);
          }
        },(err)=>{
          yu.hideLoading();
          console.log('//////////下载')
          console.log(err);
          this.showToastFun('6.8影像出现问题，请联系管理员');
        });
      },
      // 先6.7删除 再6.6新增 实现更新影像信息
      updatebyfilename(){
        let data={
          busiSerialNo: this.busiSerialNoVal,  //业务流水号
          busiStartDate: this.busiStartDateVal,  //业务日期
          // batchId: this.batchId,
          fileNameList: [this.IDFrontName,this.IDReverseName],
          filePartName: 'LS_SQZL_P',
          modelCode: 'LS_SQZL'
        }
        let posturl='/api/imagehandle/deletebyfilename';
        yu.showLoading();
        this.interfaceRequest(posturl,data,"post",(res)=>{
          yu.hideLoading();
          if(res.data.data.returnCode == 'Success'){
            this.uploadbybacthid();
            this.deletelocalfileandfolder();
          }else{
            this.showToastFun(res.data.data.returnDesc);
          }
        },(err)=>{
          yu.hideLoading();
          console.log('//////////删除')
          console.log(err);
          this.showToastFun('6.7影像出现问题，请联系管理员');
        });
      },
      //6.9 删除从影像平台下载的文件和文件夹
      deletelocalfileandfolder(){
        let posturl='/api/imagehandle/deletedownloadfileandfolder';
        yu.showLoading();
        this.interfaceRequest(posturl,{},"post",(res)=>{
          yu.hideLoading();
          if(res.data.data.returnCode == 'Faild'){
            this.showToastFun(res.data.data.returnDesc);
          }
        },(err)=>{
          yu.hideLoading();
          console.log('//////////删除文件夹')
          console.log(err);
          this.showToastFun('6.9影像出现问题，请联系管理员');
        });
      },
      addName(){
        if(this.personInfor.nameUsedList.length >= 3){
          this.showToastFun('最多可填3个曾用名');
          return;
        }
        this.personInfor.nameUsedList.push({name:'',isTipShow:false});
      },
      deleteName(e){
        this.personInfor.nameUsedList.splice(e,1);
      },
      relatedPersonChange(e){
        this.relatedPersonIdx = e.target.value
      },
      // 下一步
      nextStep(isJump){
        if(!this.preventResubmit){
          yu.showModal({
            content: '操作进行中，请稍等',
            showCancel: false,
            cancelText: "确定",
            success: function (res) {
              if (res.confirm) {
                console.log('用户点击确定');
              }
            }
          });
          return;
        }
        this.isJump = isJump;
        
        // if((this.IDFrontBase64=='' && this.IDReverseBase64!='') || (this.IDFrontBase64!='' && this.IDReverseBase64=='') || (this.IDFrontBase64=='' && this.IDReverseBase64 =='') ){
        //   this.showToastFun('请上传完整的身份证信息');
        //   return;
        // };
        if(isJump){
          if(this.personInfor.idcard == ''){
            this.showToastFun('请上传完整的身份证信息');
            return;
          }
          if(this.relatedPerson!='' && this.relatedPersonIdx=='0'){
            this.showToastFun('请选择关联人');
            return;
          };
          if(this.personInfor.name == ''){
            this.showToastFun(this.verifyName.tipText);
            return;
          }
          if(this.personInfor.ermanentAddress == ""){
            this.showToastFun("请输入户籍地址");
            return;
          }
        }
        
        this.preventResubmit = false;
        if(JSON.stringify(this.personalInformation) != "{}"){
          this.updatePersonalData();
        }else{
          this.listUpdate();
        };
      },
      showToastFun(e){
        yu.showToast({
          title: e,
          icon: 'none',
          duration: 3000
        });
      },
      // 3.12接口 关联人列表更新
      listUpdate(){
        let sendArr=[];
        if(this.queryApplyInfoList != null){
          if(this.queryApplyInfoList[this.listName]){
            sendArr= this.queryApplyInfoList[this.listName].concat();
          };
        };
        let names=[];
        if(this.personInfor.nameUsedList.length > 0){
          this.personInfor.nameUsedList.forEach((item, index) => {
            names.push(item.name)
          });
        };
        let idexpiryVal = '';
        if(this.maturityDateyBoolean){
          idexpiryVal = this.personInfor.date.replace(/-/g,'/');
        }else{
          idexpiryVal = "9999/12/31";
        };
        if(this.listName=='otherCustomerList' || this.listName=='sameApplyList'){
          //配偶及家属信息 ||　共同申请人信息
          sendArr.push({
              certID: this.personInfor.idcard,
              certType: 'Ind01',
              customerName: this.personInfor.name,
              formerlyName: names.join(','),
              gender: this.personInfor.sex=='男'?'1':'2',
              bornDate: this.personInfor.birthday.replace(/-/g,'/'),
              nativeAdd: this.personInfor.ermanentAddress,
              idexpiry: idexpiryVal
            });
        }else if(this.listName=='sameApplyRelList' || this.listName=='guarantyRelList'){
          //共同申请人关联人信息 || 担保人关联人
          sendArr.push({
              certID: this.personInfor.idcard,
              certType: 'Ind01',
              customerName: this.personInfor.name,
              relCertID: this.relatedPersonList[this.relatedPersonIdx].certID,
              relCertType: 'Ind01',
              relationShip: '0301',
              formerlyName: names.join(','),
              gender: this.personInfor.sex=='男'?'1':'2',
              bornDate: this.personInfor.birthday.replace(/-/g,'/'),
              nativeAdd: this.personInfor.ermanentAddress,
              idexpiry: idexpiryVal
            });
        }else if(this.listName=='guarantorList'){
          //担保人信息
          sendArr.push({
            certID: this.personInfor.idcard,
            certType: 'Ind01',
            guarantorName: this.personInfor.name,
            formerlyName: names.join(','),
            gender: this.personInfor.sex=='男'?'1':'2',
            bornDate: this.personInfor.birthday.replace(/-/g,'/'),
            nativeAdd: this.personInfor.ermanentAddress,
            idexpiry: idexpiryVal
          });
        };
        let data={
          orderNo: this.orderNoVal,
          applyNo: this.applyNoVal,
          listName: this.listName,
          [this.listName]: sendArr
        }
        console.log(2222222222)
        console.log(data)
        let posturl="/api/credit/updateApplyInfo";
        yu.showLoading();
        this.interfaceRequest(posturl,data,"post",(res)=>{
          this.preventResubmit = true;
          yu.hideLoading();
          let resArr=res.data.data;
          if(resArr.returnCode=='Success'){
            // 新增时只调3.12接口，不调3.7了
            if(JSON.stringify(this.personalInformation) == "{}"){
              let dataVal ={
                certType: 'Ind01',
                certId: this.personInfor.idcard,
                customerName: this.personInfor.name
              }
              this.personalInformationReplace(dataVal);
            }
            if(this.IDFrontBase64=='' && this.IDReverseBase64==''){
              if(this.isJump){
                // this.pageJump('personInformation/baseInformation/baseInformation?identity='+this.identity);
                this.queryApplyInfo();
              }else{
                this.queryApplyInfoNo();
                yu.showToast({
                  title: '暂存成功！',
                  image: './static/images/perfectInformation/success.svg',
                  duration: 2000
                });
              }
            }else if(this.IDFrontBase64!='' && this.IDReverseBase64!=''){
              this.uploadbybacthid();
            }
          }else{
            this.showToastFun(resArr.returnDesc);
          }
        },(err)=>{
          this.preventResubmit = true;
          yu.hideLoading();
          this.showToastFun('3.12更新失败，请联系管理员');
        });
        
      },
      // 3.7接口 个人信息更新
      updatePersonalData(){
        console.log(this.personInfor.nameUsedList)
        let names=[];
        this.personInfor.nameUsedList.forEach((item, index) => {
          names.push(item.name)
        });
        let idexpiryVal = '';
        if(this.maturityDateyBoolean){
          idexpiryVal = this.personInfor.date.replace(/-/g,'/');
        }else{
          idexpiryVal = "9999/12/31";
        };
        let data={
          userId: this.userInfor.loginCode,
          certType: 'Ind01',
          certId: this.personInfor.idcard,
          customerName: this.personInfor.name,
          formerlyName: names.join(','),
          gender: this.personInfor.sex=='男'?'1':'2',
          bornDate: this.personInfor.birthday.replace(/-/g,'/'),
          nativeAdd: this.personInfor.ermanentAddress,
          idexpiry: idexpiryVal,
          scene: 'cstScene',
          applyNo: this.applyNoVal,
          listName: 'houseInfo'
        }
        let posturl="/api/credit/customerInfoUpdate";
        yu.showLoading();
        this.interfaceRequest(posturl,data,"post",(res)=>{
          this.preventResubmit = true;
          yu.hideLoading();
          let resArr=res.data.data;
          if(resArr.returnCode=='Success'){
            if(JSON.stringify(this.personalInformation) == "{}"){
              let dataVal ={
                certType: 'Ind01',
                certId: this.personInfor.idcard,
                customerName: this.personInfor.name
              }
              this.personalInformationReplace(dataVal);
            }
            if(this.IDFrontBase64=='' && this.IDReverseBase64==''){
              if(this.isJump){
                // this.pageJump('personInformation/baseInformation/baseInformation?identity='+this.identity)
                this.queryApplyInfo();
              }else{
                this.queryApplyInfoNo();
                yu.showToast({
                  title: '暂存成功！',
                  image: './static/images/perfectInformation/success.svg',
                  duration: 2000
                });
              }
            }else if(this.IDFrontBase64!='' && this.IDReverseBase64!=''){
              this.updatebyfilename();
            }
          }else{
            this.showToastFun(resArr.returnDesc);
          }
        },(err)=>{
          this.preventResubmit = true;
          yu.hideLoading();
          this.showToastFun('3.7更新失败，请联系管理员');
        });
      },
      queryApplyInfo(){
        this.queryApplyInfoCommit({
          "orderNo": this.orderNoVal, 
          "applyNo": this.applyNoVal,
          'routerTrue': true,
          'routerTo': 'personInformation/baseInformation/baseInformation?identity='+this.identity,
          'routerJumpWay': 'pageJump'
        }); //重新调'申请信息查询'接口
      },
      queryApplyInfoNo(){
        this.queryApplyInfoCommit({
          'orderNo': this.orderNoVal,
          'applyNo': this.applyNoVal,
        }); //重新调'申请信息查询'接口
      },
      // 3.2接口 获取个人信息
      getPersonalData(){
        let personalInformation= this.personalInformation;
        let data={
          certType: personalInformation.certType,
          certId: personalInformation.certId,
          customerName: personalInformation.customerName,
          scene: 'cstScene',
          applyNo: this.applyNoVal
        }
        let posturl="/api/front/perCustomerInfo";
        yu.showLoading();
        this.interfaceRequest(posturl,data,"post",(res)=>{
          yu.hideLoading();
          let resData=res.data.data;
          if(resData.returnCode=='Success'){
            this.busiSerialNoVal = resData.imageBatchNo; //业务流水号
            this.busiStartDateVal = resData.imageUpLoadDate; //业务日期
            this.isDisabled=true;
            this.personInfor.name=resData.customerName;
            this.personInfor.idcard=resData.certId;
            this.iDCardNoVal = resData.certId;
            if(resData.gender=='1'){
              this.personInfor.sex='男'
            }else if(resData.gender=='2'){
              this.personInfor.sex='女'
            }
            this.personInfor.birthday=resData.bornDate.replace(/\//g,'-');
            this.personInfor.ermanentAddress=resData.nativeAdd;
            let dataString = resData.idexpiry.substring(0,4);
            if(dataString == '9999'){
              this.maturityDateyBoolean = false;
            }else{
              this.maturityDateyBoolean = true;
              this.personInfor.date=resData.idexpiry.replace(/\//g,'-');
            }
            
            var nameArr=resData.formerlyName.split(',');
            this.personInfor.nameUsedList=[];
            nameArr.forEach((item, index) => {
              this.personInfor.nameUsedList.push({name:item,isTipShow:false})
            });
            console.log(22222222)
            console.log(this.relatedPersonList)
            if(this.relatedPersonList.length>1){
              this.relatedPersonList.forEach((item, index) => {
                if(item.certID==personalInformation.relCertID){
                  this.relatedPersonIdx=item.key
                }
              });
            }
            this.downloadbybatchid();
          }else{
            this.showToastFun(resArr.returnDesc);
          }
        },(err)=>{
          yu.hideLoading();
          this.showToastFun('3.2更新失败，请联系管理员');
        });
      },
      getDate(type) {
        const date = new Date();
        let year = date.getFullYear();
        let month = date.getMonth() + 1;
        let day = date.getDate();

        if (type === 'start') {
            year = year - 60;
        } else if (type === 'end') {
            year = year + 60;
        }
        month = month > 9 ? month : '0' + month;;
        day = day > 9 ? day : '0' + day;
        return `${year}-${month}-${day}`;
      },
      // 下拉框回显
      selectInfo(arr,parmName){
        let selIdx=-1;
        arr.forEach((item, index) => {
          if(item.key==parmName){
            selIdx=index
          }
        });
        return selIdx
      }
    },
    mounted(){
        
    }
  };


  
</script>

<style lang='scss' scoped>
  .uni-container{
    background-color: #f6f8f9;
    padding-top: 0;  
    padding-bottom: 30rpx;
    .household-content{
      padding-top: 270rpx;
      .form-title{
        height: 94rpx;
        line-height: 94rpx;
        text-align: center;
        font-size: 32rpx;
        color: #333333;
        padding-left: 40rpx;
        display: flex;
        vertical-align: middle;
        align-items: center;
        .vLine{
          width: 10rpx;
          height: 34rpx;
          background: #3B86F7;
          border-radius: 4px;
          margin-right: 17rpx;
        }
      }
      .image-information{
        padding: 0 40rpx;
        // height: 421rpx;
        background: #ffffff;
        .title{
          height: 45rpx;
          line-height: 45rpx;
          font-size: 32rpx;
          color: #333333;
          padding-top: 26rpx;
        }
        .idcard-box{
          width: 310rpx;
          height: 264rpx;
          display: inline-block;
          margin-top: 48rpx;
          margin-bottom: 24rpx;
          .idcard-positive{
            width: 310rpx;
            height: 210rpx;
            background-size: 310rpx 210rpx;
            position: relative;
            
          }
          .idcard-negative{
            width: 310rpx;
            height: 210rpx;
            position: relative;
            background-size: 310rpx 210rpx;
          }
          .idcard-img{
            width: 310rpx;
            height: 210rpx;
            position: absolute;
            left: 0;
            top: 0;
            z-index: 1;
          }
          .idcard-camera{
            width: 90rpx;
            height: 90rpx;
            text-align: center;
            position: absolute;
            left: 50%;
            top: 50%;
            margin-left: -45rpx;
            margin-top: -45rpx;
            z-index: 2;
            img{
              width: 90rpx;
              height: 90rpx;
            }
          }
          .idcard-infor{
            height: 37rpx;
            line-height: 37rpx;
            text-align: center;
            color: #333333;
            font-size: 26rpx;
            margin-top: 17rpx;
          }
        }
        .idcard-box:last-child{
          margin-left: 50rpx;
        }
        
      }
      .image-information:after{
        display: block;
        content: "";
        clear: both;
      }
      .contract-ul{
        .collateral-site{
          .contract-li{
            uni-view:last-of-type{
              justify-content: flex-start;
              margin-left: 0;
              color: #333435;
            }
          }
        }
      }
    }
  }
  .marginT25{
    margin-top: 25rpx;
  }
</style>
