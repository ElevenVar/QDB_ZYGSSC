`<template>
  <!-- 账户管理页面 -->
  <div class="accountAdmin">
    <!--账户余额 start-->
    <div class="alance-text">
      <b>账户余额(元)</b>
      <span>{{ balance }}</span>
    </div>
    <!--账户余额 end-->
    <!--交易明细 start -->
    <div class="accountAdmin-detail">
      <div class="detail-title">
        <dgg-icon icon-class="icon_detail" svg-width="22px" svg-height="22px" />
        <b>交易明细</b>
      </div>
      <div class="search-list">
        <dgg-query
          ref="query_data"
          :query-list="queryList"
          :can-export="false"
          :has-btn="false"
          @changeEvent="searchBillList"
        />
      </div>
    </div>
    <!--交易明细 end -->
    <section class="data-text">
      <label
        >总收入: <span>￥{{ income }}</span></label
      >
      <label
        >总支出: <span>￥{{ expend }}</span></label
      >
    </section>
    <div class="no-data" v-show="dataList.records.length === 0">
      <bitmap></bitmap>
    </div>
    <!-- 表格 start -->
    <div class="brabBill-body" v-show="dataList.records.length !== 0">
      <dgg-edit-table
        :data="dataList.records"
        :columns="columns"
        :params="testParams"
        :pageInfo="dataList.totalCount"
        :requestDataApi="get_bill_list"
      />
    </div>
    <!-- 表格 end -->
  </div>
</template>

<script>
import bitmap from "@/views/main/page/components/bitmap.vue";
import { mapActions, mapState } from "vuex";
/* eslint-disable */
export default {
  name: "accountAdmin",
  components: {
    bitmap
  },
  data() {
    return {
      balance: "0.00",
      income: "0.00", //总收入
      expend: "0.00", //总支出
      tableParams: {},
      columns: [
        {
          prop: "type",
          width: "100",
          label: "类型"
        },
        { prop: "money", label: "金额", width: "140" },
        { prop: "currentStae", label: "当前状态" },
        { prop: "tradingReason", label: "交易原因", width: "150" },
        {
          prop: "applyTime",
          label: "申请时间",
          width: "200",
          type: "isrender",
          render: (h, params) => {
            return (
              <div>{params.row.applyTime ? params.row.applyTime : "--"}</div>
            );
          }
        },
        {
          prop: "accoutnTime",
          label: "到账时间",
          width: "200",
          type: "isrender",
          render: (h, params) => {
            return (
              <div>
                {params.row.accoutnTime ? params.row.accoutnTime : "--"}
              </div>
            );
          }
        },
        { prop: "remark", label: "备注", width: "200" }
      ],
      queryList: [
        {
          field: "listType",
          type: "select",
          label: "类型",
          width: "220px",
          value: "",
          options: [
            { value: "1", label: "全部" },
            { value: "2", label: "收入" },
            { value: "3", label: "支出" }
          ]
        },
        {
          field: "listTime",
          type: "daterange",
          label: "时间",
          width: "220px",
          value: ""
        }
      ]
    };
  },
  created() {},
  async mounted() {
    //  请求账户余额等信息
    console.log(this.storeInfoData.storeId, "请求余额-----------");
    if (this.storeInfoData.storeId) {
      //gs2016-2019-12-30修改
      let balance = await this.get_balance({
        affiliatioApp: "QDS_AFFILIATIO_APP_QDS",
        storeId: this.storeInfoData.storeId
      });
      if (balance.code === 200) {
        this.balance = balance.data.totalBalance;
        this.income = balance.data.amountIn;
        this.expend = balance.data.amountOut;
      }
    }
  },
  computed: {
    ...mapState(["userId", "storeInfoData"]),
    ...mapState("accountManageModule", ["dataList"]),
    testParams() {
      return {
        affiliatioApp: "QDS_AFFILIATIO_APP_QDS",
        storeId: this.storeInfoData.storeId,
        ...this.tableParams
      };
    }
  },

  methods: {
    ...mapActions("accountManageModule", ["get_balance", "get_bill_list"]),
    searchBillList() {
      let params = this.$refs.query_data.list;
      let tableParams = {};
      params.forEach((item, index) => {
        if (item.field === "listType") {
          if (item.value === "3") {
            tableParams.isIncome = 0;
          }
          if (item.value === "2") {
            tableParams.isIncome = 1;
          }
        }
        if (item.field === "listTime") {
          if (item.value && item.value.length > 0) {
            tableParams.startTime = item.value[0].getTime();
            tableParams.endTime = item.value[1].getTime();
          }
        }
      });
      this.tableParams = tableParams;
    }
  }
};
</script>
<style lang="less" scoped>
@import "~@/assets/less/main.less"; //引入全局less文件
.brabBill-body {
  padding: 0 30px;
}
.no-data {
  text-align: center;
  font-size: 14px;
  padding-top: 100px;
  min-height: 650px;
}
.accountAdmin {
  width: 100%;
  padding: 0 30px;
  .alance-text {
    width: 100%;
    height: 60px;
    line-height: 60px;
    background: #e7f7f7;
    padding: 0 30px;
    text-align: left;
    font-size: 15px;
    font-family: Microsoft YaHei;
    font-weight: bold;
    color: #666873;
    margin: 0 0 15px;
    span {
      font-size: 24px;
      font-family: DIN;
      font-weight: 500;
      color: #10bbb8;
      padding: 0 0 0 10px;
      vertical-align: middle;
    }
  }
  .accountAdmin-detail {
    width: 100%;
    display: -webkit-flex;
    display: -ms-flex;
    display: -moz-flex;
    display: flex;
    -webkit-align-items: center;
    -moz-align-items: center;
    align-items: center;
    -webkit-justify-content: space-between;
    -moz-justify-content: space-between;
    -ms-justify-content: space-between;
    justify-content: space-between;
    .detail-title {
      .dgg-icon {
        vertical-align: middle;
      }
      b {
        font-size: 16px;
        font-family: Microsoft YaHei;
        color: #19233c;
        line-height: 22px;
        vertical-align: middle;
        margin-left: 5px;
      }
    }
  }
  .data-text {
    padding: 15px 0 20px;
    label {
      font-size: 14px;
      font-family: Microsoft YaHei;
      font-weight: 400;
      color: #666873;
      padding-right: 40px;
      span {
        color: #10bbb8;
        margin-left: 5px;
      }
    }
  }
}
</style>
