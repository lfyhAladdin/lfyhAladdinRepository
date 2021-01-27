<template>
	<view class="uni-container">
        <view class="pf-poifixed">
            <view :class="phoneSystem ?'pf-title pf-title-ios pf-titleThree':'pf-title pf-titleThree'">
                <img src="@/static/images/profession/pf-back.svg" @click="backpf">
                <text>签署合同</text>
                <img src="@/static/images/profession/pf-screening.svg" class="pf-imgRig" @click="searchpf">
            </view>
            <view class="appro-fix">

                <view class="appro-tab" scroll-x="true" scroll-left="0" show-scrollbar="false" scroll-with-animation="true"
                :scroll-into-view="`applyPhase${applyPhase}`">
                    <view v-for="item in tabTitle" :key="item.id" :id="`applyPhase${item.id}`" :class="item.id == applyPhase ? 'appro-box tab-active' : 'appro-box'"
                    @click="tabClick(item.id)">
                        <view class="active-text">{{item.title}}</view>
                        <view class="active"></view>
                    </view>
                </view>
            </view>
        </view>
		<view class="pf-content appro-content">


			<!--tab页签内容-->
			<view class="tab-ul">
				<view class="tab-li" v-for="item in tabArr[applyPhase]" :key="item.applyNo">
					<view class="tab-li-features">
						<view>{{item.businessType2}}</view>
						<view class="tab-color-orange">{{item.status}}</view>
					</view>
					<view class="tab-li-content">
						<view class="tab-top">
							<text>{{item.customerName}}</text>
							<text>{{item.certID2}}</text>
						</view>
						<view class="tab-center" @click="toPerfectInformation(item)">
							<view>
								<text>{{housSwitch(item.businessType2,'楼盘名称','房屋位置')}}</text>
								<text>{{housSwitch(item.businessType2,item.projectName,item.address)}}</text>
							</view>
							<view>
								<text>合同金额</text>
								<text>{{item.businessSum2}}</text>
							</view>
							<view>
								<text>合同编号</text>
								<text>{{item.contractNo}}</text>
							</view>
							<view>
								<text>手机号码</text>
								<text>{{item.phoneNo}}</text>
							</view>
							<view>
								<text>审批通过时间</text>
								<text>{{item.occurDate}}</text>
							</view>
						</view>
						<view class="tab-bottom" v-if="item.status == '待补录押品'">
							<text @click="querypriceresult(item)">补录押品信息</text>
						</view>
						<view class="tab-bottom" v-if="item.status == '待发起入库'">
							<text @click="warehousing(item)">发起入库申请</text>
						</view>
						<view class="tab-bottom" v-if="item.status == '待签署'">
							<text @click="toPerfectInformation(item)">合同待生效</text>
						</view>
					</view>
				</view>
			</view>

			<!--加载更多提示-->
			<uni-load-more :status="status[applyPhase]" :icon-size="16" :content-text="contentText" />
		</view>
		<pfSearch :switchDrawer="switchDrawer" :applyPhase="applyPhase" :serviceStatesType="tabTitle" :pfSearchBusiness="pfSearchBusiness"
		 @professionSearch="professionSearch" @changeSearch="changeSearch">
		</pfSearch>


		<!--补录押品信息提示-->
		<view class="pSubmit-cover" v-if="coverAll">
			<view class="cover-submit">
				<view class="cover-title">
					<img src="@/static/images/creditsubmit/blackClose.svg" @click="cancel" />
					<text>补录押品信息</text>
				</view>
				<view class="contract-ul">
					<view class="contract-li">
						<text>房屋预售合同号</text>
						<input placeholder="请输入" type="text" class="iptcontract" v-model="houseContractNo" />

					</view>
                    <view class="contract-li">
						<text>确认房屋预售合同号</text>
						<input placeholder="再次输入房屋预售合同号" type="text" class="iptcontract" v-model="houseContractTwo" @blur="confirmInput"/>

					</view>
				</view>
				<view class="contract-button">
					<button type="primary" @click="submitSupplement" :disabled="isDisable">确定</button>
				</view>
			</view>
		</view>

		<!--补录押品信息提示(二手房)-->
		<view class="pSubmit-cover" v-if="twoHouseCollateral">
			<view class="cover-submit second-hand-mortgage">
				<view class="cover-title">
					<img src="@/static/images/creditsubmit/blackClose.svg" @click="twoCancel" />
					<text>补录押品信息</text>
				</view>
				<view class="contract-ul">
					<view class="contract-li">
						<text>不动产证编号</text>
						<input placeholder="不动产证编号" type="text" class="iptcontract" v-model="realEstateNo" />
					</view>
					<view class="contract-li">
						<text>权证号</text>
						<input placeholder="请输入" type="text" class="iptcontract" v-model="warrantNumber" />
					</view>
					<view class="contract-li">
						<text>权证到期日期</text>
						<picker mode="date" :value="date" :start="startDate" :end="endDate" @change="bindDateChange">
							<view class="uni-input">{{date}}</view>
						</picker>
						<img class="choose-arrow" src="@/static/images/firstroom/formChooseArrow.svg" />
					</view>
					<view class="contract-li">
						<text>权证登记机关</text>
						<input placeholder="请输入" type="text" class="iptcontract" @blur="authority" v-model="certificateRegistration" />
					</view>
                    <view class="contract-li">
						<text style="color:red">请确保该信息无误，若错误需要退件重新走审批流程</text>
						
					</view>
				</view>
				<view class="contract-button">
					<button type="primary" @click="submitTwo" :disabled="isDisable">确定</button>
				</view>
			</view>
		</view>



	</view>
</template>

<script>
    import {
        mapGetters,
        mapMutations,
        mapActions
    } from "vuex";
    import pfSearch from "../childModule/pfSearch.vue";
    import filter from "@/utils/filters";
    import uniLoadMore from "@/components/uni-load-more/uni-load-more.vue";
    export default {
        components: {
            pfSearch,
            uniLoadMore
        },
        data() {
            const currentDate = this.getDate({
                format: true
            });
            return {
                switchDrawer: false, //搜索弹窗是否显示
                showSupplement: false, //补录押品展示弹框
                // oneHouse: "一手房",
                // twoHouse: "二手房",
                oneCollateral: "1", //一手房押品
                twoCollateral: "2", //二手房押品
                oneTwoHouse: "profession/signContract/oneTwoHouse",
                isDisable: false,
                tabTitle: [{
                    title: "合同待签署",
                    id: "01"
                }, {
                    title: "合同已签署",
                    id: "02"
                }], //页签标题
                coverAll:false, //底部框
                houseContractNo: "", //预售合同号
                houseContractTwo: "", //确认预售合同号
                twoHouseCollateral:false, //二手房押品底部弹框(补录押品信息)
                tabArr: {}, //页签内容
                applyPhase: "", //申请阶段
                userID: "", //客户经理编号
                numNo: {
                    "01": {
                        beginNo: 1, //起始笔数
                        totalNo: 15, //查询笔数
                        numNo: 15 //基础笔数--每次笔数增加的个数
                    },
                    "02": {
                        beginNo: 1,
                        totalNo: 15,
                        numNo: 15
                    }
                }, //起始笔数
                filterCode: this.filterCode, //筛选字段
                businessType: "", //业务品种
                businessTypeList2: {}, //业务品种列表
                ajaxJudge: {
                    "01": true,
                    "02": true
                }, //第一次请求数据还是连续请求数据 --上拉加载
                status: {
                    "01": "more",
                    "02": "more"
                },
                contentText: {
                    contentdown: "上拉加载更多", //more
                    contentrefresh: "加载中", //loading
                    contentnomore: "没有更多" //noMore
                },
                reachBottom: {
                    "01": true,
                    "02": true
                }, //是否允许上拉加载

                //测试数据
                // contractList: [{
                //     address: "",
                //     applyNo: "2020090900000008",
                //     balance: "300000",
                //     beginDate: "2022/01/08",
                //     businessCurrency: "01",
                //     businessSum: "300000",
                //     businessType: "1140010",
                //     certId: "11010519711013294X",
                //     contractNo: "2020122100000002",
                //     customerName: "按揭一",
                //     endDate: "2032/01/08",
                //     occurDate: "2020/09/09",
                //     occurType: "010",
                //     operateOrgName: "廊坊银行营业部",
                //     orderNo: "",
                //     phoneNo: "13958612354",
                //     projectName: "龙河房地产按揭花园小区5期",
                //     renewTime: "",
                //     status: "01",
                //     synDate: null,
                //     synFlag: null,
                // }, {
                //     address: "",
                //     applyNo: "2020090900000009",
                //     balance: "300000",
                //     beginDate: "2022/01/08",
                //     businessCurrency: "01",
                //     businessSum: "300000",
                //     businessType: "1140010",
                //     certId: null,
                //     contractNo: "2020090900000007",
                //     customerName: "按揭一",
                //     endDate: "2032/01/08",
                //     occurDate: "2020/09/09",
                //     occurType: "010",
                //     operateOrgName: "廊坊银行营业部",
                //     orderNo: "",
                //     phoneNo: "13958612354",
                //     projectName: "龙河房地产按揭花园小区5期",
                //     renewTime: "",
                //     status: "02",
                //     synDate: null,
                //     synFlag: null,
                // }, {
                //     address: "",
                //     applyNo: "20200909000000010",
                //     balance: "300000",
                //     beginDate: "2022/01/08",
                //     businessCurrency: "01",
                //     businessSum: "300000",
                //     businessType: "1140010",
                //     certId: null,
                //     contractNo: "2020090900000007",
                //     customerName: "按揭一",
                //     endDate: "2032/01/08",
                //     occurDate: "2020/09/09",
                //     occurType: "010",
                //     operateOrgName: "廊坊银行营业部",
                //     orderNo: "",
                //     phoneNo: "13958612354",
                //     projectName: "龙河房地产按揭花园小区5期",
                //     renewTime: "",
                //     status: "03",
                //     synDate: null,
                //     synFlag: null,
                // }, {
                //     address: "",
                //     applyNo: "20200909000000011",
                //     balance: "300000",
                //     beginDate: "2022/01/08",
                //     businessCurrency: "01",
                //     businessSum: "300000",
                //     businessType: "1140020",
                //     certId: null,
                //     contractNo: "2020090900000007",
                //     customerName: "按揭一",
                //     endDate: "2032/01/08",
                //     occurDate: "2020/09/09",
                //     occurType: "010",
                //     operateOrgName: "廊坊银行营业部",
                //     orderNo: "",
                //     phoneNo: "13958612354",
                //     projectName: "龙河房地产按揭花园小区5期",
                //     renewTime: "",
                //     status: "04",
                //     synDate: null,
                //     synFlag: null,
                // }, ],
                date: currentDate,
                realEstateNo: "", //不动产证编号
                warrantNumber: "", //权证号
                certificateRegistration: "", //权证登记机关
                preventResubmit: true, //防重复提交
            };
        },
        watch: {},
        computed: {
            ...mapGetters(["businessTypeList", "userInfor", "queryApplyInfoList", ]),
            startDate() {
                return this.getDate("start");
            },
            endDate() {
                return this.getDate("end");
            }
        },
        onLoad(options) {
            console.log(this.date);
            console.log(options);
            console.log(options.applyPhase);
            console.log(this.businessTypeList)
            console.log(this.businessTypeList2)
            this.pfSearchBusiness = this.businessTypeList;
            this.newTime = this.date.replace(/-/g, "/");
            console.log(this.newTime);
            if (options.applyPhase == undefined) {
                this.applyPhase = "01";
            } else {
                this.applyPhase = options.applyPhase;
            }

            console.log(this.queryApplyInfoList);
            this.collateralList = this.queryApplyInfoList.clrList;

            // this.confirmTrue = res.confirm;
            this.contractNo = options.name;
            console.log(this.confirmTrue);
            this.userID = this.userInfor.loginCode;
            if (this.applyPhase == "02") {
                this.querypriceapprapplyinfo();
            } else {
                this.queryApplyPhaseList();
            }
            console.log(this.userInfor);
            // if (this.confirmTrue == "true") {
            //   this.coverAll = true;
            // } else {
            //   this.coverAll = false;
            // }
        },
        onReady() {},
        onShareAppMessage() {},
        //下拉的生命周期
        onPullDownRefresh() {
            this.pullRefresh();
        },
        //页面滚动到底部的事件 -- 上拉加载
        onReachBottom() {
            console.log("上拉加载");
            this.GJGCRefreshFooter();
        },
        created() {
            console.log(this.businessTypeList, 1711111111111111111111);
        },
        methods: {
            ...mapMutations(["approvalIngListReplace", "signContractReplace"]),
            ...mapActions(["businessNumCommit"]),
            //页签切换
            tabClick(e) {
                console.log(e);
                this.applyPhase = e;
                console.log(this.ajaxJudge[e]);
                if (this.ajaxJudge[e]) {
                    if (e == "02") {
                        this.querypriceapprapplyinfo();
                    } else {
                        this.queryApplyPhaseList();
                    }
                } else {
                    console.log("不是第一次点击tab页签，不需要请求数据");
                }
            },
            //返回
            backpf() {
                // yu.navigateBack();
                // yu.navigateTo({
                //             url: 'index',
                //     });

                yu.switchTab({
                    url: "/pages/ebank/index/index"
                });
            },
            cancel() {
                this.coverAll = false;
            },
            twoCancel() {
                this.twoHouseCollateral = false;
            },
            //关闭
            changeSearch(e) {
                this.switchDrawer = false;
            },
            //搜索
            searchpf() {
                this.switchDrawer = true;
            },
            //业务品种转换
            businessList() {
                let obj = JSON.parse(JSON.stringify(this.businessTypeList));
                let obj2 = JSON.parse(JSON.stringify(this.businessTypeList));
                console.log(obj, "201000000000000000000000000000000000000000000000");
                for (let key in obj) {
                    obj[key] = obj[key].replace("个人", "");
                }
                for (let key in obj2) {
                    obj2[key] = obj2[key].replace("个人", "").replace("贷款", "");
                }
                this.businessTypeList = obj;
                // this.pfSearchBusiness = obj2;
                if (this.applyPhase == "02") {
                    this.querypriceapprapplyinfo();
                } else {
                    this.queryApplyPhaseList();
                }
            },
            //合同待签署阶段列表信息
            queryApplyPhaseList() {
                console.log(this.userID);
                this.tabArr[this.applyPhase] = [];
                let data = {
                    businessType: this.businessType,
                    userId: this.userID,
                    applyPhase: "01",
                    beginNo: this.numNo[this.applyPhase].beginNo, //起始笔数
                    totalNo: this.numNo[this.applyPhase].totalNo, //查询笔数
                    sortCode: "contractno",
                    filterCode: this.filterCode
                };
                this.interfaceRequest(
                    "/api/contract/busConListQuery",
                    data,
                    "post",
                    res => {
                        console.log(res, "合同待签署");
                        this.tabArr[this.applyPhase] = [];
                        console.log(res.data.data.contractList);
                        yu.stopPullDownRefresh(); //停止下拉刷新
                        let dataList = res.data.data.contractList;
                        // let dataList = this.contractList;
                        this.dataProcessing(dataList);

                        console.log(
                            this.tabArr[this.applyPhase],
                            "66666666666666666666666666666666"
                        );
                    },
                    function(err) {
                        console.log(err);
                    }
                );
            },
            //合同已签署列表查询
            querypriceapprapplyinfo(a, b) {
                console.log(a);
                console.log(b);
                if (a != undefined) {
                    this.numNo[this.applyPhase].beginNo = a;
                    this.tabArr[this.applyPhase] = [];
                    this.ajaxJudge[this.applyPhase] = true;
                }
                if (b != undefined) {
                    this.numNo[this.applyPhase].totalNo = b;
                    this.tabArr[this.applyPhase] = [];
                    this.ajaxJudge[this.applyPhase] = true;
                }
                let data = {
                    businessType: this.businessType,
                    userId: this.userID,
                    applyPhase: "02",
                    beginNo: this.numNo[this.applyPhase].beginNo, //起始笔数
                    totalNo: this.numNo[this.applyPhase].totalNo, //查询笔数
                    sortCode: "contractno",
                    filterCode: this.filterCode
                };
                this.interfaceRequest(
                    "/api/contract/busConListQuery",
                    data,
                    "post",
                    res => {
                        console.log(res, "合同已签署");

                        yu.stopPullDownRefresh(); //停止下拉刷新
                        // this.ajaxJudge[this.applyPhase] = true;
                        let dataList = res.data.data.contractList;
                        this.dataProcessing(dataList);
                        console.log(this.tabArr[this.applyPhase]);
                    },
                    function(err) {
                        console.log(err);
                    }
                );
            },

            //对请求后的数据处理
            dataProcessing(dataList) {
                yu.stopPullDownRefresh(); //停止下拉刷新
                if (this.ajaxJudge[this.applyPhase]) {
                    console.log(123);
                    // this.tabArr[this.applyPhase].forEach(item => {
                    // 	if (item.status == "05") {
                    // 		item.status = "已签署";
                    // 	}
                    // 	if (item.status == "04") {
                    // 		item.status = "入库审批中";
                    // 	}
                    // 	if (item.status == "03") {
                    // 		item.status = "待发起入库";
                    // 	}
                    // 	if (item.status == "02") {
                    // 		item.status = "待补录押品";
                    // 	}
                    // 	if (item.status == "01") {
                    // 		item.status = "待签署";
                    // 	}
                    // 	if (item.businessType == "1140010") {
                    // 		item.businessType = "个人一手住房贷款";
                    // 	}
                    // 	if (item.businessType == "1140020") {
                    // 		item.businessType = "个人二手住房贷款";
                    // 	}
                    // 	if (item.businessType == "1140120") {
                    // 		item.businessType = "个人二手商用房贷款";
                    // 	}
                    // 	if (item.businessType == "1140110") {
                    // 		item.businessType = "个人一手商用房贷款";
                    // 	}
                    // });
                    if (dataList != null) {
                        if (dataList.length < this.numNo[this.applyPhase].totalNo) {
                            this.status[this.applyPhase] = "noMore";
                            this.reachBottom[this.applyPhase] = false;
                        } else {
                            this.status[this.applyPhase] = "more";
                        }
                        this.tabArr[this.applyPhase] = this.businessVarieties(dataList);
                        this.ajaxJudge[this.applyPhase] = false;
                        this.$forceUpdate(); //强制页面刷新
                    } else {
                        this.tabArr[this.applyPhase] = [];
                        this.status[this.applyPhase] = "noMore";
                        this.reachBottom[this.applyPhase] = false;
                    }
                } else {
                    console.log(456);
                    if (dataList != null) {
                        this.tabArr[this.applyPhase] = this.tabArr[this.applyPhase].concat(
                            this.businessVarieties(dataList)
                        );
                        this.status[this.applyPhase] = "more";
                    } else {
                        this.tabArr[this.applyPhase] = this.tabArr[this.applyPhase].concat(
                            []
                        );
                        this.status[this.applyPhase] = "noMore";
                        this.reachBottom[this.applyPhase] = false;
                    }
                }
            },

            //补录押品
            querypriceresult(e) {
                console.log(e);
                this.contractNo = e.contractNo;
                this.businessTypeInfo = e.businessType;
                this.customerNa = e.customerName;
                if (
                    this.businessTypeInfo == "1140010" || this.businessTypeInfo == "1140110"
                ) {
                    this.coverAll = true;
                } else {
                    this.twoHouseCollateral = true;
                }
            },
            //搜索
            professionSearch(e) {
                console.log(e);
                this.screenReset();
                this.switchDrawer = false;
                this.filterCode = e.filterCode;
                this.businessType = e.businessType;
                this.applyPhase = e.applyPhase;
                if (e.applyPhase == "02") {
                    this.querypriceapprapplyinfo();
                } else {
                    this.queryApplyPhaseList();
                }
            },

            //业务品种、定价结果匹配
            businessVarieties(e) {
                console.log(e, "和0000000000");

                e.forEach(item => {
                    if (item.status == "05") {
                        item.status = "已签署";
                        console.log(item.status, "已签署2222");
                    }
                    if (item.status == "04") {
                        item.status = "入库审批中";
                    }
                    if (item.status == "03") {
                        item.status = "待发起入库";
                    }
                    if (item.status == "02") {
                        item.status = "待补录押品";
                    }
                    if (item.status == "01") {
                        item.status = "待签署";
                    }
                    // if (item.businessType == "1140010") {
                    //     item.businessType = "个人一手住房贷款";
                    // }
                    // if (item.businessType == "1140020") {
                    //     item.businessType = "个人二手住房贷款";
                    // }
                    // if (item.businessType == "1140120") {
                    //     item.businessType = "个人二手商用房贷款";
                    // }
                    // if (item.businessType == "1140110") {
                    //     item.businessType = "个人一手商用房贷款";
                    // }
                });

                if (e == null || e.length == 0) {
                    return [];
                }
                let arr = this.businessTypeList; //业务品种
                e.forEach(item => {
                    item.certID2 = filter.cardIDNoHideFormat(item.certID);
                    item.businessSum2 = filter.moneyFormat(item.businessSum) + "元";

                    for (let key in arr) {
                        if (item.businessType == key) {
                            item.businessType2 = arr[key];
                        }
                    }
                });


                return e;
            },
            //一手、二手房显示区分
            housSwitch(hous, nameA, nameB) {
                return hous.includes("一手") ? nameA : nameB;
            },
            //筛选后，重置
            screenReset() {
                this.ajaxJudge = {
                    "01": true,
                    "02": true
                };
                this.status = {
                    "01": "more",
                    "02": "more"
                };
                this.reachBottom = {
                    "01": true,
                    "02": true
                };
            },
            //上拉加载
            GJGCRefreshFooter() {
                if (this.reachBottom[this.applyPhase]) {
                    if (this.status[this.applyPhase] != "loading") {
                        this.numNo[this.applyPhase].beginNo += this.numNo[
                            this.applyPhase
                        ].numNo;
                        this.numNo[this.applyPhase].totalNo += this.numNo[
                            this.applyPhase
                        ].numNo;
                        this.status[this.applyPhase] = "loading";
                        if (this.applyPhase == "02") {
                            this.querypriceapprapplyinfo();
                        } else {
                            this.queryApplyPhaseList();
                        }
                    } else {
                        console.log("正在加载中，不允许上拉加载");
                    }
                } else {
                    console.log("没有更多数据，不允许上拉加载");
                }
            },
            //下拉刷新
            pullRefresh() {
                this.ajaxJudge[this.applyPhase] = true;
                this.reachBottom[this.applyPhase] = true;
                this.status[this.applyPhase] = "more";
                this.numNo[this.applyPhase].beginNo = 1;
                this.numNo[this.applyPhase].totalNo = this.numNo[this.applyPhase].numNo;
                if (this.applyPhase == "02") {
                    this.querypriceapprapplyinfo();
                } else {
                    this.queryApplyPhaseList();
                }
            },
            //跳转到一手房
            toPerfectInformation(e) {
                console.log(e, "调整");
                this.houseData = e;
                this.contractNo = this.houseData.contractNo;
                // this.showPromt = false;
                // this.approvalIngListReplace(e);
                // console.log(this.approvalIngListReplace(e));
                // this.getcollateralInfoQuery(e); //补录押品信息查询
                // yu.navigateTo({ url: '/pages/ebank/perfectInformation/perfectInformation' });

                if (this.houseData.status != "待签署") {
                    return false;
                } else {
                    // this.$router.push({
                    //     path: "oneTwoHouse",
                    //     query: {
                    //         fxdata: JSON.stringify(this.houseData),
                    //     }
                    // });
                    this.signContractReplace(this.houseData);

                    yu.navigateTo({
                        url: "oneTwoHouse"
                    });
                }
            },

            //  goDetailPage(url) {
            //    console.log("一手房")

            //         this.pageJump(url+'?oneHouse='+this.oneHouse)
            //         console.log(this.housData,"房子嘻嘻")
            //       }

            goOneHouse() {
                this.$router.push({
                    path: "oneTwoHouse",
                    query: {
                        fxdata: JSON.stringify(this.houseData),
                        houseTitle: this.oneHouse
                    }
                }); //对象转为字符串
            },

            goTwoHouse() {
                this.$router.push({
                    path: "oneTwoHouse",
                    query: {
                        fxdata: JSON.stringify(this.houseData),
                        houseTitle: this.twoHouse
                    }
                }); //对象转为字符串
            },
            //补录押品
            goSupplement(data) {
                console.log(data);
                this.showSupplement = false;
                this.coverAll = true;
            },
            //发起入库申请
            warehousing(res) {
                console.log(res);
                console.log(this.preventResubmit);

                if (!this.preventResubmit) {
                    yu.showModal({
                        content: '操作进行中，请稍等',
                        showCancel: false,
                        cancelText: "确定",
                        success: function(res) {
                            if (res.confirm) {
                                console.log('用户点击确定');
                            }
                        }
                    });
                    return;
                };




                if (res.businessType == "1140020" || res.businessType == "1140120") {
                    let data = {
                        orderNo: "",
                        contractNo: res.contractNo //合同编号
                    };
                    this.preventResubmit = false;
                    this.interfaceRequest(
                        "/api/contract/wareApply",
                        data,
                        "post",
                        res => {
                            console.log(res);
                            this.successMsg = res.data.data.returnDesc;
                            console.log(this.message);
                            this.preventResubmit = true;
                            if (res.data.data.returnCode=="Failed") {
                                yu.showModal({
                                    title: "申请失败",
                                    content: this.successMsg,
                                    showCancel: false,
                                    confirmText: "我知道了",
                                    success: res => {
                                        if (res.confirm) {
                                            console.log("用户点击确定");
                                        }
                                    }
                                });
                            } else {
                                // this.successMsg = res.data.data.returnDesc;
                                yu.showModal({
                                    title: "申请状态",
                                    content: this.successMsg,
                                    showCancel: false,
                                    confirmText: "我知道了",
                                    success: res => {
                                        if (res.confirm) {
                                            console.log("用户点击确定");
                                            this.$forceUpdate(); //强制页面刷新
                                            this.beginNoData = 1; //起始笔数
                                            this.totalNoData = 15; //查询笔数
                                            this.querypriceapprapplyinfo(
                                                this.beginNoData,
                                                this.totalNoData
                                            );
                                            this.queryApplyPhaseList();
                                        }
                                    }
                                });
                            }
                        },
                        function(err) {
                            console.log(err);
                        }
                    );
                } else {  //一手房不用入库
                    yu.showModal({
                        title: "申请成功",
                        content: "已自动签署",
                        showCancel: false,
                        confirmText: "我知道了",
                        success: res => {
                            if (res.confirm) {
                                console.log("用户点击确定");
                            }
                        }
                    });
                }
            },

            //补录押品确定提交
            submitSupplement() {
                this.coverAll = false;
                this.isDisable = true;
                console.log(this.businessTypeInfo);
                let data = {
                    contractNo: this.contractNo,
                    clrId: this.clrId,
                    realtyPresaleNo: this.houseContractNo,
                    rightCertList: [{
                            rightCertName: "",
                            rightCertNo: "",
                            rightCertType: "",
                            rightBeginrDate: "",
                            rightExprDate: "",
                            rightRegInst: "",
                            rightRegDate: "",
                            possessorType: "",
                            obigeeName: "",
                            memo: ""
                        }]
                        // rightCertList: [{
                        //     rightCertName: "房产证",
                        //     rightCertNo: "廊坊市房权证廊字第201314810",
                        //     rightCertType: "2010",
                        //     rightBeginrDate: "2020/11/03",
                        //     rightExprDate: "2020/11/03",
                        //     rightRegInst: "廊坊市房产局",
                        //     rightRegDate: "2020/11/03",
                        //     possessorType: "01",
                        //     obigeeName: "解对正",
                        //     memo: "备注信息"
                        // }]
                        // rightCertList: this.rightCertInfoList,
                };
                this.interfaceRequest(
                    "/api/contract/collateralInfoAdd",
                    data,
                    "post",
                    res => {
                        this.houseContractNo="";
                        this.houseContractTwo="";
                        console.log(res, "押品信息补录一手房");
                        this.messageData = res.data.data.returnCode;
                        setTimeout(() => {
                            this.isDisable = false;
                        }, 1000);
                        if (this.messageData=="Failed") {
                            yu.showModal({
                                title: "补录失败！",
                                content: res.data.data.returnDesc,
                                success: res => {
                                    this.$forceUpdate(); //强制页面刷新

                                    if (res.confirm) {
                                        console.log("用户点击确定");
                                    } else if (res.cancel) {
                                        console.log("用户点击取消");
                                    }
                                }
                            });
                        } else {
                            yu.showModal({
                                title: "补录完成",
                                content: "补录押品完成",
                                success: res => {
                                    this.$forceUpdate(); //强制页面刷新
                                    this.beginNoData = 1; //起始笔数
                                    this.totalNoData = 15; //查询笔数
                                    this.querypriceapprapplyinfo(
                                        this.beginNoData,
                                        this.totalNoData
                                    );
                                    if (res.confirm) {
                                        console.log("用户点击确定");
                                        console.log(this.businessTypeInfo);

                                        // this.pageJump(this.signTheContract);
                                    } else if (res.cancel) {
                                        console.log("用户点击取消");
                                    }
                                }
                            });
                        }
                    },
                    function(err) {
                        console.log(err);
                    }
                );
            },
            // 二手房补录押品信息
            submitTwo() {
                if (this.realEstateNo == "") {
                    yu.showModal({
                        title: "补录失败！",
                        content: "请输入不动产证编号！",
                        success: res => {
                            if (res.confirm) {
                                console.log("用户点击确定");
                            } else if (res.cancel) {
                                console.log("用户点击取消");
                            }
                        }
                    });
                    return false;
                }
                if (this.warrantNumber == "") {
                    yu.showModal({
                        title: "补录失败！",
                        content: "请输入权证号！",
                        success: res => {
                            if (res.confirm) {
                                console.log("用户点击确定");
                            } else if (res.cancel) {
                                console.log("用户点击取消");
                            }
                        }
                    });
                    return false;
                }

                if (this.certificateRegistration == "") {
                    yu.showModal({
                        title: "补录失败！",
                        content: "请输入权证登记机关！",
                        success: res => {
                            if (res.confirm) {
                                console.log("用户点击确定");
                            } else if (res.cancel) {
                                console.log("用户点击取消");
                            }
                        }
                    });
                    return false;
                }

                console.log("二手房补录押品信息");
                this.twoHouseCollateral = false;
                this.isDisable = true;

                let data = {
                    contractNo: this.contractNo,
                    clrId: this.clrId,
                    realtyPresaleNo: "",

                    realtyCertNo: this.realEstateNo, //不动产证编号
                    rightCertList: [{
                            rightCertName: "",
                            rightCertNo: this.warrantNumber, //权证号
                            rightCertType: "",
                            rightBeginrDate: "",
                            rightExprDate: this.newTime, //权证到期日期
                            rightRegInst: this.certificateRegistration, //权证登记机关
                            rightRegDate: "",
                            possessorType: "",
                            obigeeName: "",
                            memo: "",
                            obigeeName: this.customerNa
                        }]
                        // rightCertList: this.rightCertInfoList,
                };
                yu.showLoading();
                this.interfaceRequest(
                    "/api/contract/collateralInfoAdd",
                    data,
                    "post",
                    res => {
                        console.log(res, "押品信息补录二手房");
                        this.realEstateNo="";
                        this.warrantNumber="";
                        this.bindDateChange="";
                        this.certificateRegistration="";
                        console.log(this.realEstateNo,"不动产证编号")
                        console.log(this.warrantNumber,"2")
                        console.log(this.bindDateChange,"3")
                        console.log(this.certificateRegistration,"4")
                        setTimeout(() => {
                            this.isDisable = false;
                        }, 1000);
                        yu.hideLoading();
                        console.log(res.data.message);
                        this.failedMessage = res.data.data.returnCode;

                        if (this.failedMessage=="Failed") {
                            yu.showModal({
                                title: "补录失败！",
                                content:res.data.data.returnDesc,
                                success: res => {
                                    this.$forceUpdate(); //强制页面刷新

                                    if (res.confirm) {
                                        console.log("用户点击确定");
                                    } else if (res.cancel) {
                                        console.log("用户点击取消");
                                    }
                                }
                            });
                        } else {
                            yu.showModal({
                                title: "补录完成",
                                content: "补录完成",
                                success: res => {
                                    this.$forceUpdate(); //强制页面刷新

                                    this.beginNoData = 1; //起始笔数
                                    this.totalNoData = 15; //查询笔数
                                    this.querypriceapprapplyinfo(
                                        this.beginNoData,
                                        this.totalNoData
                                    );
                                    if (res.confirm) {
                                        console.log("用户点击确定");
                                        console.log(this.businessTypeInfo);

                                        // this.pageJump(this.signTheContract);
                                    } else if (res.cancel) {
                                        console.log("用户点击取消");
                                    }
                                }
                            });
                        }
                    },
                    function(err) {
                        console.log(err);
                    }
                );
            },
            //权证登记机关验证
            authority() {
                console.log(11);
                let regStr = /[\uD83C|\uD83D|\uD83E][\uDC00-\uDFFF][\u200D|\uFE0F]|[\uD83C|\uD83D|\uD83E][\uDC00-\uDFFF]|[0-9|*|#]\uFE0F\u20E3|[0-9|#]\u20E3|[\u203C-\u3299]\uFE0F\u200D|[\u203C-\u3299]\uFE0F|[\u2122-\u2B55]|\u303D|[\A9|\AE]\u3030|\uA9|\uAE|\u3030/gi;

                if (regStr.test(this.certificateRegistration)) {
                    this.certificateRegistration = this.certificateRegistration.replace(
                        regStr,
                        ""
                    );
                }
            },
            //房屋预售合同号确认
            confirmInput() {
                if (this.houseContractTwo !== this.houseContractNo) {
                    yu.showModal({
                        title: "房屋预售合同号不一致！",
                        content: "请输入一致的房屋预售合同号！",
                        success: res => {
                            if (res.confirm) {
                                console.log("用户点击确定");
                            } else if (res.cancel) {
                                console.log("用户点击取消");
                            }
                        }
                    });
                    this.houseContractTwo = "";
                    return false;
                }
            },
            bindDateChange: function(e) {
                console.log(e);
                this.date = e.target.value;
                this.newTime = this.date.replace(/-/g, "/");
                console.log(this.newTime);
            },
            getDate(type) {
                const date = new Date();
                let year = date.getFullYear();
                let month = date.getMonth() + 1;
                let day = date.getDate();

                if (type === "start") {
                    year = year - 60;
                } else if (type === "end") {
                    year = year + 100;
                }
                month = month > 9 ? month : "0" + month;
                day = day > 9 ? day : "0" + day;
                return `${year}-${month}-${day}`;
            }
        }
    };
</script>
<style lang='scss'>
    @import "~@styles/uni-nvue.css";
    .uni-container {
        background-color: #ffffff;
        padding: 0 0 30rpx 0;
        .appro-content {
            padding-top: 228rpx;
            .tab-ul {
                padding: 24rpx 30rpx;
            }
        }
        .pf-poifixed {
            .appro-fix {
                .appro-tab {
                    justify-content: flex-start;
                }
            }
        }
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
    
    .pSubmit-cover {
        height: 100%;
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: rgba(0, 0, 0, 0.65);
        z-index: 99;
        .cover-submit {
            width: 100%;
            height:720rpx;
            background: #ffffff;
            border-radius: 20rpx 20rpx 0 0;
            position: absolute;
            bottom: 0;
            .cover-title {
                height: 60rpx;
                line-height: 60rpx;
                text-align: center;
                font-size: 36rpx;
                color: #333333;
                padding: 38rpx 30rpx;
                font-weight: 600;
                display: flex;
                justify-content: center;
                align-items: center;
                img {
                    width: 20rpx;
                    position: absolute;
                    left: 40rpx;
                }
            }
            .contract-ul {
                .contract-li {
                    display: flex;
                    justify-content: space-between;
                    text-align: center;
                    height: 50rpx;
                    font-size: 32rpx;
                    uni-view:last-of-type {
                        color: #333435;
                    }
                    .iptcontract {
                        text-align: right;
                    }
                    picker{
                        width: 60%;
                    }
                    .choose-arrow {
                       margin-left: -70rpx;
                    }
                }
                .contract-li:last-of-type {
                    border-bottom: 2rpx solid #e5e5e5;
                }
            }
            .contract-button {
                uni-button {
                    width: 330rpx;
                    box-shadow: 0rpx 10rpx 23rpx 0rpx rgba(59, 134, 247, 0.4);
                    border-radius: 50rpx;
                }
            }
        }
        .second-hand-mortgage {
            height: 1000rpx;
        }
    }
</style>