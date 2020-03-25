<template>
  <div class="chargeback">
    <!-- 头部 -->
    <div
      v-if="
        [
          'chargeBackDetailsTask',
          'chargeBackDetailsDocument',
          'chargeBackDetailsBill',
          'chargeBackDetailsDynamic'
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
        <el-menu-item
          key="1"
          index="1"
          @click="menuJump('chargeBackDetailsTask')"
          >任务</el-menu-item
        >
        <el-menu-item
          key="2"
          index="2"
          @click="menuJump('chargeBackDetailsDocument')"
          >文档</el-menu-item
        >
        <!--  <el-menu-item
          key="3"
          index="3"
          @click="menuJump('chargeBackDetailsBill')"
          >底单</el-menu-item
        > -->
        <el-menu-item
          key="4"
          index="4"
          @click="menuJump('chargeBackDetailsDynamic')"
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
    <div v-if="$route.name === 'chargeback'" class="tabs-item-head">
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

    <div v-if="$route.name === 'chargeback'" class="chargeback-body">
      <dgg-edit-table
        :data="dataList.records"
        :columns="columns"
        :request-data-api="get_order_model_by_status"
        :params="params"
        :page-info="dataList.total"
        @row-click="rowClick"
      />
    </div>
    <router-view />

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
              >添加</dgg-button
            > -->
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
  </div>
</template>

<script>
// 加载页
// eslint-disable-next-line no-unused-vars
import { mapState, mapActions, mapMutations } from "vuex";
import moment from "moment";
import transactorProp from "@/views/main/page/components/transactorProp.vue";

export default {
  name: "Chargeback",
  components: {
    transactorProp
  },
  data() {
    return {
      // ---------------张浪添加
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
      memberSetDrawer: false,
      projectManager: {},
      assistHandle: [],
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
                onClick={e => {}}
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
          prop: "endTime",
          label: "完成时间",
          width: "170",
          type: "isrender",
          render: (h, params) => {
            return <div class="dgg-text-ellip">{params.row.endTime}</div>;
          }
        }
      ],
      list: [],
      searchData: "",
      paramsData: {},
      paramsSearchData: {}
    };
  },
  computed: {
    ...mapState([
      "userId",
      "transactionItem",
      "storeInfoData",
      "orderStatusName"
    ]),
    ...mapState("chargebackModule", ["dataList", "commodityOptions"]),
    ...mapState("orderModule", [
      "areaOptions", // 地区
      "productOptions", // 业务
      "productDataList" // 产品
      // "orderStatusList" //订单状态数据
    ]),
    memberSet() {
      return [
        "chargeBackDetailsTask",
        "chargeBackDetailsDocument",
        "chargeBackDetailsBill",
        "chargeBackDetailsDynamic"
      ].includes(this.$route.name);
    },
    memberImgLists() {
      const imgArr = [];
      imgArr.push(this.projectManager.addressHandlerPicture);
      this.assistHandle.forEach((item, index) => {
        imgArr.push(item.addressHandlerPicture);
      });
      return imgArr;
    },
    params() {
      return {
        ...this.paramsData
      };
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
      if (this.$route.name === "chargeBackDetailsTask") {
        _key = "1";
      }
      if (this.$route.name === "chargeBackDetailsDocument") {
        _key = "2";
      }
      if (this.$route.name === "chargeBackDetailsBill") {
        _key = "3";
      }
      if (this.$route.name === "chargeBackDetailsDynamic") {
        _key = "4";
      }
      return _key;
    }
  },
  watch: {
    async memberSet(val) {
      if (val) {
        const res = await this.get_assist_handle({
          zygsscId: this.transactionItem.id
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
    if (
      [
        "chargeBackDetailsTask",
        "chargeBackDetailsDocument",
        "chargeBackDetailsBill",
        "chargeBackDetailsDynamic"
      ].includes(this.$route.name)
    ) {
      const res = await this.get_assist_handle({
        zygsscId: this.transactionItem.id,
        searchWord: ""
      });
      if (res.code == 200) {
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
  activated() {
    //
  },
  created() {},
  beforeDestroy() {
    //
  },
  methods: {
    ...mapActions("transactionTaskModule", [
      "zygs_queryMemberNonMerchantVO" //专业公司查询成员列表数据
    ]),
    ...mapActions("orderModule", [
      "zysc_find_product" // 查询产品信息
    ]),
    ...mapActions("transactionModule", ["get_assist_handle"]),
    ...mapActions(["ruoterJump"]),
    ...mapActions("chargebackModule", ["get_order_model_by_status"]),
    ...mapMutations(["setTransactionItem"]),
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
    // 打开成员设置界面
    openMemberSet() {
      this.memberSetDrawer = true; // 打开成员设置
    },
    memberSetClose(done) {
      done();
    },
    resetQuery() {
      this.searchData = "";
    },
    async queryEmit(val, field) {
      if (field === "businessProductCode") {
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
    rowClick(row) {
      this.setTransactionItem(row);
      this.ruoterJump({
        name: "chargeBackDetailsTask",
        params: {
          title: `${this.transactionItem.productName}-${this.transactionItem.scOrderNo}`
        }
      });
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

<style scoped lang="less">
@import "~@/assets/less/main.less"; //引入全局less文件
.chargeback {
  width: 100%;
  background: rgba(255, 255, 255, 1);
  margin: 0 0 40px;
  border-radius: 6px;
  //成员设置
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
  .search {
    width: 270px;
    height: 30px;
    margin-left: 20px;
    > input {
      background: rgba(240, 242, 245, 1);
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
  }
  .chargeback-body {
    padding: 0 10px;
  }
  .chargeback-button {
    border-radius: 4px;
    border: 1px solid rgba(16, 187, 184, 1);
  }
}
</style>
