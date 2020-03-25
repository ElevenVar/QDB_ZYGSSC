`<template>
  <!-- 员工管理页面 -->
  <div class="staffAdmin">
    <!-- 顶部搜索模块 -->
    <div class="search-moudle">
      <dgg-input
        v-model="search"
        class="search"
        clearable
        placeholder="输入姓名/手机号"
        @change="onSearchSubmit(search)"
      >
        <dgg-icon
          slot="prefix"
          icon-class="dgg-search"
          svg-width="15px"
          svg-height="15px"
        />
      </dgg-input>
      <dgg-button
        dgg-icon="icon_add"
        class="brabBill-button"
        type="primary"
        @click="staffAdminView = true"
      >
        添加员工
      </dgg-button>
    </div>
    <div v-show="staffData.records.length === 0" class="no-data">
      <bitmap />
    </div>
    <div v-show="staffData.records.length !== 0" class="table-datas">
      <dgg-edit-table
        ref="staffAdminTable"
        :data="staffData.records"
        :columns="columns"
        :page-info="staffData.totalCount"
        :params="tableParams"
        :request-data-api="get_store_user_page"
        @expand-change="loadExpandData"
      />
    </div>

    <!-- 添加员工管理弹窗 -->
    <dgg-modal
      :modal="staffAdminView"
      :hasmodal="true"
      title="添加员工"
      class="add-staffAdmin has-border-modal"
      width="512px"
      @modalAffirm="submitDiolog('staffAdminView')"
      @modalQuit="closeDiolog('staffAdminView')"
    >
      <div class="no-authenticationed">
        <!-- @change="changePhoneVal($event)" -->
        <div class="phone">
          <span>手机号：</span>
          <dgg-input
            v-model="addStaffAdminPhoneInput"
            placeholder="请输入手机号码"
            maxlength="11"
            clearable
            type="tel"
            @input="
              addStaffAdminPhoneInput = addStaffAdminPhoneInput.replace(
                /[^\d]/g,
                ''
              )
            "
            @blur="changePhoneVal(addStaffAdminPhoneInput)"
          />
        </div>
        <div v-if="!addStaffAdminPhoneValid" class="checking-phone">
          <dgg-icon
            slot="prefix"
            icon-class="see-phone-img"
            svg-width="17px"
            svg-height="26px"
          />
          <p>{{ addStaffNoticeText }}</p>
        </div>

        <div
          v-if="addStaffAdminPhoneValid && !staffMsg.certificationStatus"
          class="checking-phone no-phone"
        >
          <p>未实名认证</p>
        </div>

        <div
          v-if="addStaffAdminPhoneValid && staffMsg.certificationStatus"
          class="checking-phone has-authenticationed"
        >
          <div class="title">
            <dgg-icon
              slot="prefix"
              icon-class="finish_task_active"
              svg-width="16px"
              svg-height="16px"
            />
            <h6>
              {{ staffMsg.certificationStatus ? "已实名认证" : "未实名认证" }}
            </h6>
          </div>

          <ul class="user-info">
            <li>
              <label for="">姓名</label>
              <span>{{ staffMsg.realName }}</span>
            </li>
            <li>
              <label for="">电话号码</label>
              <span>{{ staffMsg.phone }}</span>
            </li>
            <li></li>
            <!--  <li>
              <label for="">联系地址</label>
              <span>{{ staffMsg.address }}</span>
            </li> -->
          </ul>
        </div>
        <p v-if="addStaffAdminPhoneValid" class="tips-warning">
          {{ staffMsg.staffMsg }}
        </p>
      </div>
    </dgg-modal>
  </div>
</template>

<script>
import validate from "@/utils/validate";
import checking from "@/utils/checking";
import ExpandTable from "./partTemplate/expandTable";
import Notification from "@/componentsEl/notification/index.js";
import bitmap from "@/views/main/page/components/bitmap.vue";
import { mapActions, mapState } from "vuex";
/* eslint-disable */
export default {
  name: "staffAdmin", //
  components: {
    ExpandTable,
    bitmap
  },
  data() {
    return {
      addStaffNoticeText: "请先输入手机号以查看是否实名认证",
      addStaffAdminPhoneInput: "", //手机号
      phoneAuthenticationed: false, //手机号已认证
      phoneNotAuthenticationed: false, //手机未认证
      staffAdminView: false, //添加员工管理弹窗
      search: "",
      searchText: "",
      setReceiveStatusReq: 0,
      staffMsg: {
        staffMsg: "添加员工时需对方同意"
      },
      //模拟表格的列
      columns: [
        {
          prop: "service_name",
          width: "300",
          label: "姓名",
          type: "isrender",
          render: (h, params) => {
            if (params.row.imgUrl) {
            }
            return (
              <div class="table-user-name">
                <div class="head-img">
                  {params.row.imgUrl ? (
                    <img src={params.row.imgUrl} alt="" />
                  ) : (
                    <dgg-icon
                      slot="prefix"
                      icon-class="icon_headsculpture"
                      svg-width="40px"
                      svg-height="40px"
                    />
                  )}

                  {params.row.authenticationed ? (
                    <dgg-icon
                      slot="prefix"
                      class="authenticationed"
                      icon-class="icon_authentication"
                      svg-width="16px"
                      svg-height="16px"
                    />
                  ) : (
                    ""
                  )}
                </div>
                <span>{params.row.name}</span>
              </div>
            );
          }
        },
        {
          prop: "phone",
          label: "电话",
          width: "230"
        },
        {
          label: "完成率",
          type: "isrender",
          render: (h, params) => {
            //(params.row.startProgress/params.row.endProgress).toFixed(2)*100;
            let progress = 0;
            if (params.row.finishRate) {
              progress = params.row.finishRate;
            }
            let _wap = (
              <div class="order-progress">
                <el-progress percentage={progress} />
              </div>
            );
            if (params.row.currentStatus === "EMPLOYEE_STATUS_2") {
              _wap = <div></div>;
            }
            return _wap;
          }
        },
        {
          prop: "transactor",
          label: "接单",
          type: "isrender",
          width: "120",
          render: (h, params) => {
            // onChange={changeSwitch(item)}

            let _wap = (
              <div class="receipt-switch">
                <dgg-switch
                  value={params.row.receipted}
                  active-value={1}
                  inactive-value={0}
                  width={30}
                  onChange={state => {
                    this.setReceiveStatus(params.row, state);
                    // params.row.receipted = state;
                  }}
                ></dgg-switch>
              </div>
            );
            if (params.row.currentStatus === "EMPLOYEE_STATUS_2") {
              _wap = <div></div>;
            }
            return _wap;
          }
        },
        {
          width: "65",
          label: "操作",
          type: "isrender",
          render: (h, params) => {
            let _wap = (
              <div class="change-data">
                <dgg-button
                  plain
                  style="cursor: pointer;"
                  class="dgg-button-nocolor"
                  onClick={e => {
                    if (params.row.currentStatus === "EMPLOYEE_STATUS_1") {
                      if (params.row.roleCode === "MERCHANT_STORE_OWNER") {
                        this.$alert("店主不可删除", "提示", {
                          confirmButtonText: "确认",
                          type: "warning"
                        });
                      } else {
                        this.$confirm("确认删除？", "提示", {
                          confirmButtonText: "确认",
                          cancelButtonText: "取消",
                          type: "warning"
                        })
                          .then(async res => {
                            let resp = await this.deal_employee({
                              relateId: params.row.id
                            });
                            if (resp.code === 200) {
                              if (this.storeInfoData.storeId) {
                                this.get_store_user_page(this.tableParams);
                              }
                            } else if (resp.code === 7001) {
                              this.$confirm(
                                "该员工存在办理中的订单或业务，无法删除，请确认订单和任务移交后再进行移除",
                                "提示",
                                {
                                  confirmButtonText: "我知道了",
                                  showCancelButton: false,
                                  type: "warning"
                                }
                              ).then(() => {
                                //点击确定时间
                              });
                            } else {
                              this.$notify({
                                message: resp.message,
                                type: "error",
                                customClass: "dgg-tip-msg"
                              });
                            }
                          })
                          .catch(error => {});
                      }
                    }
                  }}
                >
                  {params.row.currentStatus === "EMPLOYEE_STATUS_1"
                    ? "删除"
                    : "待确认"}
                </dgg-button>
              </div>
            );
            if (params.row.currentStatus === "EMPLOYEE_STATUS_2") {
              _wap = <div class="employee_state">邀请中</div>;
            }
            return _wap;
          }
        },
        {
          //扩展表格
          type: "expand",
          width: "90",
          fixed: "right",
          expandRender: (h, params) => {
            let _wap = (
              <div class="change-data">
                <dgg-button
                  plain
                  class="dgg-button-nocolor"
                  style="cursor: pointer;"
                >
                  展开数据
                </dgg-button>
              </div>
            );
            if (params.data.currentStatus === "EMPLOYEE_STATUS_2") {
              _wap = <div></div>;
            }
            return _wap;
          },
          render: (h, params) => {
            return h(ExpandTable, {
              props: {
                data: params.row.children
              }
            });
          }
        }
      ],
      //模拟表格数据
      list: []
    };
  },
  created() {},
  async mounted() {},
  watch: {
    addStaffAdminPhoneInput(val) {
      if (val.length > 0) {
        this.addStaffNoticeText = "请输入正确手机号以查看是否实名认证";
      } else {
        this.addStaffNoticeText = "请先输入手机号以查看是否实名认证";
      }
    },
    async addStaffAdminPhoneValid(val) {
      //请求员工信息
      if (val) {
        let res = await this.get_store_adduser({
          storeId: this.storeInfoData.storeId,
          phone: this.addStaffAdminPhoneInput
        });
        if (res.code === 200) {
          let objKeys = Object.keys(res.data);
          if (objKeys.length === 0) {
            this.staffMsg = res.data;
            this.addStaffNoticeText = "未查询到该员工";
            this.staffMsg.staffMsg = "未查询到该员工";
            this.$message.error("未查询到该员工");
          } else {
            this.staffMsg = res.data;
            if (this.staffMsg.addSign === 0) {
              this.staffMsg.staffMsg = "可添加，添加员工时需对方同意";
            } else if (this.staffMsg.addSign === 1) {
              this.staffMsg.staffMsg = "已加入";
            } else if (this.staffMsg.addSign === 2) {
              this.staffMsg.staffMsg = "添加中";
            } else if (this.staffMsg.addSign === 3) {
              this.staffMsg.staffMsg = "用户是该店店主";
            }
          }
        } else {
          this.$notify({
            message: res.message,
            type: "error",
            customClass: "dgg-tip-msg"
          });
        }
      }
    }
  },
  computed: {
    ...mapState(["storeInfoData"]),
    ...mapState("teamSettingModule", ["staffData"]),
    tableParams() {
      return {
        storeId: this.storeInfoData.storeId,
        roleCode: "MERCHANT_EMPLOYEE",
        // merCheck: 1, //1只查员工
        userOrPhone: this.searchText
      };
    },
    addStaffAdminPhoneValid() {
      const phoneReg = /^0?(13|14|15|16|17|18|19)[0-9]{9}$/i; // 手机号正则表达式
      if (phoneReg.test(this.addStaffAdminPhoneInput)) {
        return true;
      }
      return false;
    }
  },

  methods: {
    ...mapActions("teamSettingModule", [
      "get_store_user_page",
      "get_store_adduser",
      "add_store_user",
      "deal_employee",
      "get_order_data",
      "set_employee_receive_order"
    ]),
    //确认弹窗
    async submitDiolog(target) {
      if (this.addStaffAdminPhoneInput) {
        if (this.staffMsg.addSign !== 0) {
          Notification.error(this.staffMsg.staffMsg);
          return;
        }
        // if (!this.staffMsg.certificationStatus) {
        //   Notification.error("该员工未实名，不能邀请");
        //   return;
        // }
        let res = await this.add_store_user({
          storeId: this.storeInfoData.storeId,
          employeeId: this.staffMsg.employeeId
        });
        if (res.code === 200) {
          this[target] = false;
          this.addStaffAdminPhoneInput = ""; //清空手机号
          if (this.storeInfoData.storeId) {
            this.get_store_user_page(this.tableParams);
          }
          // 刷新列表
        } else {
          this.$notify({
            message: res.message,
            type: "error",
            customClass: "dgg-tip-msg"
          });
        }
      }
    },
    //关闭弹窗
    closeDiolog(target) {
      this[target] = false;
      this.addStaffAdminPhoneInput = ""; //清空手机号
    },
    //修改接单状态
    async setReceiveStatus(row, status) {
      if (this.setReceiveStatusReq === 1) {
        row.receipted === 1 ? (row.receipted = 0) : (row.receipted = 1);
        return;
      }
      this.setReceiveStatusReq = 1;
      let res = await this.set_employee_receive_order({
        relateId: row.id,
        targetStatus: status
      });
      this.setReceiveStatusReq = 0;
      if (res.code === 200) {
        row.receipted = status;
        this.$notify({
          message: "操作成功",
          type: "success",
          customClass: "dgg-tip-msg"
        });
      } else {
        this.$notify({
          message: res.message,
          type: "error",
          customClass: "dgg-tip-msg"
        });
      }
    },
    //搜索框回车键事件
    onSearchSubmit(e) {
      this.searchText = e;
    },
    //添加员工修改手机号
    changePhoneVal(e) {
      // checking.checkPhoneVal(e, this);
    },
    // 表格扩展数据
    async loadExpandData(row, node) {
      console.log(JSON.parse(JSON.stringify(row)), "点击员工的值");
      if (row.currentStatus === "EMPLOYEE_STATUS_1") {
        let res = await this.get_order_data({
          userId: row.userId
        });
        if (res.code === 200) {
          let sonData = [
            {
              finishNum: res.data.countOrder.complete,
              dealingNum: res.data.countOrder.handle,
              countTask: res.data.countTask.handle,
              completion: res.data.countOrder.completion
            }
          ];
          this.$set(row, "children", sonData);
        } else {
          this.$notify({
            message: res.message,
            type: "error",
            customClass: "dgg-tip-msg"
          });
        }
      }
    }
  }
};
</script>
<style lang="less" scoped>
@import "~@/assets/less/main.less"; //引入全局less文件
.no-data {
  text-align: center;
  font-size: 14px;
  padding-top: 100px;
  min-height: 650px;
}
.staffAdmin {
  padding: 0 10px 10px;
  .search-moudle {
    padding: 0 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .search {
      width: 270px;
      height: 30px;
      /deep/.el-input__inner {
        background-color: #f0f2f5;
      }
    }
    /deep/.el-input__inner:hover {
      border-color: #18ccc9;
    }
  }
  .table-datas {
    padding: 0 30px;
    margin-top: 20px;
    /deep/.el-table {
      &::before {
        height: 0;
      }
    }
    /deep/.table-user-name {
      display: flex;
      align-items: center;
      flex-wrap: nowrap;
      .head-img {
        position: relative;
        width: 40px;
        height: 40px;
        border-radius: 50%;
        flex-shrink: 0;
        position: relative;
        .authenticationed {
          position: absolute;
          right: 0;
          bottom: 0;
        }
        img {
          width: 100%;
          height: 100%;
          border-radius: 50%;
        }
      }
      & > span {
        display: inline-block;
        flex: 1;
        .dgg-text-ellip;
        font-size: 14px;
        color: #19233c;
        margin-left: 12px;
      }
    }
    /deep/.order-progress {
      max-width: 230px;
      .el-progress-bar__outer {
        height: 4px !important;
        width: 180px;
      }

      .el-progress__text {
        font-size: 13px !important;
        font-weight: 400;
        color: #10bbb8;
        line-height: 18px;
        max-width: 38px;
        margin-left: 20px;
        .dgg-text-ellip;
      }

      & > p {
        font-size: 13px;
        font-weight: 400;
        color: #9398a1;
        line-height: 18px;
        margin-top: 9px;
        .dgg-text-ellip;
      }
    }
    /deep/.el-table__header th:not(:first-child) {
      padding-left: 0;
    }
    /deep/.el-table tr td:not(:first-child) {
      padding-left: 0;
    }
    /deep/.change-data {
      .dgg-button-nocolor {
        height: 26px !important;
        padding: 0 12px !important;
        line-height: 24px;
      }
    }
  }

  /deep/.add-staffAdmin {
    .el-dialog__header {
      height: 60px;
      padding: 0 20px;
      line-height: 60px;
      display: flex;
      align-items: center;
      .el-dialog__title {
        display: inline-block;
        height: 100%;
        line-height: inherit;
        background-color: transparent;
        .dgg-text-ellip;
      }
    }
    .el-dialog__body {
      padding: 20px 40px 20px 50px;
      border-bottom: 1px solid #e3e4e6;
    }
    .el-dialog__footer {
      padding: 20px;
      height: 70px;
    }
    .no-authenticationed {
      .phone {
        height: 70px;
        padding: 0 30px 0 20px;
        display: flex;
        align-items: center;
        flex-wrap: nowrap;
        justify-content: space-between;
        .el-input {
          width: 277px;
        }
      }
      .checking-phone {
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        height: 164px;
        width: 100%;
        background-color: #f5f7fa;

        p {
          width: 100%;
          margin-top: 17px;
          font-size: 13px;
          color: #19233c;
          line-height: 18px;
          .dgg-text-ellip;
          text-align: center;
          padding: 0 20px;
        }
      }
      .no-phone {
        p {
          margin-top: 0;
          font-size: 16px;
          font-weight: 500;
          color: #9398a1;
          line-height: 22px;
        }
      }
      .has-authenticationed {
        text-align: left;
        align-items: flex-start;
        padding: 16px 22px 22px;
        justify-content: space-between;
        .title {
          display: flex;
          align-items: center;
          flex-wrap: nowrap;
          height: 22px;
          width: 100%;
          .dgg-icon {
            margin-right: 26px;
          }
          h6 {
            flex: 1;
            .dgg-text-ellip;
            font-size: 16px;
            font-weight: 500;
            color: #10bbb8;
          }
        }
        .user-info {
          width: 100%;
          li {
            height: 20px;
            display: flex;
            align-items: center;
            margin-bottom: 10px;
            &:last-child {
              margin-bottom: 0;
            }
            label {
              display: inline-block;
              width: 105px;
              height: 100%;
              flex-shrink: 0;
              text-align: right;
              padding-right: 45px;
              font-size: 14px;
              color: #9398a1;
              .dgg-text-ellip;
              span {
                flex: 1;
                .dgg-text-ellip;
                color: #19233c;
                font-size: 14px;
              }
            }
            span {
              flex: 1;
              .dgg-text-ellip;
              display: inline-block;
              height: 100%;
            }
          }
        }
      }
    }
    .tips-warning {
      font-size: 13px;
      color: #9398a1;
      line-height: 18px;
      .dgg-text-ellip;
      margin-top: 12px;
      &::before {
        content: "*";
        color: #f10940;
        margin-right: 4px;
      }
    }
  }
  /deep/.employee_state {
    border: 1px solid #ddd;
    color: #ddd;
    border-radius: 20px;
    text-align: center;
  }
}
</style>
