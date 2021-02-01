<template>
  <view class="uni-container">
    <view class="pf-poifixed">
      <view :class="phoneSystem ?'pf-title pf-title-ios pf-titleThree':'pf-title pf-titleThree'">
        <img src="@/static/images/firstroom/backArrow.svg" @click="navigateBack">
        <text>借款人信息</text>
        <text class="pf-text" @click="nextStep(false)">暂存</text>
      </view>
      <!--信息完善进度条-start-->
      <view class="household-progress">
        <img src="@/static/images/firstroom/longProgress01.svg" />
        <view class="uni-flex uni-row">
            <view class="flex-item active">户籍信息</view>
            <view class="flex-item">基本信息</view>
            <view class="flex-item">工作信息</view>
            <view class="flex-item">联系人信息</view>
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
            <!-- <view class="idcard-camera" @click="startOCR(1)"><img src="@/static/images/firstroom/camera.svg"></view> -->
            <view class="idcard-camera"><img src="@/static/images/firstroom/camera.svg"></view>
          </view>
          <view class="idcard-infor"><text>人像面</text></view>
        </view>
        <view class="idcard-box">
          <view class="idcard-negative">
            <img id="img2" class="idcard-img" :src="IDReversePath" />
            <!-- <view class="idcard-camera" @click="startOCR(0)"><img src="@/static/images/firstroom/camera.svg"></view> -->
            <view class="idcard-camera"><img src="@/static/images/firstroom/camera.svg"></view>
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
            <picker @change="relatedPersonChange" :value="relatedPersonIdx" :range-key="'value'" :range="relatedPersonList">
						<view class="uni-input">{{relatedPersonList[relatedPersonIdx].value}}</view>
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
              <!-- <input class="uni-input houseName" style="color: #777777;" placeholder="请输入" type="text" v-model.trim="personInfor.name" @focus="verifyName.isTipShow=false" @blur="checkName(personInfor.name)" disabled="true" /> -->
              <text>{{personInfor.name}}</text>
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
    import pageHead from '@/components/page-head.vue';
    import {
        mapGetters,
        mapActions,
        mapMutations
    } from 'vuex'
    import text from '../../../../component/text/text.vue';

    export default {
        components: {
            text
        },
        data() {
            const currentDate = this.getDate({
                format: true
            })
            return {
                listName: "",
                userId: '',
                navigateFlag: false,
                see: true,
                baseInformation: {
                    url: "baseInformation"
                },
                relatedPerson: '',
                relatedPersonList: [{
                    key: 0,
                    value: '请选择',
                    certID: ''
                }],
                relatedPersonIdx: 0,
                relatedPersonArr: [],
                personInfor: {
                    name: "",
                    idcard: "",
                    nameUsedList: [{
                        name: '',
                        isTipShow: false
                    }],
                    sex: "",
                    birthday: "",
                    ermanentAddress: '',
                    date: currentDate
                },
                verifyName: {
                    isTipShow: false,
                    tipText: '姓名不能为空，2-20个字',
                },
                verifyIdcard: {
                    isTipShow: false,
                    tipText: '请准确输入18位身份证号码',
                },
                // batchId: '',
                IDFrontPath: './static/images/firstroom/idcardPositive.svg', //身份证正面
                IDReversePath: './static/images/firstroom/idcardNegative.svg', //身份证反面
                IDFrontBase64: '',
                IDReverseBase64: '',
                IDFrontName: '',
                IDReverseName: '',
                psnTp: '1',
                orderNoVal: '', //订单编号
                applyNoVal: '', //申请编号
                isJump: true,
                busiSerialNoVal: '', //业务流水号
                busiStartDateVal: '', //业务日期
                maturityDateyBoolean: true, //长期false 日历框true
            }
        },
        onLoad(option) {
            // 影像批次号
            if (this.queryApplyInfoList.imageList != null && this.queryApplyInfoList.imageList.length > 0) {
                this.busiSerialNoVal = this.queryApplyInfoList.imageList[0].imageBatchNo; //业务流水号
                this.busiStartDateVal = this.queryApplyInfoList.imageList[0].imageUpLoadDate; //业务日期
            }
            this.orderNoVal = this.approvalIngList.orderNo;
            this.applyNoVal = this.approvalIngList.serialNo;
            if (JSON.stringify(this.personalInformation) != "{}") {
                this.getPersonalData();
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
            ...mapActions(["queryApplyInfoCommit"]),
            ...mapMutations(["personalInformationReplace"]),
            //返回上一页
            navigateBack() {
                uni.navigateBack();
            },
            //下拉列表
            bindDateChange: function(e) {
                if (e.target.value.indexOf("-") == -1) {
                    this.personInfor.date = e.target.value + '-' + '01' + '-' + '01'
                } else if (e.target.value.indexOf("--") != -1) {
                    this.personInfor.date = e.target.value.split('-')[0] + '-' + '01' + '-' + e.target.value.split('-')[2]
                } else if (e.target.value.split('-').length == 2) {
                    this.personInfor.date = e.target.value.split('-')[0] + '-' + e.target.value.split('-')[1] + '-' + '01'
                } else {
                    this.personInfor.date = e.target.value
                }
            },

            // 启动OCR获取身份证上的信息
            startOCR(type) {
                var that = this;
                foxsdk.intsigocr.startOCR(type, ret => {
                    // if(type==1){
                    if (ret && ret.payload && ret.payload.Name) {
                        that.personInfor.name = ret.payload.Name;
                        that.personInfor.idcard = ret.payload.IDCardNo;
                        that.personInfor.sex = ret.payload.Gender;
                        let dateArr = ret.payload.Birthday.split(/[\u4e00-\u9fa5]/);
                        let year = dateArr[0];
                        let month = dateArr[1] * 1 > 9 ? dateArr[1] : '0' + dateArr[1];
                        let day = dateArr[2] * 1 > 9 ? dateArr[2] : '0' + dateArr[2];
                        that.personInfor.birthday = year + '-' + month + '-' + day;
                        foxsdk.io.convertLocalFileSystemURL(ret.payload.ImagePath, url => {
                            that.IDFrontPath = url;
                        }, ret => {
                            // alert('路径转换失败')
                        });
                        foxsdk.gallery.imageBase64(ret.payload.ImagePath, entry => {
                            that.IDFrontBase64 = entry.payload.imageBase64;
                            console.log('************');
                            console.log(that.IDFrontBase64)
                        });
                    } else {
                        // let dateArr = ret.payload.TermofValidity.split(/[\u4e00-\u9fa5]/);
                        // let year = dateArr[0];
                        // let month = dateArr[1]*1>9?dateArr[1]:'0'+dateArr[1];
                        // let day = dateArr[2]*1>9?dateArr[2]:'0'+dateArr[2];
                        // that.personInfor.date = year + '-' + month + '-' + day;

                        foxsdk.io.convertLocalFileSystemURL(ret.payload.ImagePath, url => {
                            that.IDReversePath = url;
                        }, ret => {
                            // alert('路径转换失败')
                        });
                        foxsdk.gallery.imageBase64(ret.payload.ImagePath, entry => {
                            that.IDReverseBase64 = entry.payload.imageBase64;
                        });

                        let dateString = ret.payload.TermofValidity;
                        let index = dateString.lastIndexOf("\-");
                        dateString = dateString.substring(index + 1, dateString.length);
                        that.personInfor.date = dateString.replace(/\./g, '-');

                    }
                });
            },
            // 调6.6接口，将图片存储到影像平台
            uploadbybacthid() {
                let that = this;
                let data = {
                    busiSerialNo: this.busiSerialNoVal, //业务流水号
                    busiStartDate: this.busiStartDateVal, //业务日期
                    // batchId: this.batchId,
                    busiFileTypeList: ['2012060101'],
                    filePartName: 'LS_SQZL_P',
                    modelCode: 'LS_SQZL',
                    uploadImageInVoList: [{
                        base64Code: that.IDFrontBase64,
                        frontBackFlag: '2',
                        psnTp: that.psnTp,
                        idNumber: that.personInfor.idcard
                    }, {
                        base64Code: that.IDReverseBase64,
                        frontBackFlag: '1',
                        psnTp: that.psnTp,
                        idNumber: that.personInfor.idcard
                    }, ]
                }
                yu.showLoading();
                let posturl = "/api/imagehandle/uploadbynoanddate";
                that.interfaceRequest(posturl, data, "post", (res) => {
                    yu.hideLoading();
                    // alert('影像存储成功了');
                    console.log('*********存储')
                    console.log(res.data.data);
                    that.deletelocalfileandfolder();
                    if (that.isJump) {
                        let data = {
                            certType: 'Ind01',
                            certId: that.personInfor.idcard,
                            customerName: that.personInfor.name
                        }
                        this.personalInformationReplace(data);
                        console.log(this.personInfor.ermanentAddress)
                        if (this.personInfor.ermanentAddress == "") {
                            yu.showModal({
                                title: "户籍地址不能为空！",
                                content: "请输入户籍地址",
                                showCancel: false,
                                confirmText: "我知道了",
                                success: res => {
                                    if (res.confirm) {
                                        console.log("用户点击确定");
                                    }
                                }
                            });
                            return false;
                        }
                        that.pageJump('personInformation/borrowerInformation/baseInformation/baseInformation')
                    } else {
                        // alert('暂存成功！')
                        yu.showToast({
                            title: '暂存成功！',
                            image: './static/images/perfectInformation/success.svg',
                            duration: 2000
                        });
                    }
                }, function(err) {
                    yu.hideLoading();
                    // alert('存储报错了！！');
                    console.log('*********存储')
                    console.log(err);
                    that.pageJump('personInformation/personInformation')
                });
            },
            // 6.8接口 下载影像信息
            downloadbybatchid() {
                let that = this;
                let data = {
                    busiSerialNo: this.busiSerialNoVal, //业务流水号
                    busiStartDate: this.busiStartDateVal, //业务日期
                    // batchId: this.batchId,
                    busiFileTypeList: ['2012060101'],
                    filePartName: 'LS_SQZL_P',
                    modelCode: 'LS_SQZL',
                    psnTp: this.psnTp,
                    idNumber: this.personInfor.idcard
                }
                let posturl = '/api/imagehandle/downloadbynoanddate';
                yu.showLoading();
                this.interfaceRequest(posturl, data, "post", function(res) {
                    yu.hideLoading();
                    // alert('影像下载成功了');
                    let resData = res.data.data;
                    console.log('//////////下载')
                    console.log(res.data.data);
                    if (resData.returnCode == 'Success') {
                        resData.downloadImageOutVoList[0].downloadImageDtoList.forEach((item, index) => {
                            if (item.frontBackFlag == '2') {
                                that.IDFrontPath = 'data:image/jpg;base64,' + item.base64Code;
                                that.IDFrontName = item.originName;
                                that.IDFrontBase64 = item.base64Code;
                            } else if (item.frontBackFlag == '1') {
                                that.IDReversePath = 'data:image/jpg;base64,' + item.base64Code;
                                that.IDReverseName = item.originName;
                                that.IDReverseBase64 = item.base64Code;
                            }
                        });

                    }
                }, function(err) {
                    yu.hideLoading();
                    // alert('下载报错了！！');
                    console.log('//////////下载')
                    console.log(err);

                });
            },
            // 先6.7删除 再6.6新增 实现更新影像信息
            updatebyfilename() {
                let that = this;
                let data = {
                    busiSerialNo: this.busiSerialNoVal, //业务流水号
                    busiStartDate: this.busiStartDateVal, //业务日期
                    // batchId: this.batchId,
                    fileNameList: [this.IDFrontName, this.IDReverseName],
                    filePartName: 'LS_SQZL_P',
                    modelCode: 'LS_SQZL'
                }
                let posturl = '/api/imagehandle/deletebyfilename';
                yu.showLoading();
                this.interfaceRequest(posturl, data, "post", function(res) {
                    yu.hideLoading();
                    // alert('影像删除成功了');
                    if (res.data.data.returnCode != 'Success') {
                        yu.showToast({
                            title: res.data.data.returnDesc,
                            icon: 'none',
                            duration: 3000
                        });
                        return;
                    }
                    console.log(res)
                    that.uploadbybacthid();
                }, function(err) {
                    yu.hideLoading();
                    // alert('删除报错了！！');
                    that.pageJump('personInformation/personInformation')
                    console.log('//////////删除')
                    console.log(err);
                });
            },
            //6.9 删除从影像平台下载的文件和文件夹
            deletelocalfileandfolder() {
                let that = this;
                let posturl = '/api/imagehandle/deletedownloadfileandfolder';
                yu.showLoading();
                this.interfaceRequest(posturl, {}, "post", (res) => {
                    yu.hideLoading();
                    console.log(res)
                        // alert('文件夹删除成功了');
                }, function(err) {
                    console.log(err)
                    yu.hideLoading();
                    // alert('文件夹删除报错了！！');
                    //     uni.showToast({
                    //     title: '删除从影像平台下载的文件失败!',
                    //     duration: 2000
                    // });
                    that.pageJump('personInformation/personInformation')
                    console.log('//////////删除文件夹')
                    console.log(err);
                });
            },

            addName() {
                if (this.personInfor.nameUsedList.length >= 3) {
                    yu.showToast({
                        title: '最多可填3个曾用名',
                        icon: 'none',
                        duration: 3000
                    });
                    return;
                }
                this.personInfor.nameUsedList.push({
                    name: '',
                    isTipShow: false
                });
            },
            deleteName(e) {
                this.personInfor.nameUsedList.splice(e, 1);
            },
            relatedPersonChange(e) {
                this.relatedPersonIdx = e.target.value
            },
            // 下一步
            nextStep(isJump) {
                this.isJump = isJump;
                this.updatePersonalData();
                this.queryApplyInfoCommit({
                    orderNo: this.orderNoVal,
                    applyNo: this.applyNoVal
                }); //重新调'申请信息查询'接口，确保人员信息列表准确
            },
            // 3.7接口 个人信息更新
            updatePersonalData() {
                let that = this;
                let names = [];
                this.personInfor.nameUsedList.forEach((item, index) => {
                    names.push(item.name)
                });
                let data = {
                    userId: this.userInfor.loginCode,
                    certType: 'Ind01',
                    certId: this.personInfor.idcard,
                    customerName: this.personInfor.name,
                    formerlyName: names.join(','),
                    gender: this.personInfor.sex == '男' ? '1' : '2',
                    bornDate: this.personInfor.birthday.replace(/-/g, '/'),
                    nativeAdd: this.personInfor.ermanentAddress,
                    idexpiry: this.personInfor.date.replace(/-/g, '/'),
                    scene: 'cstScene',
                    applyNo: this.applyNoVal,
                    listName: 'houseInfo'
                }
                let posturl = "/api/credit/customerInfoUpdate";
                yu.showLoading();
                that.interfaceRequest(posturl, data, "post", function(res) {
                    yu.hideLoading();
                    let resArr = res.data.data;
                    if (resArr.returnCode == 'Success') {
                        that.updatebyfilename();
                    } else {
                        // alert('更新失败了！！')
                        yu.showToast({
                            title: resArr.returnDesc,
                            icon: 'none',
                            duration: 5000
                        });
                    }
                }, function(err) {
                    yu.hideLoading();
                    // alert('报错了！！')
                });
            },
            // 3.2接口 获取个人信息
            getPersonalData() {
                let that = this;
                let personalInformation = this.personalInformation;
                console.log('借款人-获取个人信息')
                console.log(personalInformation)
                let data = {
                    certType: personalInformation.certType,
                    certId: personalInformation.certId,
                    customerName: personalInformation.customerName,
                    scene: 'cstScene',
                    applyNo: this.applyNoVal
                }
                let posturl = "/api/front/perCustomerInfo";
                yu.showLoading();
                that.interfaceRequest(posturl, data, "post", function(res) {
                    yu.hideLoading();
                    let resData = res.data.data;
                    if (resData.returnCode == 'Success') {
                        // that.busiSerialNoVal = resData.imageBatchNo; //业务流水号
                        // that.busiStartDateVal = resData.imageUpLoadDate; //业务日期
                        that.personInfor.name = resData.customerName;
                        that.personInfor.idcard = resData.certId;
                        if (resData.gender == '1') {
                            that.personInfor.sex = '男'
                        } else if (resData.gender == '2') {
                            that.personInfor.sex = '女'
                        }
                        that.personInfor.birthday = resData.bornDate.replace(/\//g, '-');
                        that.personInfor.ermanentAddress = resData.nativeAdd;
                        console.log(resData.idexpiry)
                        if (resData.idexpiry != "") {
                            that.personInfor.date = resData.idexpiry.replace(/\//g, '-');
                            let dataString = resData.idexpiry.substring(0, 4);
                            if (dataString == '9999') {
                                that.maturityDateyBoolean = false;
                            } else {
                                that.maturityDateyBoolean = true;
                                that.personInfor.date = resData.idexpiry.replace(/\//g, '-');
                            }
                        }

                        var nameArr = resData.formerlyName.split(',');
                        that.personInfor.nameUsedList = [];
                        nameArr.forEach((item, index) => {
                            that.personInfor.nameUsedList.push({
                                name: item,
                                isTipShow: false
                            })
                        });
                        that.downloadbybatchid();
                    } else {
                        // alert('失败了！！')
                        yu.showToast({
                            title: res.data.data.returnDesc,
                            icon: 'none',
                            duration: 3000
                        });
                    }
                }, function(err) {
                    yu.hideLoading();
                    // alert('报错了！！')
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
                month = month > 9 ? month : '0' + month;
                day = day > 9 ? day : '0' + day;
                return `${year}-${month}-${day}`;
            }
        },
        mounted() {

        }
    };
</script>

<style lang='scss' scoped>
    .uni-container {
        background-color: #f6f8f9;
        padding-top: 0;
        padding-bottom: 30rpx;
        .household-content {
            padding-top: 270rpx;
            .form-title {
                height: 94rpx;
                line-height: 94rpx;
                text-align: center;
                font-size: 32rpx;
                color: #333333;
                padding-left: 40rpx;
                display: flex;
                vertical-align: middle;
                align-items: center;
                .vLine {
                    width: 10rpx;
                    height: 34rpx;
                    background: #3B86F7;
                    border-radius: 4px;
                    margin-right: 17rpx;
                }
            }
            .image-information {
                padding: 0 40rpx;
                // height: 421rpx;
                background: #ffffff;
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
                    margin-bottom: 24rpx;
                    .idcard-positive {
                        width: 310rpx;
                        height: 210rpx;
                        background-size: 310rpx 210rpx;
                        position: relative;
                    }
                    .idcard-negative {
                        width: 310rpx;
                        height: 210rpx;
                        position: relative;
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
                .collateral-site {
                    .contract-li {
                        uni-view:last-of-type {
                            justify-content: flex-start;
                            margin-left: 0;
                            color: #333435;
                        }
                    }
                }
            }
        }
    }
    
    .marginT25 {
        margin-top: 25rpx;
    }
    
    .contract-button {
        margin-bottom: 80rpx;
    }
</style>