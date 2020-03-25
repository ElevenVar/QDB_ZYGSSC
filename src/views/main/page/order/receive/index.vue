<template>
  <div class="receive">
    <div v-if="$route.name === 'receive'" class="receive-content">
      <div class="tabs-item-head">
        <div>
          <dgg-icon
            :icon-class="searchState ? 'icon_screen_selected' : 'icon_screen'"
            class="dgg-search"
            svg-width="15px"
            svg-height="15px"
            @click="searchState = !searchState"
          />
          <dgg-input
            v-model="searchData"
            :maxlength="30"
            oninput="this.value=this.value.replace(/\s/g,'')"
            onkeyup="if(value.length>30)value=value.slice(0,30)"
            class="search"
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
          <el-tooltip
            effect="dark"
            popper-class="grab-tooltip"
            :content="receiptTime"
            placement="top"
          >
            <div class="fr icon_info">
              <dgg-icon
                icon-class="icon_info"
                svg-width="15px"
                svg-height="30px"
              />
            </div>
          </el-tooltip>
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

      <div v-if="activeData === '1'" class="receive-body">
        <dgg-edit-table
          :data="dataList.records.length > 0 ? dataList.records: []"
          :columns="columns"
          :request-data-api="zysc_get_order_model_by_status"
          :params="params"
          :page-info="dataList.total"
        />
      </div>
    </div>
    <el-dialog
      :visible.sync="singleBackCodeDialog"
      title="拒接订单"
      width="400px"
      @close="
        singleBackCodeForm.code = '';
        singleBackCodeForm.remark = '';
      "
    >
      <el-form ref="form" :model="singleBackCodeForm">
        <el-form-item label="拒接原因：">
          <el-select
            v-model="singleBackCodeForm.code"
            placeholder="请选择拒接原因"
          >
            <el-option
              v-for="item in singleBackCodeOption"
              :label="item.name"
              :value="item.code"
              :key="item.code"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="拒接备注：" class="refuse-memo">
          <el-input
            v-model="singleBackCodeForm.remark"
            type="textarea"
            :autosize="{ minRows: 4, maxRows: 4 }"
            show-word-limit
            maxlength="500"
          />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button
          @click="
            singleBackCodeDialog = false;
            singleBackCodeForm.code = '';
            singleBackCodeForm.remark = '';
          "
          >取 消</el-button
        >
        <el-button type="primary" @click="refusedOrder">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 接收订单弹窗 -->
    <el-dialog
      :visible.sync="receiveDialog"
      title="接收订单"
      width="400px"
      class="receiveDialog-alert"
      @close="
        receiveForm.code = '';
        receiveForm.name = '';
        receiveForm.projectMembersPhone = '';
        searchStorePhone = '';
        choosePeopleData = {};
      "
    >
      <el-form :model="receiveForm">
        <el-form-item label="生产单编号：">
          <p>
            {{ this.receiveItem.scOrderNo ? this.receiveItem.scOrderNo : "--" }}
          </p>
        </el-form-item>
        <el-form-item label="合同编号：">
          <p>
            {{
              this.receiveItem.contractNo ? this.receiveItem.contractNo : "--"
            }}
          </p>
        </el-form-item>
        <el-form-item label="项目负责人：" class="choose-people">
          <template v-if="Object.keys(choosePeopleData).length > 0">
            <span class="show-transactor-people">
              <img
                :src="
                  choosePeopleData.photoUrl
                    ? choosePeopleData.photoUrl
                    : taskTransactorImg
                "
                :onerror="errorTaskTransactorImg"
                alt=""
              />
              <dgg-icon
                icon-class="dgg_delete"
                svg-width="14px"
                svg-height="14px"
                sdafsadfasdffas
                @click="deleteChoosePeople"
              />
            </span>
            <span class="show-transactor-name">{{
              choosePeopleData.label
            }}</span>
          </template>
          <dgg-icon
            v-if="Object.keys(choosePeopleData).length < 1"
            icon-class="dgg_add"
            svg-width="18px"
            svg-height="18px"
            class="addTransactor"
            @click="showChoosePeopleDialog = !showChoosePeopleDialog"
          />
          <!-- 显示接收弹窗选择 -->
          <div v-if="showChoosePeopleDialog" class="project-people-dialog">
            <div class="dgg-order-search">
              <dgg-input
                v-model="searchStorePhone"
                class="search-input"
                placeholder="输入成员姓名或手机号搜索"
                maxlength="30"
                @input="searchStorePhone = searchStorePhone.replace(/\s/g, '')"
                @keyup.enter.native="$event.target.blur"
                @blur="receiveOrderDialogFn"
              >
                <dgg-icon slot="prefix" icon-class="dgg-search" />
              </dgg-input>
            </div>
            <!-- 搜索 end -->
            <ul
              v-if="receiveOption.length > 0"
              class="infinite-list"
              style="overflow:auto"
            >
              <li
                v-for="(item, index) in receiveOption"
                :key="index"
                :class="{ 'active-product-list': item.userId == chooseStoreId }"
                class="infinite-list-item"
                @click="chooseStoreData(item)"
              >
                <span>{{ item.label ? item.label : "--" }}</span>
                <span>{{ item.value ? item.phone : "--" }}</span>
              </li>
            </ul>
            <p v-if="receiveOption.length < 1" class="no-data">暂无数据！</p>
          </div>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button
          @click="
            receiveDialog = false;
            receiveForm.code = '';
            receiveForm.name = '';
            receiveForm.projectMembersPhone = '';
          "
          >取 消</el-button
        >
        <el-button type="primary" @click="receiveOrder" :loading = receiveButton>确 定</el-button>
      </span>
    </el-dialog>
    <router-view />
  </div>
</template>

<script>
// 加载页
// eslint-disable-next-line no-unused-vars
import { mapState, mapActions } from "vuex";
import moment from "moment";
import taskTransactorImg from "@/assets/images/image_portrait_fault.png";

export default {
  name: "Receive",
  components: {},
  data() {
    return {
      //--------------------接收订单
      receiveDialog: false, // 接收订单弹窗
      receiveButton:false, // 确认接收防重复点击
      taskTransactorImg: taskTransactorImg, // 办理人默认头像
      errorTaskTransactorImg: 'this.src="' + taskTransactorImg + '"', // 默认图地址
      showChoosePeopleDialog: false,
      chooseStoreId: "",
      receiptTime: null, //接单时间
      choosePeopleData: {}, // 选定人的信息
      searchStorePhone: "",
      receiveForm: {
        code: "",
        name: "",
        projectMembersPhone: ""
      },
      
      receiveOption: [],
      receiveItem: "",
      singleBackCodeForm: {
        code: ""
      },
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
          width: "140"
        },
        { 
          prop: "customerName", 
          width: "160", 
          label: "客户名称" ,
          type: "isrender",
          render:(h,params)=>{
            return(<div class="dgg-text-ellip">{params.row.customerName}</div>)
          }
        },
        { prop: "region", width: "100", label: "办理地区" },
        { prop: "proScAttrName", label: "产品属性" },
        { prop: "remark", label: "备注", width: "140" },
        {
          prop: "receiveDeadlineTimeStamps",
          label: "剩余时间",
          type: "isrender",
          render: (h, params) => {
            return (
              <div style="color: red;">
                {params.row.receiveDeadlineTimeStamps}
              </div>
            );
          }
        },
        {
          label: "操作",
          width: "150",
          type: "isrender",
          render: (h, params) => {
            if (!params.row.isReject) {
              return (
                <div>
                  <dgg-button
                    plain
                    style="width:50px"
                    class="receive-button"
                    onClick={e => {
                      this.receiveOrderDialog(params.row);
                    }}
                  >
                    接 收
                  </dgg-button>
                </div>
              );
            } else {
              return (
                <div>
                  <dgg-button
                    plain
                    style="width:50px"
                    class="receive-button"
                    onClick={e => {
                      this.receiveOrderDialog(params.row);
                    }}
                  >
                    接 收
                  </dgg-button>
                  <dgg-button
                    plain
                    style="width:50px;margin-left:10px;"
                    class="dgg-button-nocolor"
                    onClick={e => {
                      this.refuseConfirm(params.row);
                    }}
                  >
                    拒 接
                  </dgg-button>
                </div>
              );
            }
          }
        }
      ],
      allSearch: {},
      searchData: "",
      paramsData: {},
      paramsSearchData: {},
      singleBackCodeDialog: false, // 拒接类型弹窗
      singleBackCodeOption: [],
      refusedOrderRow: "", // 拒接订单
      interval: null //计时器
    };
  },
  computed: {
    ...mapState(["storeInfoData"]),
    ...mapState("orderModule", [
      "areaOptions", // 地区
      "productOptions", // 业务数据
      "productDataList" // 产品数据
    ]),
    ...mapState("receiveModule", ["dataList"]),
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
          field: "regionCode",
          type: "select",
          label: "地区",
          width: "220px",
          value: "",
          options:
            this.areaOptions.map(item => {
              return {
                value: item.code,
                label: item.name
              };
            }) || []
        },
        {
          label: "佣金",
          width: "220px",
          children: [
            {
              field: "commissionLow",
              type: "input",
              label: "test1",
              width: "97px",
              placeholder: "最低",
              value: ""
            },
            {
              field: "commissionHight",
              type: "input",
              label: "test1",
              width: "97px",
              placeholder: "最高",
              value: ""
            }
          ]
        }
      ];
    }
  },
  watch: {
  },
  async mounted() {
    this.zysc_get_setTimeS(); //查询生产中心 设置的抢单，接单 时间
    this.$nextTick(()=>{
      this.timeGoBy();
    })
    if (this.storeInfoData.storeId) {
      this.paramsData.storeId = this.storeInfoData.storeId;
    }
  },
  // 路由离开之前，清除页面的循环调用
  beforeRouteLeave(to, from, next) {
    sessionStorage.processPlanRoute = from.fullPath;
    clearInterval(this.interval);
    this.interval = null;
    next();
  },
  async created() {
    this.$nextTick(()=>{
      this.timeGoBy();
    })
  },
  beforeDestroy() {
    //
  },
  methods: {
    ...mapActions(["ruoterJump"]),
    ...mapActions("receiveModule", [
      "zysc_get_order_model_by_status", //列表默认查询
      "get_store_peoples", //查询店铺成员

      "receive_order", // 确定接收
      "refused_order", // 确认拒绝
      "refuse_code_tree_book_list", // 查询拒绝原因列表
      "zysc_get_setTime" // 查询生产中心 设置的抢单，接单 时间
    ]),
    ...mapActions("orderModule", [
      "zysc_find_product" // 查询产品信息
    ]),
    ...mapActions("teamSettingModule", ["get_store_user"]),
    resetQuery() {
      this.searchData = "";
    },
    // 倒计时 函数
    timeGoBy() {
      var _this = this;
        _this.interval = setInterval(() => {
          let nowDate = new Date().getTime();
          _this.dataList.records.map(item => {
            let time = item.receiveDeadlineTimeStamp;
            let lefttime = Number(time) - nowDate, //距离结束时间的毫秒数
              lefth = Math.floor((lefttime / (1000 * 60 * 60)) % 24), //计算小时数
              leftm = Math.floor((lefttime / (1000 * 60)) % 60), //计算分钟数
              lefts = Math.floor((lefttime / 1000) % 60), //计算秒数
              da =
                lefth + ":" + leftm + ":" + (lefts < 10 ? "0" + lefts : lefts);
            for (let i in item) {
              if (i == "receiveDeadlineTimeStamp") {
                _this.$set(item, "receiveDeadlineTimeStamps", da);
              }
            }
          });
        }, 1000);
    },

    // 拒绝按钮点击
    refuseConfirm(row) {
      this.$confirm(
        "该订单根据您的行为及数据进行匹配，建议不要轻易拒接订单，拒接订单将会影响您的接单排名分数哟~~",
        "提示",
        {
          confirmButtonText: "拒绝",
          cancelButtonText: "取消"
          // type: 'warning'
        }
      )
        .then(() => {
          this.showSingleBackCodeDialog(row);
        })
        .catch(() => {});
    },
    // 接收按钮 -- 点击
    receiveOrderDialog(params) {
      this.receiveItem = params;
      this.receiveDialog = true;
      this.receiveOrderDialogFn();
    },
    //  查询人员
    async receiveOrderDialogFn() {
      // 没有输入值的话就去接口请求
      if (this.searchStorePhone == "") {
        if (this.storeInfoData.storeId) {
          const res = await this.get_store_peoples({
            storeId: this.storeInfoData.storeId
          });
          if (res.code === 200) {
            const list = [];
            res.data.forEach((item, inx) => {
              if (item.currentStatus === "EMPLOYEE_STATUS_1") {
                item.value = item.userId;
                item.label = item.userName;
                list.push(item);
              }
            });
            this.receiveOption = list;
          } else {
            this.$notify({
              message: res.message,
              type: "error",
              customClass: "dgg-tip-msg"
            });
          }
        }
      } else {
        // 输入了值
        if (this.receiveOption.length > 0) {
          this.receiveOption = this.receiveOption.filter(item => {
            return (
              item.label == this.searchStorePhone ||
              item.phone == this.searchStorePhone
            );
          });
        }
      }
    },
    // 选择项目人
    chooseStoreData(item) {
      this.$nextTick(() => {
        this.receiveForm.code = item.value;
        this.receiveForm.name = item.userName;
        this.receiveForm.projectMembersPhone = item.phone;
        this.showChoosePeopleDialog = false;
        this.choosePeopleData = item;
      });
    },
    // 删除选择的项目人
    deleteChoosePeople() {
      this.$nextTick(() => {
        this.choosePeopleData = "";
        this.receiveForm.code = "";
        this.receiveForm.name = "";
        this.receiveForm.projectMembersPhone = "";
      });
    },
    // 确认接收
    async receiveOrder() {
      if (this.receiveForm.code.length === 0) {
        this.$notify({
          message: "请选择项目负责人",
          type: "error",
          customClass: "dgg-tip-msg"
        });
        return;
      }
      const params = this.receiveItem;
      this.receiveButton = true;
      const res = await this.receive_order({
        projectManagerId: this.receiveForm.code,
        projectManagerName: this.receiveForm.name,
        projectMembersPhone: this.receiveForm.projectMembersPhone,
        id: params.id
      });
      this.receiveButton = false;
      if (res.code === 200) {
        this.receiveDialog = false;
        this.$message.success("接单成功");
        this.receiveForm.code = "";
        this.searchClick();
        this.$bus.$emit("receiveRefresh");
      } else {
        this.$notify({
          message: res.message,
          type: "error",
          customClass: "dgg-tip-msg"
        });
      }
    },
    // 确认拒绝 --
    async showSingleBackCodeDialog(params) {
      const res = await this.refuse_code_tree_book_list({
        code: "QDS_ZYGSSC_REFUSEREASON",
        type: 1,
        level: 1
      });
      if (res.code === 200) {
        this.singleBackCodeOption = res.data;
        this.singleBackCodeDialog = true;
        this.refusedOrderRow = params;
      }
    },
    // 确认拒绝 --  提交确认数据
    async refusedOrder() {
      if (this.singleBackCodeForm.code.length === 0) {
        this.$message.error("请选择拒接原因");
        return;
      }
      const res = await this.refused_order({
        id: this.refusedOrderRow.id,
        refuseReason: this.singleBackCodeForm.code,
        refuseRemark: this.singleBackCodeForm.remark
      });
      if (res.code === 200) {
        this.$message.success("操作成功");
        this.searchClick();
        this.singleBackCodeDialog = false;
      } else {
        this.$notify({
          message: res.message,
          type: "error",
          customClass: "dgg-tip-msg"
        });
      }
    },
    async queryEmit(val, field) {
      if (field === "businessProductCode") {
        await this.zysc_find_product({
          proType: val
        });
        this.$refs["query"].resetFieldValue("productId");
      }
    },
    // 更多搜索条件
    search(val) {
      this.paramsSearchData = val;
      this.paramsData = this.paramsSearchData;
      console.log(this.paramsSearchData, 2222);
    },
    //搜索 -- 点击
    searchClick() {
      this.paramsData = {
        keyWord: this.searchData
      };
    },
    //重置 -- 点击
    resetClick() {
      this.searchData = "";
      this.paramsData = {};
    },
    //查询生产中心 设置的抢单，接单 时间
    async zysc_get_setTimeS() {
      const res = await this.zysc_get_setTime({});
      if (res.code == 200) {
        this.receiptTime =
          "请在" + res.data + "小时内接单，否则订单将退回且影响您的排名";
      }
    }
  }
};
</script>

<style lang="less">
@import "~@/assets/less/main.less"; //引入全局less文件

.receive {
  width: 100%;
  background: rgba(255, 255, 255, 1);
  margin: 0 0 40px;
  border-radius: 0 0 6px 6px;

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
    font-size: 0;
    min-height: 70px;
    padding: 20px 0px;
  }

  .receive-body {
    padding: 0 10px;
  }

  .receive-button {
    border-radius: 4px;
    border: 1px solid rgba(16, 187, 184, 1);
  }

  .receive-radio {
    margin-right: 30px;
  }

  .service-name-sate {
    width: 50px;
    height: 18px;
    border-radius: 10px;
    border: 1px solid rgba(241, 9, 64, 1);
    color: #f10940;
    font-size: 12px;
    padding: 0 6px;
    box-sizing: border-box;
  }

  .service-name-lable {
    width: 350px;
    display: inline-block;
    font-size: 14px;
    font-weight: 400;
    color: rgba(25, 35, 60, 1);
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
  }

  .service-name-cumtorName {
    font-size: 13px;
    font-weight: 400;
    color: rgba(147, 152, 161, 1);
    margin-top: 10px;
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

  .icon_info {
    cursor: pointer;
    margin-right: 30px;
    line-height: 30px;
  }

  /deep/ .el-form {
    .el-form-item {
      font-size: 14px;
      text-align: center;

      .el-form-item__label {
        float: none !important;
        line-height: 30px;
      }

      .el-form-item__content {
        float: none !important;
        display: inline-block;
      }

      .el-textarea {
        width: 175px;
      }
    }
  }

  .el-textarea .el-input__count {
    line-height: 1;
  }
}

.receiveDialog-alert {
  .el-from {
    width: 100%;
  }

  .el-form-item {
    width: 100%;
    height: 40px;
    line-height: 40px;
    display: flex;
    align-items: center;

    &.choose-people {
      position: relative;

      .project-people-dialog {
        position: absolute;
      }

      .show-transactor-people {
        display: inline-block;
        width: 26px;
        height: 26px;
        position: relative;
        font-size: 0;
        vertical-align: top;

        &:hover {
          .dgg-icon {
            display: inline;
          }
        }

        img {
          width: 100%;
          height: 100%;
          border-radius: 50%;
          position: relative;
        }

        .dgg-icon {
          display: none;
          position: absolute;
          top: 0px;
          right: -8px;
          cursor: pointer;
        }
      }

      .show-transactor-name {
        display: inline-block;
        vertical-align: middle;
        max-width: 200px;
        .dgg-text-ellip;
      }

      .project-people-dialog {
        width: 282px;
        background: rgba(255, 255, 255, 1);
        box-shadow: 0px 2px 19px 0px #dadde6;
        border-radius: 4px;
        z-index: 35;
        position: absolute;
        left: 50%;
        transform: translateX(-50%);
        top: 40px;

        .infinite-list {
          max-height: 300px;
          padding: 0 15px;
          padding-top: 20px;
          text-align: left;

          > li {
            width: 100%;
            font-size: 14px;
            color: #19233c;
            line-height: 20px;
            margin: 0 0 20px;
            display: flex;
            justify-content: space-between;
            align-items: center;

            &.active-product-list {
              color: #10bbb8;
            }

            .dgg-text-ellip;

            &:hover {
              color: #10bbb8;
              cursor: pointer;
            }

            span {
              display: inline-block;
              .dgg-text-ellip;

              &:first-child {
                max-width: 60px;
                flex-shrink: 0;
              }

              &:last-child {
                flex: 1;
                text-align: right;
                padding-left: 14px;
              }
            }
          }
        }

        .tab-top {
          width: 100%;

          span {
            display: inline-block;
            width: 50%;
            text-align: center;
            height: 30px;
            line-height: 30px;
            font-size: 14px;
            color: #666873;
            font-weight: 500;
            border-bottom: 2px solid #e3e4e6;
            cursor: pointer;
          }

          .this-btn,
          span:hover {
            color: #10bbb8;
            border-color: #10bbb8;
          }
        }

        .dgg-order-search {
          display: flex;
          align-items: center;
          padding: 15px;
          border-bottom: 1px solid #edeff0;

          .el-input__inner {
            height: 30px;
            line-height: 30px;
            background: none !important;
            border: 1px solid #e3e4e6 !important;
          }
        }

        .no-data {
          max-width: 100%;
          text-align: center;
        }
      }
    }

    .addTransactor {
      color: #c8cfdb;
      vertical-align: middle;
      cursor: pointer;
    }

    > label {
      vertical-align: middle;
      width: 100px;
      text-align: right;
      flex-shrink: 0;
    }

    .el-form-item__content {
      flex: 1;
      text-align: left;

      p {
        max-width: 200px;
        text-align: left;

        .dgg-text-ellip;
      }
    }
  }
}
</style>
