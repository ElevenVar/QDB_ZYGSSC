<template>
  <div class="grab">
    <div
      class="grab-content"
      v-show="$route.name ==='grab'"
    >
      <el-dialog
        title="提示"
        :visible.sync="grabFileDialog"
        width="30%"
      >
        <span>当前订单已被其他人抢走，下次记得快一点哟~~~</span>
        <span
          slot="footer"
          class="dialog-footer"
        >
          <el-button
            type="primary"
            @click="grabFileDialog = false"
          >我知道了</el-button>
        </span>
      </el-dialog>
      <dgg-tabs
        v-model="activeName"
        class="grab-content-tabs"
      >
        <dgg-tab-pane
          label="待抢订单"
          name="first"
          class="tabs-item"
        >
          <div class="tabs-item-head">
            <div>
              <dgg-icon
                :icon-class="searchState? 'icon_screen_selected':'icon_screen'"
                class="dgg-search"
                svg-width="15px"
                svg-height="15px"
                @click="searchState=!searchState"
              />
              <dgg-input
                v-model="search1"
                class="search"
                :maxlength="30"
                @input="search1 = search1.replace(/\s+/g,'');"
                @keyup.enter.native="keyWordSearch"
                placeholder="客户名称/生产单编号"
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
                @click="searchNewList"
              >
                搜 索
              </dgg-button>
              <dgg-button
                v-if="!searchState"
                plain
                class="dgg-button-nocolor default-btn-with"
                @click="search1=''"
              >
                重 置
              </dgg-button>
              <el-tooltip
                effect="dark"
                popper-class="grab-tooltip"
                content="抢单后，可前往“抢单”菜单查看抢单状态，等待后台分配"
                placement="top"
              >
                <div class="fr icon_info">
                  <dgg-icon
                    icon-class="icon_info_1"
                    svg-width="15px"
                    svg-height="30px"
                  />
                </div>
              </el-tooltip>
            </div>

            <div
              v-if="searchState"
              class="tabs-item-query"
            >
              <dgg-query
                ref="newSearchData"
                :query-list="queryListParam"
                :can-export="false"
                clear-value
                @resetEvent="resetQuery"
                @search="searchNewList"
                @changeEvent="searchNewList"
              />
            </div>
          </div>

          <div
            class="grab-body"
            v-loading="uploadGrabLoading"
          >
            <dgg-edit-table
              :data="dataList.records"
              :columns="columns"
              :pageInfo="dataList.totalCount"
              :params="testParams"
              :request-data-api="get_grap_list"
              ref="grabTableData"
            />

          </div>
        </dgg-tab-pane>
      </dgg-tabs>
    </div>
    <router-view />
    <fixedNotice type="phone" />
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
import moment from "moment";
import fixedNotice from "@/views/main/page/components/fixedNotice.vue";
import Notification from "@/componentsEl/notification/index.js";
export default {
  name: "Grab",
  components: {
    fixedNotice
  },
  data() {
    return {
      grabTimer:null,//倒计时
      uploadGrabLoading:false,
      grabFileDialog: false,
      activeName: "first",
      search: "",
      search1: "",
      searchState: false,
      searchParams: {},
      columns: [
        {
          prop: "service_name",
          width: "175",
          label: "业务名称",
          type: "isrender",
          render: (h, params) => {
            let _iconName = "noicon_order_icon";
            if (params.row.businessProductCode === "BUS_YT_FL_FS") {
              _iconName = "order_icon_nonlitigation";
            }
            if (params.row.businessProductCode === "BUS_YT_FL_MSSS") {
              _iconName = "icon_civil_order";
            }
            if (params.row.businessProductCode === "BUS_YT_FL_XZSS") {
              _iconName = "order_icon_litigation";
            }
            if (params.row.businessProductCode === "BUS_YT_FL_XSSS") {
              _iconName = "order_icon_criminal";
            }
            if (params.row.businessProductCode === "BUS_YT_FL_FLGW") {
              _iconName = "order_icon_law";
            }
            return (
              <div>
                <div>
                  <dgg-icon
                    class="fl"
                    icon-class={_iconName}
                    style="margin-right:10px;"
                    svg-width="48px"
                    svg-height="23px"
                  />
                </div>
                <span class="dgg-text-ellip" style="display: block;">
                  {params.row.simpleProductNames}
                </span>
              </div>
            );
          }
        },
        {
          prop: "generating_orm",
          label: "生产单编号",
          width: "140",
          type: "isrender",
          render: (h, params) => {
            return <div style="color:#10BBB8">{params.row.generating_orm}</div>;
          }
        },
        { prop: "custome_name", width: "160", label: "客户名称" },
        { prop: "regional", label: "办理地区", width: "100" },
        { prop: "proportion", label: "佣金/比例" },
        { prop: "remark", label: "备注", width: "140" },
        {
          prop: "order_info",
          label: "订单信息",
          width: "90",
          type: "isrender",
          render: (h, params) => {
            return (
              <div
                style="color:#10BBB8;cursor: pointer;"
                onClick={e => {
                  this.ruoterJump({
                    name: "grabDetails",
                    params: { id: params.row.id }
                  });
                }}
              >
                订单信息
              </div>
            );
          }
        },
        {
          prop: "countDown",
          width: "100",
          label: "倒计时",
          type: "isrender",
          render: (h, params) => {
            return (
              <div style="color:#F10940">
                {Date.myTime(params.row.countDown)}
              </div>
            );
          }
        },
        {
          label: "操作",
          width: "90",
          type: "isrender",
          render: (h, params) => {
            return (
              <div>
                <dgg-button
                  class="dgg-button-nocolor"
                  onClick={e => {
                    this.robOrder(params.row.id);
                    // this.ruoterJump({ name: 'brabBill' });
                  }}
                >
                  抢单
                </dgg-button>
              </div>
            );
          }
        }
      ],
      businessOption: [],
      areaOption: [],
      productOption: []
    };
  },
  computed: {
    ...mapState(["XReqYT"]),
    ...mapState("grapModule", ["dataList"]),
    testParams() {
      let msg = JSON.parse(sessionStorage.getItem("globalPersonMsg"));
      if (!msg) {
        this.ruoterJump({ name: "login" });
        return;
      }
      return {
        ...this.searchParams,
        businessCode: this.XReqYT,
        searchType: 1,
        storeId: msg.storeId
      };
    },
    queryListParam() {
      return [
        {
          field: "business",
          type: "select",
          label: "业务",
          width: "220px",
          value: "",
          options: this.businessOption
        },
        {
          field: "product",
          type: "select",
          label: "产品",
          value: "",
          width: "220px",
          options: this.productOption
        },
        {
          field: "area",
          type: "select",
          label: "地区",
          width: "220px",
          value: "",
          options: this.areaOption
        },
        // {
        //   field: 'time',
        //   type: 'daterange',
        //   label: '时间',
        //   width: '220px',
        //   value: ''
        // },
        {
          label: "佣金",
          width: "220px",
          field: "commission",
          children: [
            {
              field: "min",
              type: "input",
              label: "最低",
              width: "97px",
              placeholder: "最低",
              value: ""
            },
            {
              field: "max",
              type: "input",
              label: "最高",
              width: "97px",
              placeholder: "最高",
              value: ""
            }
          ]
        }
      ];
    }
  },
  watch: {},
  async mounted() {
    const yt = await this.get_level2_yt({
      type: 1,
      level: 1,
      code: this.XReqYT
    });
    if (yt.code === 200) {
      yt.data.forEach((item, inx) => {
        item.value = item.code;
        item.label = item.name;
      });
      this.businessOption = yt.data;
    }
    const area = await this.get_company_city();
    if (area.code === 200) {
      area.data.forEach((item, inx) => {
        item.value = item.name;
        item.label = item.name;
      });
      this.areaOption = area.data;
    }
  },
  activated() {
    //
  },
  created() {
    //
  },
  beforeDestroy() {
    //
  },
  methods: {
    ...mapActions(["ruoterJump"]),
    ...mapActions("grapModule", [
      "get_grap_list",
      "rob_order",
      "get_level2_yt"
    ]),
    ...mapActions("settledModule", [
      "get_yt_list",
      "get_yt_prodyct_list",
      "get_company_city"
    ]),
    ...mapActions("startPageModule", ["count_waiting_grab"]),
    resetQuery() {
      this.search1 = "";
    },
    change() {
      if (this.$route.name === "grab") {
        this.ruoterJump({ name: "grabDetails" });
      } else {
        this.ruoterJump({ name: "grab" });
      }
    },
    keyWordSearch() {
      const param = {
        searchInfo: this.search1
      };
      // if (this.searchState) {
      //   const params = this.$refs.newSearchData.list;
      //   param.searchInfo = this.search1;
      //   param.businessProductCode = params[0].value;
      //   param.area = params[2].value;
      //   param.minMoney = params[4].children[0].value;
      //   param.maxMoney = params[4].children[1].value
      // }
      this.searchParams = param;
    },
    async searchNewList(val, field) {
      let globalPersonMsg = JSON.parse(
        sessionStorage.getItem("globalPersonMsg")
      );
      if (globalPersonMsg.storeId) {
        this.count_waiting_grab({
          businessCode: "BUS_YT_FL",
          searchType: "1",
          // status: "0",  //祁旭楠2020-01-10  叫修改0 为1为数字类型
          status: 0,
          storeId: globalPersonMsg.storeId
        });
      }
      let params = null;
      if (this.searchState) {
        // 搜索条件打开 获取搜索条件参数
        params = this.$refs.newSearchData.list;
      }
      if (field === undefined) {
        let param = {};
        if (this.searchState) {
          param.searchInfo = this.search1;
          params.forEach((it, inx) => {
            if (it.field === "business") {
              param.businessProductCode = it.value;
            } else if (it.field === "product") {
              //祁旭楠叫修改的2020-01-10 将businessProductCode  改为 simpleProductNames
              param.simpleProductNames = it.value;
            } else if (it.field === "area") {
              param.area = it.value;
            } else if (it.field === "commission") {
              it.children.forEach((ite, ind) => {
                if (ite.field === "min") {
                  param.minMoney = Number(ite.value);
                } else {
                  param.maxMoney = Number(ite.value);
                }
              });
            }
          });
        } else {
          param = {
            searchInfo: this.search1
          };
        }
        this.searchParams = param;
      } else if (field === "business") {
        // 获取产品
        const ytBus = await this.get_yt_prodyct_list({
          proType: params[0].value
        });
        if (ytBus.code === 200) {
          ytBus.data.forEach((it, inx) => {
            it.value = it.name;
            it.label = it.name;
          });
          this.productOption = ytBus.data;
          this.$refs["newSearchData"].resetFieldValue("product");
        }
      }
    },
    async robOrder(id) {
      let globalPersonMsg = JSON.parse(
        sessionStorage.getItem("globalPersonMsg")
      );
      if (globalPersonMsg.storeId) {
        const result = await this.rob_order({
          scOrderId: id,
          storeId: globalPersonMsg.storeId
        });

        if (result.code === 200) {    
          this.$notify({   
    message: "抢单成功，请前往办理中查看",
    type: "success",
    customClass: "dgg-tip-msg"
});
          this.uploadGrabLoading = true;
        } else {
          if (result.code === 5002) {
            this.grabFileDialog = true;
          } else {
            this.$notify({
              message: result.message,
              type: "error",
              customClass: "dgg-tip-msg"
            });
          }
        }
  this.grabTimer = setInterval(() => {
     this.uploadGrabLoading = false;
     this.searchNewList();
           clearInterval(this.grabTimer);
        }, 1000);
       
      } else {
        // Notification.error(globalPersonMsg.storeId)
      }
    }
  }
};
</script>

<style lang="less">
.grab {
  width: 100%;
  min-height: 100%;
  background: rgba(255, 255, 255, 1);
  border-radius: 6px;
  margin: 0 0 40px;
  .el-dialog {
    border-radius: 5px;
    .el-dialog__title {
      color: #b9b9b9;
    }
    .el-dialog__body {
      font-size: 14px;
    }
    .el-button {
      border: 1px #b9b9b9 solid;
      background-color: white;
      color: #444444;
      padding-left: 15px;
      padding-right: 15px;
    }
  }
  .grab-content {
    width: 100%;
    height: 100%;
    .search {
      width: 270px;
      height: 30px;
      margin-left: 20px;
      > input {
        background: rgba(240, 242, 245, 1);
        border: none;
      }
    }
    .grab-content-tabs {
      .el-tabs__nav {
        height: 45px;
        line-height: 45px;
      }
      .el-tabs__item {
        font-size: 14px;
        font-weight: 500;
        height: 45px;
        line-height: 45px;
        color: #666873;
        font-weight: 400;
      }
      .is-active {
        font-weight: 500;
        color: rgba(16, 187, 184, 1);
        line-height: 20px;
      }
      .el-tabs__nav-scroll {
        height: 45px;
        display: block;
        padding-left: 15px;
        .el-tabs__active-bar {
          display: none;
        }
      }
      .el-tabs__header {
        height: 45px;
        margin: 0px;
      }
      .el-tabs__nav-wrap:after {
        background-color: none;
      }
    }
    .el-tabs__nav-scroll {
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .dgg-search {
      margin-left: 15px;
      cursor: pointer;
    }
    .icon_info {
      cursor: pointer;
      margin-right: 30px;
      line-height: 30px;
      color: #e4e4e4;
      &:hover {
        color: var(--main-primary-color);
      }
      /deep/ .dgg-icon {
        width: 20px !important;
      }
    }
    .tabs-item-head {
      min-height: 70px;
      padding: 20px 0px;
    }
    .grab-body {
      padding: 0 30px;
    }
  }
  .grab-button {
    border-radius: 4px;
    border: 1px solid rgba(16, 187, 184, 1);
  }
  .grab-button:hover {
    border-color: #18ccc9;
    color: #18ccc9;
  }
}
</style>
