<template>
  <div class="finish">
    <!-- 头部 -->
    <div
      v-if="
        [
          'finishDetailsTask',
          'finishDetailsDocument',
          'finishDetailsBill',
          'finishDetailsDynamic'
        ].includes($route.name)
      "
      class="dgg-order-nav"
    >
      <span class="dgg-order-state">{{ transactionItem.orderStatusName }}</span>

      <el-menu
        :default-active="defaultActive"
        class="dgg-submenu-nav"
        mode="horizontal"
      >
        <el-menu-item key="1" index="1" @click="menuJump('finishDetailsTask')"
          >任务</el-menu-item
        >
        <el-menu-item
          key="2"
          index="2"
          @click="menuJump('finishDetailsDocument')"
          >文档</el-menu-item
        >
        <!--  <el-menu-item key="3" index="3" @click="menuJump('finishDetailsBill')"
          >底单</el-menu-item
        > -->
        <el-menu-item
          key="4"
          index="4"
          @click="menuJump('finishDetailsDynamic')"
          >动态</el-menu-item
        >
      </el-menu>
      <div class="dgg-details-member">
        <div class="memberImgLists">
          <el-image
            v-for="member in memberImgLists"
            :key="member"
            :src="member"
            style="width: 27px; height: 27px"
            fit="cover"
          />
        </div>
        <dgg-icon
          class="more-member"
          icon-class="icon_more"
          svg-width="26px"
          svg-height="26px"
          @click="openMemberSet"
        />
      </div>
    </div>
    <!-- 列表 -->
    <div v-show="$route.name === 'finish'" class="tabs-item-head">
      <div>
        <dgg-icon
          :icon-class="searchState ? 'icon_screen_selected' : 'icon_screen'"
          class="dgg-search"
          svg-width="15px"
          svg-height="15px"
          @click="searchState = !searchState"
        />
        <!-- @input="searchData = searchData.replace(/\s+/g, '')" -->
        <dgg-input
          v-model="searchData"
          :maxlength="30"
          class="search"
          placeholder="客户名称/生产单编号"
          oninput="this.value=this.value.replace(/\s/g,'')"
        >
          <dgg-icon
            slot="prefix"
            icon-class="dgg-search"
            svg-width="15px"
            svg-height="15px"
          />
        </dgg-input>
        <dgg-button
          v-if="!searchState"
          plain
          class="receive-button default-btn-with"
          @click="searchClick"
        >
          搜 索
        </dgg-button>
        <dgg-button
          v-if="!searchState"
          plain
          class="dgg-button-nocolor default-btn-with"
          @click="resetClick"
        >
          重 置
        </dgg-button>
        <div class="fr finish-radio">
          <dgg-radio-group
            :active-data="activeData"
            :is-button="true"
            :radio-array="radioArray"
            :space="0"
            @change="change"
          />
        </div>
      </div>

      <div v-if="searchState" class="tabs-item-query">
        <dgg-query
          ref="query"
          :query-list="queryList"
          :can-export="false"
          clear-value
          @resetEvent="resetQuery"
          @search="search"
          @changeEvent="queryEmit"
        />
      </div>
    </div>

    <div
      v-show="$route.name === 'finish'"
      v-if="activeData === '1'"
      class="finish-body"
    >
      <dgg-edit-table
        :data="dataList.records"
        :columns="columns"
        :request-data-api="get_order_model_by_status"
        :params="params"
        :page-info="dataList.total"
        @row-click="rowClick"
      />
    </div>
    <div
      v-show="$route.name === 'finish'"
      v-if="activeData === '2'"
      class="finish-body"
    >
      <dgg-edit-table
        :data="productList.records"
        :columns="columnsProduct"
        :request-data-api="get_product_model_by_status"
        :params="productParams"
        :page-info="productList.totalPage"
        @row-click="rowClick"
      />
    </div>
    <el-drawer
      v-if="memberSet"
      :visible.sync="memberSetDrawer"
      :modal-append-to-body="false"
      :before-close="memberSetClose"
      :append-to-body="false"
      :modal="false"
      title="成员设置"
      direction="rtl"
      custom-class="order-member-set"
      style="position: absolute;"
      size="300px"
    >
      <div class="dgg-member-info">
        <div class="person-charge">
          <p class="top">
            <span>项目负责人</span>
            <!-- <dgg-button
              dgg-icon="icon_change"
              class="brabBill-button"
              @click="changeProjectMember($event, 'manager')"
              >更换</dgg-button
            > -->
            <!-- <transactorProp
              :up-all-pop="toTransactor_1"
              :top="teamMemberTop"
              :left="'50%'"
              :tab-names="tabNames"
              :count="transactorData"
              :currentTab="storeFlagUser"
              :chooseStoreId="thisCheckedStoreId"
              :thisStoreRealName="thisStoreRealName"
              :thisStorePhone="thisStorePhone"
              @Clickoutside="closeStoreProp"
              @changeStoreFlagUser="changeStoreFlagUser"
              @storeKeyWordsFn="storeKeyWordsFn"
              @clearNamePhone="clearNamePhone"
              @chooseStoreDataFn="chooseStoreDataFn"
              @load="load"
            /> -->
          </p>
          <p class="bottom" v-if="Object.keys(this.projectManager).length > 0">
            <img
              :src="
                projectManager.addressHandlerPicture
                  ? projectManager.addressHandlerPicture
                  : taskTransactorImg
              "
              class="headImg"
              alt=""
            /><span>{{ projectManager.memberName }}</span>
          </p>
        </div>

        <div class="project-members">
          <p class="top">
            <span>项目成员</span>
            <!-- <dgg-button
              dgg-icon="dgg-plus"
              class="brabBill-button"
              @click="changeProjectMember($event, 'member')"
              >添加</dgg-button> -->
          </p>
        </div>

        <ul class="members-list">
          <li
            v-for="(item, index) in assistHandle"
            :key="index"
            class="current-list"
          >
            <div class="left">
              <img
                :src="item.addressHandlerPicture"
                alt=""
                class="headImg"
                :onerror="errorTaskTransactorImg"
              />
              <span>{{ item.memberName }}</span>
              <!-- <dgg-icon
                icon-class="cancel_distribution"
                svg-width="16px"
                svg-height="16px"
                class="cancel-merber-icon"
                @click="deleteUser(item)"
              /> -->
            </div>
            <span>{{ item.phoneNumber }}</span>
          </li>
        </ul>
      </div>
    </el-drawer>
    <fixedNotice :top="658" type="phone" />
    <router-view />
  </div>
</template>

<script>
// 加载页
// eslint-disable-next-line no-unused-vars
import { mapState, mapActions, mapMutations } from "vuex";
import moment from "moment";
import fixedNotice from "@/views/main/page/components/fixedNotice.vue";
import Notification from "@/componentsEl/notification/index.js";
import taskTransactorImg from "@/assets/images/image_portrait_fault.png";

export default {
  name: "Finish",
  components: {
    fixedNotice
  },
  data() {
    return {
      // ---------------张浪添加
      taskTransactorImg: taskTransactorImg, //办理人默认头像
      toTransactor_1: false,
      teamMemberTop: "",
      tabNames: ["本店成员", "外部合作"], // 办理人切换标题
      transactorData: [], //选择店铺数据
      storeFlagUser: 0, //默认本店店铺
      thisCheckedStoreId: "", //选定的办理人id
      thisStoreRealName: "", //搜索办理人姓名关键字
      thisStorePhone: "", //搜索办理人手机号
      type: "",
      teamMemberTop: "",
      //------------------------
      searchKey: "", // 搜索关键字
      orderStateVal: "", // 左侧订单状态值
      projectManager: {},
      memberSettingDialog: false,
      memberSettingDialogTitle: "添加成员",
      memberSettingDialogOption: [],
      memberSettingDialogValue: "",
      memberSettingDialogMultiple: false,
      assistHandle: [],
      memberSetDrawer: false,
      // memberImgLists: [
      //   'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg',
      //   'https://cube.elemecdn.com/6/94/4d3ea53c084bad6931a56d5158a48jpeg.jpeg',
      //   'https://fuss10.elemecdn.com/a/3f/3302e58f9a181d2509f3dc0fa68b0jpeg.jpeg'
      // ],
      activeData: "1",
      radioArray: [
        {
          label: "订 单",
          value: "1"
        },
        {
          label: "产 品",
          value: "2"
        }
      ],
      activeName: "first",
      search1: "",
      searchState: false,
      columns: [
        {
          prop: "productName",
          width: "175",
          label: "业务产品",
          type: "isrender",
          render: (h, params) => {
            return (
              <div style="padding-bottom:5px;">
                <span style="border-bottom: 1px solid #10bbb8 !important;padding-bottom:3px;padding-right:3px;vertical-align: top;">
                  {params.row.businessProductName}
                </span>
                <span
                  class="dgg-text-ellip"
                  style="display:inline-block; width:90px;vertical-align: top;"
                >
                  {params.row.productName}
                </span>
              </div>
            );
          }
        },
        {
          prop: "scOrderNo",
          label: "生产单编号",
          width: "140",
          type: "isrender",
          render: (h, params) => {
            return (
              <div
                style="color:#10BBB8;cursor: pointer;"
                class="dgg-text-ellip"
                onClick={e => {
                  setTimeout(() => {});
                }}
              >
                {params.row.scOrderNo}
              </div>
            );
          }
        },
        { 
          prop: "customerName", 
          width: "160", 
          label: "客户名称" ,
          type: "isrender",
          render:(h, params)=>{
            return(<div class="dgg-text-ellip">{params.row.customerName}</div>)
          }
        },
        { prop: "region", width: "100", label: "办理地区" },
        { prop: "contractNo", label: "合同编号" },
        { prop: "proScAttrName", label: "产品属性" },
        { prop: "orderStatusName", label: "订单状态" },
        {
          label: "完成时间",
          width: "170",
          type: "isrender",
          render: (h, params) => {
            return <div class="dgg-text-ellip">{params.row.endTime}</div>;
          }
        }
      ],
      columnsProduct: [
        {
          prop: "productName",
          width: "380",
          label: "业务产品",
          type: "isrender",
          render: (h, params) => {
            return (
              <div style="height:90px;padding:20px 0;">
                <div style="line-height:20px;height:20px">
                  <span class="finish-name-lable">
                    <span
                      class={
                        parseInt(params.row.overdueStatus) === 1
                          ? "transaction-name-sate"
                          : parseInt(params.row.overdueStatus) === 2
                          ? "transaction-name-yewllo"
                          : ""
                      }
                    >
                      {parseInt(params.row.overdueStatus) === 1
                        ? "已超期"
                        : parseInt(params.row.overdueStatus) === 2
                        ? "即将到期"
                        : ""}
                    </span>
                    {params.row.productName}
                  </span>
                </div>
                <div
                  class="finish-name-cumtorName dgg-text-ellip"
                  style="display:inline-block; width:300px;vertical-align: top;"
                >
                  客户：{params.row.customerName}
                </div>
              </div>
            );
          }
        },
        {
          prop: "latestProgressNum",
          width: "370",
          label: "最新任务/进度",
          type: "isrender",
          render: (h, params) => {
            return (
              <div style="height:90px;padding:20px 0;">
                <div style="line-height:20px;height:20px">
                  <el-progress
                    percentage={new Number(
                      this.decimal(
                        isNaN(
                          parseInt(params.row.completeTaskNum) /
                            parseInt(params.row.taskTotal)
                        )
                          ? 0
                          : parseInt(params.row.completeTaskNum) /
                              parseInt(params.row.taskTotal)
                      ) * 100
                    ).toFixed()}
                    stroke-width={4}
                    style="width:220px"
                  ></el-progress>
                </div>
                <div class="transaction-name-cumtorName">
                  最新阶段：{params.row.latestCasePhaseName}
                </div>
              </div>
            );
          }
        },
        {
          prop: "projectMembers",
          width: "200",
          label: "负责人/办理人",
          type: "isrender",
          render: (h, params) => {
            const _arary = params.row.projectMembers;
            return (
              <div style="padding:20px 0;height:90px;">
                <div>
                  <el-tooltip class="msg-dot" effect="dark" placement="top">
                    <div slot="content">{params.row.projectManagerName}</div>
                    <el-image
                      style="width: 27px; height: 27px; border-radius: 27px;margin-right:5px"
                      src={
                        params.row.headPortrait
                          ? params.row.headPortrait
                          : taskTransactorImg
                      }
                    ></el-image>
                  </el-tooltip>
                </div>
                <div>
                  {_arary &&
                    _arary.length &&
                    _arary.map(item => {
                      return (
                        <el-tooltip
                          class="msg-dot"
                          effect="dark"
                          placement="top"
                        >
                          <div slot="content">{item.projectMembersName}</div>
                          <el-image
                            src={
                              item.headPortrait
                                ? item.headPortrait
                                : taskTransactorImg
                            }
                            style="width: 27px; height: 27px; border-radius: 27px;margin-right:5px"
                            fit="cover"
                          />
                        </el-tooltip>
                      );
                    })}
                </div>
              </div>
            );
          }
        },
        {
          prop: "orderDeadlineTimeStamp",
          label: "到期时间",
          type: "isrender",
          render: (h, params) => {
            return (
              <div
                class={
                  parseInt(params.row.overTimeStatus) === 3
                    ? "deadline-red"
                    : parseInt(params.row.overTimeStatus) === 2
                    ? "deadline-yellow"
                    : "deadline-text"
                }
              >
                {params.row.orderDeadline}
              </div>
            );
          }
        }
      ],
      searchData: "",
      paramsData: {},
      paramsSearchData: {}
    };
  },
  computed: {
    ...mapState([
      "userId",
      "transactionItem",
      "orderStatusName",
      "storeInfoData"
    ]),
    ...mapState("finishModule", ["dataList", "productList"]),
    ...mapState("orderModule", [
      "productOptions", // 业务
      "productDataList" // 产品
      // "orderStatusList" //订单状态数据
    ]),
    memberSet() {
      return [
        "finishDetailsTask",
        "finishDetailsDocument",
        "finishDetailsBill",
        "finishDetailsDynamic"
      ].includes(this.$route.name);
    },
    params() {
      return {
        ...this.paramsData
      };
    },
    productParams() {
      return {
        ...this.paramsData
      };
    },
    memberImgLists() {
      const imgArr = [];
      imgArr.push(this.projectManager.addressHandlerPicture);
      this.assistHandle.forEach((item, index) => {
        imgArr.push(item.addressHandlerPicture);
      });
      return imgArr;
    },
    queryList() {
      return [
        {
          field: "businessProductCode",
          type: "select",
          label: "业务",
          width: "220px",
          value: "",
          options:
            [
              ...[{ label: "全部", value: "" }],
              ...this.productOptions.map(item => {
                return {
                  value: item.code,
                  label: item.name
                };
              })
            ] || []
        },
        {
          field: "productId",
          type: "select",
          label: "产品",
          value: "",
          width: "220px",
          options:
            [
              ...[{ label: "全部", value: "" }],
              ...this.productDataList.map(item => {
                return {
                  value: item.id,
                  label: item.name
                };
              })
            ] || []
        },
        {
          field: ["startTime", "endTime"],
          type: "daterange",
          label: "时间",
          width: "220px",
          value: ""
        },
        {
          label: "佣金",
          width: "220px",
          children: [
            {
              field: "miniCommission",
              type: "input",
              label: "test1",
              width: "97px",
              placeholder: "最低",
              value: ""
            },
            {
              field: "maxCommission",
              type: "input",
              label: "test1",
              width: "97px",
              placeholder: "最高",
              value: ""
            }
          ]
        },
        {
          field: "teamName",
          type: "input",
          label: "团队",
          width: "220px",
          placeholder: "请输入",
          value: ""
        }
      ];
    },
    defaultActive() {
      let _key = "1";
      if (this.$route.name === "finishDetailsTask") {
        _key = "1";
      }
      if (this.$route.name === "finishDetailsDocument") {
        _key = "2";
      }
      if (this.$route.name === "finishDetailsBill") {
        _key = "3";
      }
      if (this.$route.name === "finishDetailsDynamic") {
        _key = "4";
      }
      return _key;
    }
  },
  watch: {
    async memberSet(val) {
      if (val) {
        const res = await this.get_assist_handle({
          zygsscId: this.transactionItem.id,
          searchWord: ""
        });
        if (res.code === 200) {
          if (res.data.length > 0) {
            this.assistHandle = res.data.filter((item, index, arr) => {
              return item.isManager == 0;
            });
            let formtatManagerData = res.data.filter((item, index, arr) => {
              return item.isManager == 1;
            });
            this.projectManager =
              formtatManagerData.length > 0 ? formtatManagerData[0] : {};
          } else {
            this.assistHandle = [];
            this.projectManager = {};
          }
        }
      }
    }
  },
  async mounted() {
    // 判断是否是产品模式
    if (this.$route.params && this.$route.params.tabindex === "productMode") {
      this.activeData = "2";
    }
    if (
      [
        "finishDetailsTask",
        "finishDetailsDocument",
        "finishDetailsBill",
        "finishDetailsDynamic"
      ].includes(this.$route.name)
    ) {
      const res = await this.get_assist_handle({
        zygsscId: this.transactionItem.id
      });
      if (res.code === 200) {
        if (res.data && res.data.length > 0) {
          this.assistHandle = res.data.filter((item, index, arr) => {
            return item.isManager == 0;
          });
          let formtatManagerData = res.data.filter((item, index, arr) => {
            return item.isManager == 1;
          });
          this.projectManager =
            formtatManagerData.length > 0 ? formtatManagerData[0] : {};
        } else {
          this.assistHandle = [];
          this.projectManager = {};
        }
      }
    }
  },
  activated() {
    //
  },
  created() {
    //判断是否订单模式或者产品模式
    if (sessionStorage.getItem("finishOrderModel")) {
      this.activeData = sessionStorage.getItem("finishOrderModel");
    }
  },
  beforeDestroy() {
    //
  },
  methods: {
    ...mapActions("orderModule", [
      "zysc_find_product" // 查询产品信息
    ]),
    ...mapActions(["ruoterJump"]),
    ...mapActions("finishModule", [
      "get_order_model_by_status", // 查询订单列表
      "get_product_model_by_status" // 查询产品列表
    ]),
    ...mapActions("transactionModule", [
      "get_assist_handle",

      "delete_assist_handle",
      "update_project_manager",
      "add_assist_handle"
    ]),
    ...mapMutations(["setTransactionItem", "setFinishOrderModel"]),
    ...mapActions("teamSettingModule", ["get_store_user"]),
    //-------------------张浪新增
    //关闭办理人店铺筛选
    closeStoreProp() {
      this.toTransactor_1 = false;
      this.storeFlagUser = 0; //改变为本店店铺
      this.thisCheckedStoreId = ""; //清空选定办理人id

      //清空办理人手机号和姓名
      this.clearNamePhone();
    },
    // 添加办理人选择框内tab切换
    changeStoreFlagUser(val) {
      this.storeFlagUser = val;
      //查询店铺信息
      this.requestStoreUser();
    },
    //获取关键字
    storeKeyWordsFn(state, val) {
      if (state == 0) {
        //0为本店铺
        this.thisStoreRealName = val;
      } else {
        //外部店铺
        this.thisStorePhone = val;
      }
      //查询店铺信息
      this.requestStoreUser();
    },
    //清空办理人手机号和姓名
    clearNamePhone() {
      this.thisStoreRealName = "";
      this.thisStorePhone = "";
    },
    //选定办理人Id
    async chooseStoreDataFn(item) {
      this.$nextTick(async () => {
        const params = {
          memberId: item.userId,
          memberName: item.realName,
          zygsscId: this.transactionItem.id,
          memberPhone: item.phone,
          isFeign: this.storeFlagUser //内部0 外部1
        };
        let res = "";
        if (this.type === "member") {
          // 添加成员
          res = await this.add_assist_handle(params);
        } else {
          params.storeId = this.transactionItem.teamId;
          res = await this.update_project_manager(params);
          // 修改管理
        }
        if (res.code === 200) {
          // 修改管理/添加成员成功，刷新列表
          this.toTransactor_1 = false;
          const res = await this.get_assist_handle({
            zygsscId: this.transactionItem.id
          });
          if (res.code === 200) {
            if (res.data && res.data.length > 0) {
              this.assistHandle = res.data.filter((item, index, arr) => {
                return item.isManager == 0;
              });
              let formtatManagerData = res.data.filter((item, index, arr) => {
                return item.isManager == 1;
              });
              this.projectManager =
                formtatManagerData.length > 0 ? formtatManagerData[0] : {};
            } else {
              this.assistHandle = [];
              this.projectManager = {};
            }
          }
        } else {
          this.$notify({
            message: res.message,
            type: "error",
            customClass: "dgg-tip-msg"
          });
        }
      });
    },
    // 选择办理人弹框内的列表无限加载
    load() {
      return;
      this.count += 2;
    },
    async changeProjectMember(event, type) {
      const evt = window.event || event;
      evt.preventDefault();
      evt.stopPropagation();
      this.requestStoreUser();
      this.toTransactor_1 = true;
      this.type = type;
      type === "member" && (this.teamMemberTop = "210px");
      type === "manager" && (this.teamMemberTop = "110px");
      return;
    },
    //查询店铺信息
    requestStoreUser() {
      if (this.transactionItem && this.transactionItem.teamId) {
        this.zygs_queryMemberNonMerchantVO({
          storeId: this.transactionItem.teamId, //店铺ID
          userName: this.thisStoreRealName, //用户姓名，只有flag为0时有效
          phoneNumber: this.thisStorePhone, //手机号
          isOutside: this.storeFlagUser, //0:获取本店铺的用户 1：获取店铺外的店铺
          zygsscId: this.transactionItem.id
        })
          .then(res => {
            if (res.code == 200) {
              this.transactorData = res.data;
            }
          })
          .catch(error => {});
      }
    },
    //--------------------新增结束
    // 删除 项目成员
    deleteUser(item) {
      this.$confirm("是否确定删除项目成员", "删除成员", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          const res = await this.delete_assist_handle({
            id: this.transactionItem.id,
            userId: item.userId
          });
          if (res.code !== 200) {
            this.$notify({
              message: res.message,
              type: "error",
              customClass: "dgg-tip-msg"
            });
          }
          const resp = await this.get_assist_handle({
            zygsscId: this.transactionItem.id
          });
          if (resp.code === 200) {
            if (res.data && res.data.length > 0) {
              this.assistHandle = res.data.filter((item, index, arr) => {
                return item.isManager == 0;
              });
              let formtatManagerData = res.data.filter((item, index, arr) => {
                return item.isManager == 1;
              });
              this.projectManager =
                formtatManagerData.length > 0 ? formtatManagerData[0] : {};
            } else {
              this.assistHandle = [];
              this.projectManager = {};
            }
          }
        })
        .catch(async () => {
          const resp = await this.get_assist_handle({
            zygsscId: this.transactionItem.id
          });
        });
    },
    //选定办理人Id
    async chooseStoreDataFn(item) {
      this.$nextTick(async () => {
        const params = {
          memberId: item.userId,
          memberName: item.realName,
          zygsscId: this.transactionItem.id,
          memberPhone: item.phone,
          isFeign: this.storeFlagUser //内部0 外部1
        };
        let res = "";
        if (this.type === "member") {
          // 添加成员
          res = await this.add_assist_handle(params);
        } else {
          params.storeId = this.transactionItem.teamId;
          res = await this.update_project_manager(params);
          // 修改管理
        }
        if (res.code === 200) {
          // 修改管理/添加成员成功，刷新列表
          this.toTransactor_1 = false;
          const res = await this.get_assist_handle({
            zygsscId: this.transactionItem.id
          });
          if (res.code === 200) {
            if (res.data && res.data.length > 0) {
              this.assistHandle = res.data.filter((item, index, arr) => {
                return item.isManager == 0;
              });
              let formtatManagerData = res.data.filter((item, index, arr) => {
                return item.isManager == 1;
              });
              this.projectManager =
                formtatManagerData.length > 0 ? formtatManagerData[0] : {};
            } else {
              this.assistHandle = [];
              this.projectManager = {};
            }
          }
        } else {
          this.$notify({
            message: res.message,
            type: "error",
            customClass: "dgg-tip-msg"
          });
        }
      });
    },
    // async changeProjectMemberSubmit() {
    //   if (this.memberSettingDialogValue.length === 0) {
    //     Notification.error("请选择成员");
    //     return;
    //   }
    //   const params = {
    //     id: this.transactionItem.id,
    //     userId: this.memberSettingDialogValue
    //   };
    //   let res = "";
    //   if (this.memberSettingDialogTitle === "添加成员") {
    //     res = await this.add_assist_handle(params);
    //     // 添加成员
    //   } else {
    //     res = await this.update_project_manager(params);
    //     // 修改管理
    //   }
    //   if (res.code === 200) {
    //     this.memberSettingDialog = false;
    //     // 修改管理/添加成员成功，刷新列表
    //     const res = await this.get_assist_handle({
    //       id: this.transactionItem.id
    //     });
    //     if (res.code === 200) {
    //       this.assistHandle = res.data.projectMember;
    //       this.projectManager = res.data.projectManager;
    //     }
    //   }
    // },
    async changeProjectMember(event, type) {
      const evt = window.event || event;
      evt.preventDefault();
      evt.stopPropagation();
      this.requestStoreUser();
      this.toTransactor_1 = true;
      this.type = type;
      type === "member" && (this.teamMemberTop = "210px");
      type === "manager" && (this.teamMemberTop = "110px");
    },
    memberSetClose(done) {
      done();
      return false;
    },
    // 打开成员设置界面
    openMemberSet() {
      this.memberSetDrawer = true; // 打开成员设置
    },
    resetQuery() {
      this.searchData = "";
    },
    change(data) {
      if (this.searchState) {
        this.$refs.query.resetAll();
      }
      this.resetClick();
      this.activeData = data;
      //设置记录完结订单是产品模式还是订单模式
      this.setFinishOrderModel(data);
    },
    getorderStatus(val) {
      switch (val) {
        case "QDS_SC_ORDER_STATUS_CODE01": // 办理中
          return "办理中";
        case "QDS_SC_ORDER_STATUS_CODE02": // 退单待审核
          return "退单待审核";
        case "QDS_SC_ORDER_STATUS_CODE03": // 完结待审核
          return "完结待审核";
        case "QDS_SC_ORDER_STATUS_CODE04": // 已完结
          return "已完结";
        case "QDS_SC_ORDER_STATUS_CODE05": // 已退单
          return "已退单";
        case "QDS_SC_ORDER_STATUS_CODE06": // 生产订单生成中
          return "生产订单生成中";
        case "QDS_SC_ORDER_STATUS_CODE07": // 待接收
          return "待接收";
        case "QDS_SC_ORDER_STATUS_CODE08": // 已退回
          return "已退回";
        case "QDS_SC_ORDER_STATUS_CODE09": // 待分配
          return "待分配";
      }
    },
    rowClick(row) {
      this.setTransactionItem(row);
      this.ruoterJump({
        name: "finishDetailsTask",
        params: {
          title: `${this.transactionItem.productName}-${this.transactionItem.scOrderNo}`
        }
      });
    },
    decimal(floatvar) {
      var fX = parseFloat(floatvar);
      if (isNaN(fX)) {
        return 0;
      }
      fX = Math.round(fX * 100) / 100;
      var sX = fX.toString();
      var posDecimal = sX.indexOf(".");
      if (posDecimal < 0) {
        posDecimal = sX.length;
        sX += ".";
      }
      while (sX.length <= posDecimal + 2) {
        sX += "0";
      }
      return Number(sX);
    },
    async queryEmit(val, field) {
      if (field === "businessProductCode") {
        //
        await this.zysc_find_product({
          proType: val
        });
        this.$refs["query"].resetFieldValue("productId");
      }
    },
    search(val) {
      this.paramsSearchData = val;
      this.paramsData = this.paramsSearchData;
    },
    searchClick() {
      this.paramsData = {
        keyWord: this.searchData
      };
    },
    resetClick() {
      this.searchData = "";
      this.paramsData = {};
    },
    menuJump(name) {
      // 顶部导航栏跳转
      this.ruoterJump({
        name: name,
        params: {
          title: `${this.transactionItem.customerName}-${this.transactionItem.scOrderNo}`
        }
      });
    }
  }
};
</script>
<style lang="less" scoped>
@import "~@/assets/less/main.less"; //引入全局less文件
.finish {
  width: 100%;
  margin: 0 0 40px;
  border-radius: 6px;
  /deep/ .finish-name-sate {
    width: 50px;
    height: 18px;
    border-radius: 10px;
    border: 1px solid rgba(241, 9, 64, 1);
    color: #f10940;
    font-size: 12px;
    padding: 0 6px;
    box-sizing: border-box;
  }
  /deep/ .finish-name-lable {
    width: 350px;
    display: inline-block;
    font-size: 14px;
    font-weight: 400;
    color: rgba(25, 35, 60, 1);
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
    vertical-align: middle;
    font-weight: bold;
  }
  /deep/ .finish-name-cumtorName {
    font-size: 13px;
    font-weight: 400;
    color: rgba(147, 152, 161, 1);
    margin-top: 10px;
  }
}
.dgg-order-nav {
  display: flex;
  justify-content: space-between;
  flex-wrap: nowrap;
  align-items: center;
  height: 50px;
  overflow: hidden;
  padding: 0 30px;
  border-bottom: 1px solid #e3e4e6;
  border-radius: 6px 6px 0 0;
  .dgg-order-state {
    width: 80px;
    line-height: 26px;
    .dgg-text-ellip;
    display: inline-block;
  }
  .dgg-button-group {
    height: 100%;
    display: flex;
    align-content: center;
    flex-wrap: nowrap;
    /deep/.el-button {
      padding: 0 15px;
      margin-left: 10px;
      border: 0;
      border-bottom: 1px solid transparent;
      &:first-child {
        margin-left: 0;
      }
      &:hover {
        color: #10bbb8;
        border-color: #10bbb8;
      }
    }
  }
  .dgg-submenu-nav {
    .el-menu-item {
      height: 50px;
      line-height: 50px;
      margin-left: 10px;
      &.first-child {
        margin-left: 0;
      }
    }
  }
  .dgg-details-member {
    display: flex;
    align-items: center;
    flex-wrap: nowrap;
    .memberImgLists {
      display: flex;
      align-items: center;
      .el-image {
        width: 27px;
        height: 27px;
        overflow: hidden;
        border-radius: 50%;
        &:not(:first-child) {
          margin-left: -6px;
        }
        /deep/.el-image__inner {
          width: 27px;
          height: 27px;
          overflow: hidden;
          border-radius: 50%;
          border: 2px solid #fff;
        }
      }
    }
    .more-member {
      border-radius: 50%;
      margin-left: -6px;
      z-index: 10;
      cursor: pointer;
    }
  }
}
.dgg-order-search {
  height: 70px;
  display: flex;
  align-items: center;
  padding: 0 30px;
  border-bottom: 1px solid #edeff0;
  /deep/.el-input__inner {
    height: 30px;
    line-height: 30px;
  }
}
.finish-name-yewllo {
  height: 18px;
  border-radius: 10px;
  border: 1px solid #fd8e26;
  color: #fd8e26;
  font-size: 12px;
  padding: 0 10px;
  box-sizing: border-box;
  margin-right: 5px;
}
//成员设置
.member-setting-dialog {
  /deep/.el-dialog__body {
    text-align: center;
  }
}
/deep/.order-member-set {
  padding: 0 10px;
  overflow-y: scroll;
  .el-drawer__header {
    margin: 0;
    height: 60px;
    color: #19233c;
    padding: 0 10px;
    line-height: 60px;
    font-size: 16px;
    font-weight: 500;
    .dgg-text-ellip;
  }
  .dgg-member-info {
    .person-charge {
      height: 100px;
      border-top: 1px solid #edeff0;
      border-bottom: 1px solid #edeff0;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      padding: 20px 10px 18px 10px;
      .top {
        height: 18px;
        line-height: 18px;
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        justify-content: space-between;
        & > span {
          display: inline-block;
          flex: 1;
          .dgg-text-ellip;
          font-size: 13px;
          font-weight: 400;
          color: #9398a1;
        }
        .dgg-button {
          line-height: 18px;
          padding-left: 10px;
          max-width: 62px;
          font-size: 13px;
          border: none;
        }
      }
      .bottom {
        display: flex;
        align-items: center;
        height: 28px;
        .headImg {
          width: 27px;
          height: 27px;
          border-radius: 50%;
          flex-shrink: 0;
        }
        & > span {
          margin-left: 14px;
          flex: 1;
          .dgg-text-ellip;
          font-size: 14px;
          color: #666873;
        }
      }
    }
    .project-members {
      padding: 20px 20px 12px 10px;
      .top {
        height: 18px;
        line-height: 18px;
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        justify-content: space-between;
        & > span {
          display: inline-block;
          flex: 1;
          .dgg-text-ellip;
          font-size: 13px;
          font-weight: 400;
          color: #9398a1;
        }
        .dgg-button {
          line-height: 18px;
          padding: 0 10px;
          max-width: 62px;
          font-size: 13px;
          border: none;
          padding-right: 0;
        }
      }
    }
    .members-list {
      .current-list {
        display: flex;
        align-items: center;
        justify-content: space-between;
        flex-wrap: nowrap;
        height: 34px;
        margin-bottom: 14px;
        padding-right: 20px;
        padding-left: 10px;
        .left {
          position: relative;
          height: 100%;
          flex-shrink: 0;
          width: 134px;
          border-radius: 18px;
          font-size: 14px;
          display: flex;
          align-items: center;
          flex-wrap: nowrap;

          /*&:hover {*/
          /*  background-color: #f5f7fa;*/
          /*  .cancel-merber-icon {*/
          /*    display: block;*/
          /*  }*/
          /*}*/
          .headImg {
            width: 27px;
            height: 27px;
            border-radius: 50%;
            flex-shrink: 0;
          }
          & > span {
            height: 100%;
            display: inline-block;
            line-height: 34px;
            margin-left: 14px;
            flex: 1;
            .dgg-text-ellip;
          }
          .cancel-merber-icon {
            display: none;
            position: absolute;
            right: -5px;
            top: -5px;
            cursor: pointer;
          }
        }
        .memberTypeSet {
          width: 80px;
          border: none;
          .el-input__suffix {
            width: 16px;
          }
          .el-input--suffix .el-input__inner {
            padding-right: 16px;
            border: none;
          }
          .el-input__icon {
            width: 16px;
          }
        }
      }
    }
  }
}
.finish {
  border-radius: 6px;
  width: 100%;
  background: rgba(255, 255, 255, 1);
  border-radius: 6px;
  .search {
    width: 270px;
    height: 30px;
    margin-left: 20px;
    > input {
      background: rgba(240, 242, 245, 1);
      border: none;
    }
    /deep/.el-input__inner {
      background: #f0f2f5;
      border: none;
    }
  }
  .el-tabs__nav-scroll {
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .dgg-search {
    margin-left: 30px;
    cursor: pointer;
  }
  .icon_info {
    cursor: pointer;
    margin-right: 30px;
    line-height: 30px;
  }
  .tabs-item-head {
    min-height: 70px;
    padding: 20px 0px;
    position: relative;
    .finishImg {
      top: 35px;
      right: 180px;
      position: absolute;
      z-index: 100;
      background: url("~assets/images/icon_chapter_red.png") no-repeat;
      background-size: 100% 100%;
      width: 127px;
      height: 50px;
      padding: 5px;
      color: #f10940;
      text-align: center;
      transform: rotate(-30deg);
      -ms-transform: rotate(-30deg); /* IE 9 */
      -moz-transform: rotate(-30deg); /* Firefox */
      -webkit-transform: rotate(-30deg); /* Safari 和 Chrome */
      -o-transform: rotate(-30deg); /* Opera */
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      padding: 3px;
      overflow: hidden;
      .finishImg-time {
        font-size: 12px;
        font-weight: 400;
        height: 20px;
        line-height: 20px;
        padding: 0 10px;
      }
      .finishImg-title {
        font-size: 18px;
        font-weight: 500;
        height: 24px;
        line-height: 24px;
        .dgg-text-ellip;
        padding: 0 20px;
      }
    }
  }
  .finish-body {
    padding: 0 10px;
  }
  .finish-button {
    border-radius: 4px;
    border: 1px solid rgba(16, 187, 184, 1);
  }
  .finish-radio {
    margin-right: 30px;
  }
  .el-radio-button {
    width: 60px;
    > input {
      width: 60px;
    }
    > span {
      width: 60px;
    }
  }
  //  重定义胶囊按钮边框颜色
  .el-radio-button__inner {
    border-color: #e5e9f2;
    border-left: none;
    font-size: 14px;
  }
  .el-radio-button:first-child .el-radio-button__inner {
    border-color: #e5e9f2;
  }
}
</style>
